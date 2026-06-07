const { useMemo, useState } = React;

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

const extractionPrompt = `
You are a careful document intelligence analyst. Analyze the attached PDF and return only valid JSON.

Use this exact schema:
{
  "title": "string",
  "documentType": "string",
  "summary": "one paragraph string",
  "entities": {
    "people": ["string"],
    "organizations": ["string"],
    "dates": ["string"],
    "locations": ["string"]
  },
  "topics": ["string"],
  "actionItems": ["string"],
  "conclusions": ["string"]
}

If a field is not present in the document, use an empty string or empty array. Do not wrap the JSON in markdown.
`;

function App() {
  const [apiKey, setApiKey] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [rawResult, setRawResult] = useState("");

  const fileLabel = useMemo(() => {
    if (!file) {
      return "Choose a PDF";
    }

    const sizeInMb = file.size / (1024 * 1024);
    return `${file.name} (${sizeInMb.toFixed(2)} MB)`;
  }, [file]);

  const isLoading = status === "loading";

  function handleFileChange(event) {
    setError("");
    setResult(null);
    setRawResult("");
    setFile(event.target.files?.[0] || null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setResult(null);
    setRawResult("");

    const validationError = validateInputs(apiKey, file);
    if (validationError) {
      setError(validationError);
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const base64Pdf = await fileToBase64(file);
      const response = await fetch(GEMINI_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey.trim(),
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: extractionPrompt },
                {
                  inline_data: {
                    mime_type: "application/pdf",
                    data: base64Pdf,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.error?.message || `Gemini request failed with status ${response.status}.`);
      }

      const text = extractGeminiText(payload);
      if (!text) {
        throw new Error("Gemini returned an empty response. Try a smaller PDF or a different document.");
      }

      setRawResult(text);
      setResult(parseGeminiJson(text));
      setStatus("success");
    } catch (err) {
      setError(err.message || "Something went wrong while extracting the PDF.");
      setStatus("error");
    }
  }

  return (
    <main className="app-shell">
      <section className="workspace" aria-labelledby="app-title">
        <div className="intro">
          <p className="eyebrow">Browser-only Gemini PDF analysis</p>
          <h1 id="app-title">PDF Intelligence Extractor</h1>
          <p>
            Upload a PDF, use your own Gemini API key, and extract a title, summary, entities,
            topics, action items, and conclusions without sending anything to a custom server.
          </p>
        </div>

        <form className="extractor" onSubmit={handleSubmit}>
          <label className="field">
            <span>Gemini API key</span>
            <input
              type="password"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              placeholder="Paste your API key"
              autoComplete="off"
              disabled={isLoading}
            />
          </label>

          <label className="upload-box">
            <input type="file" accept="application/pdf,.pdf" onChange={handleFileChange} disabled={isLoading} />
            <span className="upload-title">{fileLabel}</span>
            <span className="upload-meta">PDF only, up to 50 MB</span>
          </label>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Extracting..." : "Extract Intelligence"}
          </button>

          <p className="privacy-note">
            Your key and PDF are sent directly from this browser to Google&apos;s Gemini API. They are not stored here.
          </p>
        </form>
      </section>

      {status === "loading" && (
        <section className="status-panel" aria-live="polite">
          <div className="spinner" aria-hidden="true"></div>
          <p>Gemini is reading the PDF and shaping the extraction.</p>
        </section>
      )}

      {error && (
        <section className="error-panel" aria-live="assertive">
          <h2>Extraction failed</h2>
          <p>{error}</p>
        </section>
      )}

      {status === "success" && (
        <section className="results" aria-live="polite">
          <ResultView result={result} rawResult={rawResult} />
        </section>
      )}
    </main>
  );
}

function ResultView({ result, rawResult }) {
  if (!result) {
    return (
      <article className="result-card">
        <h2>Gemini response</h2>
        <pre className="raw-output">{rawResult}</pre>
      </article>
    );
  }

  return (
    <>
      <article className="result-card summary-card">
        <div>
          <p className="eyebrow">Document</p>
          <h2>{result.title || "Untitled document"}</h2>
        </div>
        <span className="type-badge">{result.documentType || "Unknown type"}</span>
        <p>{result.summary || "No summary returned."}</p>
      </article>

      <div className="result-grid">
        <ListCard title="People" items={result.entities?.people} />
        <ListCard title="Organizations" items={result.entities?.organizations} />
        <ListCard title="Dates" items={result.entities?.dates} />
        <ListCard title="Locations" items={result.entities?.locations} />
        <ListCard title="Topics" items={result.topics} />
        <ListCard title="Action Items" items={result.actionItems} />
        <ListCard title="Conclusions" items={result.conclusions} />
      </div>
    </>
  );
}

function ListCard({ title, items }) {
  const list = Array.isArray(items) ? items.filter(Boolean) : [];

  return (
    <article className="result-card">
      <h3>{title}</h3>
      {list.length > 0 ? (
        <ul>
          {list.map((item, index) => (
            <li key={`${title}-${index}`}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="empty-state">No items found.</p>
      )}
    </article>
  );
}

function validateInputs(apiKey, file) {
  if (!apiKey.trim()) {
    return "Paste a Gemini API key before extracting.";
  }

  if (!file) {
    return "Choose a PDF file before extracting.";
  }

  const looksLikePdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!looksLikePdf) {
    return "Only PDF files are supported in this version.";
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "This PDF is larger than 50 MB. Choose a smaller file for inline Gemini processing.";
  }

  return "";
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      resolve(dataUrl.split(",")[1] || "");
    };
    reader.onerror = () => reject(new Error("Could not read the PDF file."));
    reader.readAsDataURL(file);
  });
}

function extractGeminiText(payload) {
  return payload?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();
}

function parseGeminiJson(text) {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const jsonStart = cleaned.indexOf("{");
    const jsonEnd = cleaned.lastIndexOf("}");
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      try {
        return JSON.parse(cleaned.slice(jsonStart, jsonEnd + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
