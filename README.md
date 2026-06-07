# PDF Intelligence Extractor

A browser-based tool that lets users upload a PDF and extract key details using Google's Gemini AI. No backend is required: the app runs entirely in the browser and can be hosted on GitHub Pages.

## Features

- Paste a Gemini API key at runtime
- Upload one PDF file
- Send the PDF directly from the browser to the Gemini API
- Extract a document title, type, summary, entities, topics, action items, and conclusions
- Display results in a clean structured layout
- No install, no build step, no server

## Tech Stack

- React 18 via CDN
- ReactDOM 18 via CDN
- Babel Standalone via CDN for in-browser JSX
- Google Gemini REST API with `gemini-2.5-flash`
- Static HTML, CSS, and JavaScript

## Project Structure

```text
pdf-ai-extractor/
├── index.html
├── app.jsx
├── styles.css
└── README.md
```

## Setup

1. Create a public GitHub repository.
2. Clone it locally:

```bash
git clone https://github.com/YOUR_USERNAME/pdf-ai-extractor.git
cd pdf-ai-extractor
```

3. Add these project files to the repo root:

- `index.html`
- `app.jsx`
- `styles.css`
- `README.md`

4. Open `index.html` in a browser, or serve the folder with any static file server.

No `npm install`, `package.json`, or build command is required.

## Get a Gemini API Key

1. Go to https://aistudio.google.com
2. Sign in with your Google account.
3. Click **Get API Key**.
4. Create and copy an API key.
5. Paste the key into the app when you use it.

The key is not stored by this app.

## How It Works

1. User opens the site.
2. User pastes their own Gemini API key.
3. User uploads a PDF file.
4. The app converts the PDF to base64 in the browser.
5. The app sends the PDF directly to Google's Gemini API using `gemini-2.5-flash`.
6. Gemini analyzes the document and returns structured JSON.
7. The app renders the extracted details.

The extraction asks for:

- Document title and type
- One-paragraph summary
- Key entities: people, organizations, dates, and locations
- Main topics or themes
- Important action items
- Conclusions

## Privacy

The API key and PDF are sent directly from the user's browser to Google's Gemini API. Nothing is stored on a custom server, and this project does not use localStorage or sessionStorage for the key or document.

## GitHub Pages Deployment

1. Push the files to the `main` branch.
2. Open the repository on GitHub.
3. Go to **Settings** > **Pages**.
4. Under **Source**, select **Deploy from a branch**.
5. Choose the `main` branch and `/ (root)` folder.
6. Click **Save**.

Your site will be available at:

```text
https://YOUR_USERNAME.github.io/pdf-ai-extractor
```

## Optional Future Enhancements

- Support multiple PDF uploads
- Export extracted data as JSON or text
- Add a dark/light mode toggle
- Support DOCX and TXT files
- Save extraction history in localStorage
- Let users choose custom extraction prompts

## License

MIT License. Free to use and modify.
