import { extractMainContent } from "./scraper";

// Listen for messages from the Popup or Background script
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "EXTRACT_CONTENT") {
    try {
      const text = extractMainContent();

      // Send the scraped text back to whoever asked for it
      sendResponse({ success: true, content: text });
    } catch (error) {
      // Handle the error gracefully if the page has no text
      sendResponse({ success: false, error: (error as Error).message });
    }
  }

  // Return true to indicate we will send a response asynchronously
  // (Required by Chrome messaging rules)
  return true;
});
