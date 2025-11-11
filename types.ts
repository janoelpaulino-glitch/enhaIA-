export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export interface Message {
  id: number;
  role: MessageRole;
  content: string;
  imageUrl?: string;
  userImageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  isLoading?: boolean;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  
  interface Window {
    aistudio?: AIStudio;
  }
}
