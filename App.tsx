import React, { useState, useEffect, useCallback } from 'react';
import ChatScreen from './components/ChatScreen';
import ChatHistorySidebar from './components/ChatHistorySidebar';
import { Message, MessageRole, Chat } from './types';
import { getEnhaReply, generateEnhaVideo, generateSpeech, generateRealisticImage, generateChatTitle } from './services/geminiService';

const FC_ARABIA_LOGO_BASE64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIbGNtcwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABzYXdzY3RybAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWhhbmQAAAAAAAAAAAAAAAACAEgAAAAAbW50clJHQiBYWVogB9gADAAXABUAFAAgYWNzcEFQUEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPbWAAEAAAAA0y1zZjMyAAAAAAABDEIAAAXe///zJgAAB5IAAP2R///7ov///aMAAAPcAADAbv/bAEMABAMDBAMDBAQDBAUEBAUGCgcGBgYGDQkKCAoPDRAQDw0MDhUXFRgYGh4eGhYgICAbHh4elhcpLDgsKSUoJWOFhZv/bAEMBAQEBBAcGBw4JCw4RDgsOERcZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRlv/CABEIAlgCWAMBIgACEQEDEQH/xAAbAAADAQEBAQAAAAAAAAAAAAAAAQIDBAUG/8QAGgABAQEBAQEBAAAAAAAAAAAAAAECAwUEBv/aAAwDAQACEAMQAAAB+aAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA-';

const simpleUuid = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error('Failed to convert file to base64 string.'));
      }
    };
    reader.onerror = error => reject(error);
  });
};

const initialMessage: Message = {
    id: 1,
    role: MessageRole.ASSISTANT,
    content: 'Olá! Eu sou a enhaIA 🌙. Como posso iluminar as suas ideias hoje? Pode pedir-me para criar imagens, vídeos e áudios! Basta usar o prefixo "gerar imagem:", "gerar vídeo:" ou "gerar áudio:"',
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [apiKeySelected, setApiKeySelected] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const handleNewChat = useCallback(() => {
    const newChat: Chat = {
        id: simpleUuid(),
        title: "Nova Conversa",
        messages: [initialMessage],
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setIsSidebarOpen(false);
  }, []);

  useEffect(() => {
    try {
        const savedChats = localStorage.getItem('enhaia-chats');
        const savedActiveId = localStorage.getItem('enhaia-active-chat-id');
        if (savedChats) {
            const parsedChats = JSON.parse(savedChats);
            if (Array.isArray(parsedChats) && parsedChats.length > 0) {
                setChats(parsedChats);
                const activeId = savedActiveId ? JSON.parse(savedActiveId) : parsedChats[0].id;
                if (parsedChats.some(c => c.id === activeId)) {
                    setActiveChatId(activeId);
                } else {
                    setActiveChatId(parsedChats[0].id);
                }
                return;
            }
        }
    } catch (error) {
        console.error("Failed to load chats from localStorage", error);
    }
    handleNewChat();
  }, [handleNewChat]);

  useEffect(() => {
    if (chats.length > 0) {
        localStorage.setItem('enhaia-chats', JSON.stringify(chats));
    }
    if (activeChatId) {
        localStorage.setItem('enhaia-active-chat-id', JSON.stringify(activeChatId));
    }
  }, [chats, activeChatId]);

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setApiKeySelected(hasKey);
      }
    };
    checkApiKey();
  }, []);

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setIsSidebarOpen(false);
  };

  const handleDeleteChat = (id: string) => {
    const updatedChats = chats.filter(chat => chat.id !== id);
    setChats(updatedChats);

    if (activeChatId === id) {
        if (updatedChats.length > 0) {
            setActiveChatId(updatedChats[0].id);
        } else {
            handleNewChat();
        }
    }
  };
  
  const handleRenameChat = (id: string, newTitle: string) => {
    setChats(prev => prev.map(chat => chat.id === id ? { ...chat, title: newTitle.trim() || 'Conversa' } : chat));
  };
  
  const handleSendMessage = useCallback(async (input: string, imageFile: File | null) => {
    const activeChat = chats.find(c => c.id === activeChatId);
    if (!activeChat || (!input.trim() && !imageFile)) {
        return;
    }

    setLoading(true);
    
    const userMessage: Message = {
        id: Date.now(),
        role: MessageRole.USER,
        content: input,
        userImageUrl: imageFile ? URL.createObjectURL(imageFile) : undefined,
    };
    
    const loadingMessageId = Date.now() + 1;
    const loadingMessage: Message = {
        id: loadingMessageId,
        role: MessageRole.ASSISTANT,
        content: 'Pensando... 🌙',
        isLoading: true,
    };

    const isFirstUserMessage = activeChat.messages.filter(m => m.role === MessageRole.USER).length === 0;

    setChats(prev => prev.map(c => 
        c.id === activeChatId ? { ...c, messages: [...c.messages, userMessage, loadingMessage] } : c
    ));

    try {
        const lowerCaseInput = input.toLowerCase();
        let responseContent: Partial<Message> = {};
        let textForSpeech: string | null = null;
        
        const updateLoadingMessage = (newContent: string) => {
             setChats(prev => prev.map(c => 
                c.id === activeChatId 
                ? { ...c, messages: c.messages.map(m => m.id === loadingMessageId ? {...m, content: newContent} : m) } 
                : c
            ));
        };

        if (lowerCaseInput.includes("f.c. arábia") || lowerCaseInput.includes("fc arábiao") || lowerCaseInput.includes("bloco a")) {
            if (lowerCaseInput.includes("logo") || lowerCaseInput.includes("símbolo") || lowerCaseInput.includes("emblema")) {
                 responseContent = { imageUrl: FC_ARABIA_LOGO_BASE64, content: 'Aqui está o emblema oficial do F.C. Arábia, Bloco A!' };
                 textForSpeech = responseContent.content;
            }
        }
        
        if (Object.keys(responseContent).length === 0) {
            if (lowerCaseInput.startsWith('gerar vídeo:')) {
                 if (!apiKeySelected) {
                    if (window.aistudio) { await window.aistudio.openSelectKey(); setApiKeySelected(true); } 
                    else { throw new Error("AI Studio SDK not found."); }
                 }
                const prompt = input.substring('gerar vídeo:'.length).trim();
                updateLoadingMessage('A criar o seu vídeo de alta qualidade... isto pode demorar alguns minutos! ✨');
                const videoUrl = await generateEnhaVideo(prompt);
                responseContent = { videoUrl, content: "O seu vídeo está pronto!" };
                textForSpeech = responseContent.content;

            } else if (lowerCaseInput.startsWith('gerar imagem:')) {
                const prompt = input.substring('gerar imagem:'.length).trim();
                updateLoadingMessage('A criar a sua imagem realista... isto pode demorar um pouco! 🖼️');
                const imageUrl = await generateRealisticImage(prompt);
                responseContent = { imageUrl, content: "Aqui está a sua imagem realista!" };
                textForSpeech = responseContent.content;

            } else if (input.toLowerCase().startsWith('gerar áudio:')) {
                const prompt = input.substring('gerar áudio:'.length).trim();
                updateLoadingMessage('A gerar o seu áudio... 🎙️');
                const audioBase64 = await generateSpeech(prompt);
                responseContent = { audioUrl: `data:audio/mpeg;base64,${audioBase64}` };
            } else {
                let imagePayload;
                if (imageFile) {
                    const base64Data = await fileToBase64(imageFile);
                    imagePayload = { mimeType: imageFile.type, data: base64Data };
                }
                const reply = await getEnhaReply(activeChat.messages, input, imagePayload);
                responseContent = { content: reply };
                textForSpeech = reply;
            }
        }
        
        setChats(prev => prev.map(c => 
            c.id === activeChatId 
            ? { ...c, messages: c.messages.map(m => m.id === loadingMessageId ? { ...m, ...responseContent, isLoading: false } : m) } 
            : c
        ));

        if (isFirstUserMessage && input.trim() && activeChatId) {
            generateChatTitle(input).then(title => {
                if (activeChatId) handleRenameChat(activeChatId, title);
            });
        }

        if (textForSpeech) {
            try {
                const audioBase64 = await generateSpeech(textForSpeech);
                const audioUrl = `data:audio/mpeg;base64,${audioBase64}`;
                setChats(prev => prev.map(c => 
                    c.id === activeChatId 
                    ? { ...c, messages: c.messages.map(m => m.id === loadingMessageId ? { ...m, audioUrl } : m) } 
                    : c
                ));
            } catch (speechError) {
                console.error("Speech generation failed, continuing without audio.", speechError);
            }
        }

    } catch (error) {
       console.error("Error sending message:", error);
       let errorMessage = "Oops, algo correu mal. Tente novamente.";
       if (error instanceof Error) {
           if (error.message === "API_KEY_NOT_FOUND") {
               errorMessage = "Chave de API não encontrada. Por favor, selecione uma chave de API para gerar vídeos.";
               setApiKeySelected(false);
           } else {
               errorMessage = error.message;
           }
       }
       setChats(prev => prev.map(c => 
           c.id === activeChatId 
           ? { ...c, messages: c.messages.map(m => m.id === loadingMessageId ? { ...m, content: errorMessage, isLoading: false } : m) } 
           : c
       ));
    } finally {
      setLoading(false);
    }
  }, [chats, activeChatId, apiKeySelected]);

  const activeChat = chats.find(c => c.id === activeChatId);

  return (
    <div className="flex h-screen font-sans bg-indigo-50 dark:bg-gray-900">
        <ChatHistorySidebar
            chats={chats}
            activeChatId={activeChatId}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
            onDeleteChat={handleDeleteChat}
            onRenameChat={handleRenameChat}
        />
        <main className="flex-1 transition-transform duration-300 ease-in-out">
             {activeChat ? (
                <ChatScreen 
                    key={activeChat.id}
                    chatTitle={activeChat.title}
                    messages={activeChat.messages} 
                    loading={loading} 
                    onSendMessage={handleSendMessage}
                    onToggleSidebar={() => setIsSidebarOpen(true)}
                />
            ) : (
                <div className="flex items-center justify-center h-full text-center p-4">
                  <div className="text-gray-500 dark:text-gray-400">
                    <h2 className="text-xl font-semibold">Bem-vindo à enhaIA</h2>
                    <p>Selecione uma conversa ou crie uma nova para começar.</p>
                  </div>
                </div>
            )}
        </main>
    </div>
  );
};

export default App;
