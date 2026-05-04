import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey });
export async function generateSummary(text: string): Promise<string> {
  if (!apiKey) {
    throw new Error("API key is missing. Check your .env file.");
  }

  const prompt = `You are a highly skilled reading assistant. 
  Analyze the following webpage text and provide a concise, well-formatted summary. 
  Use bullet points for key takeaways and keep it under 150 words. Ensure it is easy to read and understand and each title of bullet points should be in bold. the summary should have an estimated reading time.
  
  TEXT TO SUMMARIZE:
  ${text}`;

  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  const responseText = result.text;
  return responseText;
}
