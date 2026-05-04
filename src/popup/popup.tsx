import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { getCachedSummary, saveSummaryToCache } from "../utils/storage";
import Button from "./component/Button";
import CopyButton from "./component/CopyButton";
export default function Popup() {
  // State to handle the UI text and loading spinner logic and title of the page
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      // this get the title of the current page
      await chrome.tabs
        .query({
          active: true,
          currentWindow: true,
        })
        .then((tabs) => {
          if (tabs[0]) {
            setTitle(tabs[0].title || "");
          }
        });
    })();
  }, []);
  //  this function handles the reset of the page
  const handleResetButton = () => {
    setStatus("");
    setIsLoading(false);
    setError(null);
  };

  // This function is triggered when the user clicks the "Summarize Page" button
  const handleSummarize = async () => {
    setIsLoading(true);
    setError(null);
    setStatus("Summarizing...");

    try {
      //  Find the active tab that the user is currently looking at
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab.id) {
        setError("Could not find any tab to summarize.");
      }

      const url = tab.url;
      if (!url) {
        setError("Could not get the url of the page to be summarized.");
      }

      //  this get the summary from the cache
      const cachedSummary = await getCachedSummary(url);

      if (cachedSummary) {
        setStatus(cachedSummary);
        setIsLoading(false);
        return;
      }

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
          await saveSummaryToCache(url, SummaryResponse.summary);
        } else {
          setError(SummaryResponse?.error);
          setStatus("");
        }
      } else {
        setError("Failed to extract content from the webpage.");
        setStatus("");
      }
    } catch (error) {
      setError((error as Error).message);
      setStatus("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 w-full min-h-[300px] flex flex-col items-center">
      <h1 className="text-2xl font-bold text-blue-800 mb-4 text-center">
        {title}
      </h1>

      {error && (
        <div className="w-full p-3 mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md flex items-start shadow-sm">
          <span className="mr-2 text-red-500 font-bold">Error:</span>
          <p>{error}</p>
        </div>
      )}

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
          <div className="flex items-center justify-end  gap-2">
            {status ? (
              <>
                <Button
                  onclick={handleResetButton}
                  customStyle={"bg-red-500 hover:bg-red-700"}
                  Text="Clear"
                />
                <CopyButton text={status} />
              </>
            ) : (
              <Button
                customStyle={"bg-blue-600 hover:bg-blue-700"}
                onclick={handleSummarize}
                Text={"Summarize Page"}
                disabled={isLoading}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
