import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const analyzeSketch = async (base64Image) => {
  try {
    // FIX: Using the correct model name for the v1beta endpoint
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const prompt = "Analyze this whiteboard sketch. Return ONLY a JSON object with these keys: 1. detected_intent: what this diagram represents, 2. suggestions: array of 3 improvement suggestions, 3. missing_elements: what should be added, 4. diagram_type: flowchart/mindmap/wireframe/freeform. Do not include markdown formatting in your response.";

    // Remove data:image/png;base64, prefix if present
    const base64Data = base64Image.split(',')[1] || base64Image;

    const result = await model.generateContent([
      {
        text: prompt
      },
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/png"
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Clean JSON if the model returns markdown blocks
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw error;
  }
};
