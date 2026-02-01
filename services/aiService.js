import { GoogleGenAI } from "@google/genai";

const getClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
        throw new Error("GEMINI_API_KEY not configured. Please set a valid API key in .env.local");
    }
    return new GoogleGenAI({ apiKey });
};

export const generateBlogContent = async (topic, tone) => {
  try {
    const ai = getClient();
    const prompt = `
      Write a blog post about "${topic}".
      Tone: ${tone}.

      Return the response in strictly valid JSON format with the following schema:
      {
        "title": "Catchy Title",
        "excerpt": "A 2-sentence summary.",
        "content": "The full blog post content in Markdown format (no markdown code blocks, just the text)."
      }
    `;

    const response = await ai.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Generation failed:", error);
    // Fallback to mock data if API key not configured
    if (error.message.includes("GEMINI_API_KEY not configured")) {
      return {
        title: `The Future of ${topic}`,
        excerpt: `Exploring the latest trends and innovations in ${topic}. This comprehensive guide covers everything you need to know.`,
        content: `# The Future of ${topic}\n\n${topic} is evolving rapidly. In this ${tone} article, we dive deep into the current state and future possibilities.\n\n## Key Trends\n\n- Innovation in technology\n- Market changes\n- Future predictions\n\n## Conclusion\n\nThe landscape of ${topic} is bright and full of opportunities.`
      };
    }
    throw error;
  }
};

