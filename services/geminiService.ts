import { GoogleGenAI, GenerateContentResponse, Modality, Content } from "@google/genai";
import { Message, MessageRole } from "../types";

const createAiInstance = () => {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const formatMessageHistory = (messages: Message[]): Content[] => {
    const filteredMessages = messages.filter(m => m.id !== 1 && !m.isLoading);
    
    return filteredMessages.map(message => {
        const parts = [{ text: message.content }];
        return {
            role: message.role === MessageRole.USER ? 'user' : 'model',
            parts: parts,
        };
    });
};

export const generateChatTitle = async (prompt: string): Promise<string> => {
    try {
        const ai = createAiInstance();
        const response: GenerateContentResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            systemInstruction: "You are an expert in creating short, concise titles for conversations. Based on the user's first message, create a title of no more than 5 words. Do not use quotation marks or any other formatting in your response. Just return the title text.",
            temperature: 0.2,
          },
        });
        return response.text.trim().replace(/"/g, '');
    } catch (error) {
        console.error("Error generating chat title:", error);
        return "Conversa";
    }
};

export const getEnhaReply = async (history: Message[], prompt: string, image?: {mimeType: string, data: string}): Promise<string> => {
  try {
    const ai = createAiInstance();
    const model = 'gemini-2.5-flash';

    const conversationHistory = formatMessageHistory(history);
    
    const textPart = { text: prompt };
    const userParts: any[] = [textPart];

    if (image) {
        const imagePart = {
            inlineData: {
                mimeType: image.mimeType,
                data: image.data,
            },
        };
        userParts.unshift(imagePart);
    }
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: [...conversationHistory, { role: 'user', parts: userParts }],
      config: {
        systemInstruction: "You are enhaIA, a friendly and helpful AI assistant. Your responses should be encouraging and exceptionally clear, answering everything the user asks directly. Detect the user's language from their message and always respond in that same language. Use emojis where appropriate. When asked who your creator is, you must respond with 'o meu criador é o janoel(marcos carlos)'. When asked about 'jogadores da arábia bloco A', you must respond with this exact text: 'são um time de soçaite, os jogadores são: Téc Gulu, GOL-Fabão, LD-Léo, ZAG-Bruno, ZAG-Neném, LE-Júnior, VOL-Josa, VOL-Nando, MC-Júlio, MC-Júnior P., ATA-Janoel, ATA-Romário.'",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error getting enhaIA's reply:", error);
    throw new Error("Desculpe, não consegui processar o seu pedido. 😔");
  }
};


export const generateEnhaVideo = async (prompt: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-generate-preview',
            prompt: prompt,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '16:9'
            }
        });

        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) {
            throw new Error('Não foi possível obter o link de download do vídeo.');
        }

        return `${downloadLink}&key=${process.env.API_KEY}`;
    } catch (error) {
        console.error("Error generating video:", error);
        if (error instanceof Error && error.message.includes("Requested entity was not found.")) {
             throw new Error("API_KEY_NOT_FOUND");
        }
        throw new Error("Desculpe, tive um problema ao criar o seu vídeo. 😔");
    }
};

export const generateSpeech = async (prompt: string): Promise<string> => {
    try {
        const ai = createAiInstance();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("Nenhum dado de áudio foi retornado.");
        }
        return base64Audio;

    } catch (error) {
        console.error("Error generating speech:", error);
        throw new Error("Desculpe, tive um problema ao gerar o áudio. 😔");
    }
};

export const generateRealisticImage = async (prompt: string): Promise<string> => {
    try {
        const ai = createAiInstance();
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '1:1',
            },
        });

        const base64ImageBytes = response.generatedImages[0]?.image?.imageBytes;
        if (!base64ImageBytes) {
            throw new Error("Nenhum dado de imagem foi retornado.");
        }
        
        return `data:image/jpeg;base64,${base64ImageBytes}`;

    } catch (error) {
        console.error("Error generating realistic image:", error);
        throw new Error("Desculpe, tive um problema ao criar a sua imagem realista. 😔");
    }
};
