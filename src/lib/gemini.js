import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const analyzeSketch = async (base64Image) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = "Analyze this whiteboard sketch. Return ONLY a JSON object with these keys: 1. detected_intent: what this diagram represents, 2. suggestions: array of 3 improvement suggestions, 3. missing_elements: what should be added, 4. diagram_type: flowchart/mindmap/wireframe/freeform. Do not include markdown formatting in your response.";

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image.split(',')[1],
          mimeType: "image/png"
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Clean JSON if needed
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw error;
  }
};
