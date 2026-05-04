import { generateSummary } from "./ai-provider";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "SUMMARIZE_TEXT") {
    (async () => {
      try {
        const summary = await generateSummary(request.text);

        sendResponse({
          success: true,
          summary: summary,
        });
      } catch (error) {
        sendResponse({
          success: false,
          summary: `Error: ${error}`,
        });
      }
    })();
    // I returned TRUE  to tell Chrome this is an asynchronous response
    return true;
  }
});
