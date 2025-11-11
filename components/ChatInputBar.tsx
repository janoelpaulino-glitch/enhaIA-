
import React, { useState, useEffect, useRef } from 'react';
import CameraModal from './CameraModal';

// Add type definitions for the Web Speech API to resolve TypeScript errors.
// This is necessary because the API is experimental and not yet included in standard TypeScript DOM library definitions.
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  lang: string;
  interimResults: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionStatic {
  new (): SpeechRecognition;
}

interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition?: SpeechRecognitionStatic;
  webkitSpeechRecognition?: SpeechRecognitionStatic;
}

interface ChatInputBarProps {
  onSendMessage: (input: string, imageFile: File | null) => void;
  loading: boolean;
}

const SendIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
    </svg>
);

const MicIcon: React.FC<{className?: string; isListening?: boolean}> = ({className, isListening}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`${className} ${isListening ? 'text-red-500 animate-pulse' : ''}`}>
      <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
      <path d="M6 15a1.5 1.5 0 0 0-1.5 1.5v.091C4.5 20.02 7.424 22.5 11.25 22.5s6.75-2.479 6.75-5.909v-.091a1.5 1.5 0 0 0-1.5-1.5H15a1.5 1.5 0 0 0-1.5 1.5v.091a2.25 2.25 0 0 1-4.5 0v-.091A1.5 1.5 0 0 0 9 15H6Z" />
    </svg>
);

const PaperClipIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.122 2.122l7.81-7.81" />
    </svg>
);

const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.776 48.776 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
    </svg>
);


const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
    </svg>
);

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);


const ChatInputBar: React.FC<ChatInputBarProps> = ({ onSendMessage, loading }) => {
  const [input, setInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [isImageGenMode, setIsImageGenMode] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fix: Cast window to our custom interface to access SpeechRecognition properties.
    const SpeechRecognition = (window as WindowWithSpeechRecognition).SpeechRecognition || (window as WindowWithSpeechRecognition).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'pt-BR';
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const messageToSend = isImageGenMode ? `gerar imagem: ${transcript}` : transcript;
        onSendMessage(messageToSend, null); // Automatically send the message, clear image
        setInput('');
        removeImage(); // Clear any attachments
        if (isImageGenMode) setIsImageGenMode(false); // Reset mode
      };
      recognitionRef.current = recognition;
    }

    return () => {
      recognitionRef.current?.stop();
    };
  }, [onSendMessage, isImageGenMode]);
  
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleVoiceInput = () => {
    if (!isSpeechSupported || !recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      // Can't use voice while attaching an image, so clear it.
      if (imageFile) removeImage();
      recognitionRef.current.start();
    }
  };

  const handleImageGenToggle = () => {
      const newMode = !isImageGenMode;
      // When entering image gen mode, remove any attached image.
      if (newMode && imageFile) {
          removeImage();
      }
      setIsImageGenMode(newMode);
  };

  const handlePhotoTaken = (file: File) => {
    if (file) {
      setIsImageGenMode(false); // Turn off image gen mode
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    setShowCamera(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsImageGenMode(false); // Turn off image gen mode
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const canSendMessage = (isImageGenMode && input.trim()) || (!isImageGenMode && (input.trim() || imageFile));
    if (canSendMessage) {
      const messageToSend = isImageGenMode ? `gerar imagem: ${input}` : input;
      onSendMessage(messageToSend, imageFile);
      setInput('');
      removeImage();
      setIsImageGenMode(false); // Reset mode after sending
    }
  };

  const isSubmitDisabled = loading || !((isImageGenMode && input.trim()) || (!isImageGenMode && (input.trim() || imageFile)));

  return (
    <>
      {showCamera && <CameraModal onPhotoTaken={handlePhotoTaken} onClose={() => setShowCamera(false)} />}
      <div>
          {imagePreview && (
              <div className="relative inline-block mb-2">
                  <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-md" />
                  <button 
                      onClick={removeImage} 
                      className="absolute top-0 right-0 -mt-2 -mr-2 bg-gray-700 text-white rounded-full p-0.5"
                      aria-label="Remove image"
                  >
                      <XCircleIcon className="w-5 h-5" />
                  </button>
              </div>
          )}
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                title="Anexar imagem"
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-700 text-white rounded-full disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-colors"
            >
                <PaperClipIcon className="w-5 h-5" />
            </button>
            <button
                type="button"
                onClick={() => setShowCamera(true)}
                disabled={loading}
                title="Tirar foto"
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-700 text-white rounded-full disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-colors"
            >
                <CameraIcon className="w-5 h-5" />
            </button>
            <button
                type="button"
                onClick={handleImageGenToggle}
                disabled={loading}
                title="Gerar Imagem Realista"
                className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-colors ${
                    isImageGenMode
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
            >
                <SparklesIcon className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                  isImageGenMode 
                  ? "Descreva a imagem realista que quer criar..."
                  : imageFile 
                  ? "Descreva a imagem..." 
                  : "Escreve algo ou usa o microfone..."
              }
              className="flex-1 w-full p-3 bg-gray-900 text-gray-200 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-indigo-600 text-white rounded-full disabled:bg-indigo-400 disabled:cursor-not-allowed hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <SendIcon className="w-6 h-6"/>
              )}
            </button>
            <button
              type="button"
              onClick={handleVoiceInput}
              disabled={loading || !isSpeechSupported}
              title={!isSpeechSupported ? "O reconhecimento de voz não é suportado neste navegador." : "Usar microfone"}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-700 text-white rounded-full disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-colors"
            >
              <MicIcon className="w-6 h-6" isListening={isListening}/>
            </button>
          </form>
      </div>
    </>
  );
};

export default ChatInputBar;
