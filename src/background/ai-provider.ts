import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey });
export async function generateSummary(text: string): Promise<string> {
  if (!apiKey) {
    throw new Error("API key is missing. Check your .env file.");
  }

  const prompt = `You are a highly skilled reading assistant. 
  Analyze the following webpage text and provide a concise, well-formatted summary. 
  Use bullet points for key takeaways. Ensure it is easy to read and understand and each title of bullet points should be in bold. the summary should have an estimated reading time.Also include a section for key insight. Also highlight important section the page
  
  TEXT TO SUMMARIZE:
  ${text}`;
  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const responseText = result.text;

    if (responseText.length > 0) {
      return responseText;
    } else {
      throw new Error("Failed to generate summary");
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("Failed to fetch")) {
      throw new Error("Network error: Please check your internet connection.", {
        cause: error,
      });
    }

    const match = error.message?.match(/"message":\s*"([^"]+)"/);
    const cleanMessage = match ? match[1] : "An unexpected API error occurred.";

    throw new Error(`API Error: ${cleanMessage},`, { cause: error });
  }
}
