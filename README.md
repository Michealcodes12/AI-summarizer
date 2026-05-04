# AI Web Page Summarizer Extension

A lightweight, lightning-fast Chrome extension that extracts text from any web page and generates a concise, highly readable summary using Google's Gemini AI. Built with React, TypeScript, Vite, and Tailwind CSS.

## Setup Instructions

Follow these steps to run the extension locally:

### 1. Prerequisites

- Node.js (v16 or higher)
- npm or yarn installed
- A Google Gemini API Key (Get one from Google AI Studio)

### 2. Installation

Clone the repository and install the dependencies:

```bash
git clone <your-repo-url>
cd <your-project-folder>
npm install
```

Create a .env file in the root of your project and add your Gemini API key:

```bash
VITE_GEMINI_API_KEY=your_api_key_here
```

Start the Vite development server:

```bash
npm run dev
```

Then you can open chrome and do the following:

1. Type `chrome://extensions` in the address bar and press Enter
2. Enable "Developer mode" (toggle switch, top right)
3. Click "Load unpacked"
4. Navigate to your project folder and select the `dist` folder
5. Click "Select"

## Architecture Explanation

This extension follows a modular separation of concerns which is divided into three main operational layers:

The UI Layer ---React Popup:
Built with React and Tailwind CSS. It handles user interactions, manages state (loading, error, success), and renders the final markdown using react-markdown.

The Extraction Layer --- Content Script:
Injected into the active tab only when requested. Its sole job is to read the DOM, extract the readable text, and pass it back to the background worker.

The Backend Layer --- Service Worker:
The main.ts and ai-provider.ts files act as the backend. They listen for messages from the popup, securely communicate with the Gemini API, handle all error parsing, and return the data.

The Caching Layer (Storage Utility):
A dedicated storage.ts utility checks chrome.storage.local before making API calls to ensure instant loads for previously summarized URLs.

## AI Integration

This project integrates Gemini 2.5 Flash using the official @google/genai SDK.
The AI is instructed to act as a "highly skilled reading assistant." The prompt strictly enforces a format: bullet points, bold titles, and an estimated reading time.

Error Handling: The AI provider is equipped with a custom error-parsing block. Instead of crashing on network failures or API limits (like 429 Too Many Requests), it intercepts the Google SDK errors, extracts the human-readable string using Regex, and passes it securely to the UI's error state.

## Security Decisions

No Exposed Secrets: The VITE_GEMINI_API_KEY is injected via environment variables and is never hardcoded or pushed to version control.

Secure API Calls: All communication with the Gemini API is routed through the official SDK, which enforces HTTPS encryption, preventing man-in-the-middle (MITM) attacks.

Minimal Permissions: The manifest.json intentionally avoids the overly broad permission. By using activeTab, the extension only accesses the DOM after explicit user invocation.

Message Validation: The Chrome messaging ports (chrome.runtime.sendMessage) use strict action-typing. The background worker verifies the action string before executing any logic, preventing rogue scripts from triggering API calls.

XSS Prevention: Injected content and AI responses are never rendered using vanilla innerHTML. React's state management naturally sanitizes strings, and react-markdown was installed to safely parses the AI's output into structural components.

## Trade-offs

Client-Side API Calls vs. Dedicated Backend:

Trade-off: For this project, the API calls are made directly from the extension's background worker.

Reason: This allows for a serverless, zero-cost deployment. However, in a large-scale production environment, the API key within the bundle could theoretically be reverse-engineered. The ideal future state would route requests through a dedicated backend proxy.

Raw Text Extraction vs. Chunking:

Trade-off: The content script grabs the page text and sends it to the AI in one massive block.

Reasoning: Gemini 2.5 Flash has a massive context window (up to 1M tokens), which allows us to skip building complex text-chunking algorithms. The trade-off is higher token usage per request, but it vastly simplifies the architecture.
