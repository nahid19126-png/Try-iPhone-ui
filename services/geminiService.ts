import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateGalaxyResponse = async (
  prompt: string, 
  context: string = "general"
): Promise<string> => {
  if (!process.env.API_KEY) {
    // Fallback responses for demo mode without API Key
    if (context === 'audio_eraser') return "Analyzed audio spectrum. Detected 45% wind noise. Removing... 🌊 Audio clarity improved by 85%.";
    if (context === 'wellness') return "Energy Score: 85/100 💓. Tip: You had great sleep consistency! Try a 10-minute walk to maintain momentum. 🎙️ New Podcast: 'Future of AI' is out.";
    if (context === 'photo_edit') return "Generative Edit: Identifying object... Removing and filling background with context-aware pixels. ✨ Done! Object moved naturally.";
    return "Demo Mode: API Key missing. (Simulated AI response)";
  }

  try {
    let systemInstruction = "You are the AI assistant inside a Samsung Galaxy S25 Ultra simulator. Be concise, futuristic, and polished. Use formatting like **bold** and emojis.";
    
    if (context === 'notes') {
      systemInstruction += " You are Note Assist. Summarize, format, or translate text.";
    } else if (context === 'drawing') {
      systemInstruction += " You are Drawing Assist. Describe how you would transform a rough sketch into a masterpiece.";
    } else if (context === 'call') {
      systemInstruction += " You are Live Translate. Translate the conversation.";
    } else if (context === 'audio_eraser') {
      systemInstruction += " You are Audio Eraser. Describe the noise removal process technically but clearly.";
    } else if (context === 'wellness') {
      systemInstruction += " You are the Now Brief Widget. Provide a very short, punchy summary including Weather (Dhaka, 28C), Energy Score (85), a wellness tip, and a fake podcast recommendation.";
    } else if (context === 'photo_edit') {
      systemInstruction += " You are Generative Edit. The user is asking to edit a photo. Describe the action taken (e.g., resizing, removing, moving objects) and the magical result.";
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "AI processing...";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI Connection Offline. Please check internet.";
  }
};

export const getNowBriefData = async (): Promise<string> => {
  return await generateGalaxyResponse("Generate my daily briefing.", 'wellness');
};