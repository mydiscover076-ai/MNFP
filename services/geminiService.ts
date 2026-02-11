
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getFashionAdvice = async (userPrompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  const model = 'gemini-3-flash-preview';
  const chat = ai.chats.create({
    model,
    config: {
      systemInstruction: "You are the MNFP AI Fashion Expert. You are helpful, trendy, and knowledgeable about modern street style and tech-wear. Respond in a friendly and professional manner.",
    },
  });

  // We manually simulate the history since the simplified SDK wrapper handles it differently
  // For simplicity in this demo, we'll send the latest message with a summary of context if needed
  // or use generateContent for a stateless feel if history is complex.
  
  const response = await ai.models.generateContent({
    model,
    contents: [
      { role: 'user', parts: [{ text: userPrompt }] }
    ],
    config: {
      systemInstruction: "You are the MNFP AI Fashion Expert. You are helpful, trendy, and knowledgeable about modern street style and tech-wear. Keep responses concise.",
    }
  });

  return response.text;
};

export const analyzeBodyScan = async (base64Image: string) => {
  const model = 'gemini-3-flash-preview';
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: "Analyze this person's body shape and provide clothing size recommendations (S, M, L, XL) and style tips for tech-wear. Return the response as JSON with keys 'size', 'shape', and 'tips'." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          size: { type: Type.STRING },
          shape: { type: Type.STRING },
          tips: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["size", "shape", "tips"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};
