import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
export default function Popup() {
  // State to handle the UI text and loading spinner logic and title of the page
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    // this get the title of the current page
    chrome.tabs
      .query({
        active: true,
        currentWindow: true,
      })
      .then((tabs) => {
        if (tabs[0]) {
          setTitle(tabs[0].title || "");
        }
      });
  }, []);

  const handleResetButton = () => {
    setStatus("");
    setIsLoading(false);
  };

  // This function is triggered when the user clicks the "Summarize Page" button
  const handleSummarize = async () => {
    setIsLoading(true);
    setStatus("Extracting text from page...");

    try {
      //  Find the active tab that the user is currently looking at
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab.id) throw new Error("Could not find active tab.");

      //  Send the message to the content script injected into THAT specific tab
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: "EXTRACT_CONTENT",
      });

      // Handle the response sent back from the content script
      if (response && response.success) {
        const SummaryResponse = await chrome.runtime.sendMessage({
          action: "SUMMARIZE_TEXT",
          text: response.content,
        });

        if (SummaryResponse && SummaryResponse.success) {
          setStatus(SummaryResponse.summary);
          console.log(SummaryResponse);
        } else {
          setStatus("AI processing failed.");
        }
      }
    } catch {
      setStatus(
        "Error: Could not connect to content script. Try refreshing the webpage.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 w-full min-h-[300px] flex flex-col items-center">
      <h1 className="text-2xl font-bold text-blue-800 mb-4 text-center">
        {title}
      </h1>

      {/* The display area for our status or summary */}
      <div className=" whitespace-pre-wrap leading-relaxed  w-full p-4 bg-white border border-gray-200 rounded text-sm text-gray-700 min-h-[350px] max-h-[400px] overflow-y-auto mb-4">
        {status ? (
          status.includes("*") || status.includes("The article") ? (
            <ReactMarkdown>{status}</ReactMarkdown>
          ) : (
            status
          )
        ) : (
          // If status is EMPTY, do this:
          <p className="text-sm text-gray-400 text-center mt-10">
            Click the summarize button to get a summary of the current page.
          </p>
        )}
      </div>
      {/* The trigger button */}
      <div className="w-full text-end ">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {status ? (
              <button
                onClick={handleResetButton}
                className={` text-white font-semibold py-2 px-4  rounded transition-colors mb-4 ${"bg-red-500 hover:bg-red-700"}`}
              >
                Reset
              </button>
            ) : (
              <button
                onClick={handleSummarize}
                disabled={isLoading}
                className={` text-white font-semibold py-2 px-4  rounded transition-colors mb-4 ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Summarize Page
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
