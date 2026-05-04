/**
 * Checks Chrome local storage for an existing summary for a given URL.
 * Returns the summary string if found, or null if it doesn't exist.
 */
export async function getCachedSummary(url: string): Promise<string | null> {
  try {
    const result = await chrome.storage.local.get([url]);
    return (result[url] as string) || null;
  } catch (error) {
    console.log("Failed to read from storage:", error);
    return null;
  }
}

/**
 * Saves a generated summary to Chrome local storage, linked to the URL.
 */
export async function saveSummaryToCache(
  url: string,
  summary: string,
): Promise<void> {
  try {
    await chrome.storage.local.set({ [url]: summary });
  } catch (error) {
    console.error("Failed to save to storage:", error);
  }
}
