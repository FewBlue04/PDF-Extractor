# PDF Intelligence Extractor

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-0d766e)](https://fewblue04.github.io/PDF-Extractor/)
[![Built with React](https://img.shields.io/badge/React-18-61dafb)](https://react.dev/)
[![AI Model](https://img.shields.io/badge/Gemini-2.5%20Flash-4285f4)](https://ai.google.dev/)

PDF Intelligence Extractor is a browser-based tool for uploading a PDF and extracting structured insights with Google's Gemini API. It runs entirely on the frontend, requires no backend, and is deployable as a static GitHub Pages site.

## Live Site

https://fewblue04.github.io/PDF-Extractor/

## Overview

Users provide their own Gemini API key at runtime, upload a PDF, and receive a structured document analysis that includes the document title, type, summary, key entities, topics, action items, and conclusions.

The application is designed as a lightweight portfolio project: simple to run, easy to deploy, and transparent about how user data is handled.

## Features

- Browser-only PDF analysis
- Runtime Gemini API key entry
- Native PDF submission to Gemini as inline file data
- Structured extraction for summaries, entities, topics, action items, and conclusions
- Clear loading, validation, success, and error states
- No backend, database, build system, or package installation

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18 via CDN |
| Rendering | ReactDOM 18 via CDN |
| JSX Support | Babel Standalone via CDN |
| AI | Google Gemini REST API |
| Model | `gemini-2.5-flash` |
| Hosting | GitHub Pages |

## Project Structure

```text
PDF-Extractor/
├── index.html
├── app.jsx
├── styles.css
└── README.md
```

## How It Works

1. The user opens the GitHub Pages site.
2. The user pastes their own Gemini API key.
3. The user uploads a PDF file.
4. The browser converts the PDF to base64.
5. The app sends the PDF directly to Google's Gemini API.
6. Gemini returns structured JSON.
7. The app renders the extracted intelligence in a clean results layout.

The app requests the following fields:

- Document title
- Document type
- One-paragraph summary
- People, organizations, dates, and locations
- Main topics or themes
- Action items
- Conclusions

## Privacy

This project does not use a custom backend. The Gemini API key and uploaded PDF are sent directly from the user's browser to Google's Gemini API.

The app does not store the API key or PDF in localStorage, sessionStorage, a database, or any custom server.

## Running Locally

No installation is required. Open `index.html` directly in a browser, or serve the folder with any static file server.

```bash
git clone https://github.com/FewBlue04/PDF-Extractor.git
cd PDF-Extractor
```

Then open:

```text
index.html
```

## Getting a Gemini API Key

1. Go to https://aistudio.google.com
2. Sign in with a Google account.
3. Click **Get API Key**.
4. Create and copy an API key.
5. Paste the key into the app when using the extractor.

Do not commit API keys to this repository.


## Future Enhancements

- Multiple PDF uploads
- Export results as JSON or text
- Dark and light theme toggle
- Support for DOCX and TXT files
- Saved extraction history
- User-defined extraction prompts

## License

MIT License. Free to use and modify.
