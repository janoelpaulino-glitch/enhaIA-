import React, { useState, useRef, useEffect } from 'react';
import { Message, MessageRole } from '../types';

interface MessageBubbleProps {
  message: Message;
  searchQuery?: string;
}

const ArrowDownTrayIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const PlayCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.088a1.125 1.125 0 0 1-1.65-.983V8.898a1.125 1.125 0 0 1 1.65-.983l5.603 3.088Z" clipRule="evenodd" />
    </svg>
);

const PauseCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM9 8.25a.75.75 0 0 0-.75.75v6c0 .414.336.75.75.75h.75a.75.75 0 0 0 .75-.75V9a.75.75 0 0 0-.75-.75H9Zm5.25 0a.75.75 0 0 0-.75.75v6c0 .414.336.75.75.75H15a.75.75 0 0 0 .75-.75V9a.75.75 0 0 0-.75-.75h-.75Z" clipRule="evenodd" />
    </svg>
);


const HighlightedText: React.FC<{ text: string; highlight: string }> = ({ text, highlight }) => {
    if (!highlight.trim() || !text) {
      return <>{text}</>;
    }
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="bg-yellow-300 dark:bg-yellow-500 rounded px-1 text-black">{part}</span>
          ) : (
            part
          )
        )}
      </>
    );
};


const MessageBubble: React.FC<MessageBubbleProps> = ({ message, searchQuery }) => {
  const isUser = message.role === MessageRole.USER;
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const bubbleClasses = isUser
    ? 'bg-indigo-500 text-white self-end'
    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 self-start';

  const containerClasses = isUser ? 'flex justify-end' : 'flex justify-start';
  
  const handlePlayPause = () => {
    if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onEnded = () => setIsPlaying(false);

        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);
        audio.addEventListener('ended', onEnded);
        return () => {
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
            audio.removeEventListener('ended', onEnded);
        };
    }
  }, []);

  return (
    <div className={containerClasses}>
      <div className={`group relative max-w-md md:max-w-lg p-3 rounded-2xl shadow ${bubbleClasses}`}>
        {message.userImageUrl && (
            <img 
                src={message.userImageUrl} 
                alt="Imagem enviada pelo usuário" 
                className="rounded-lg mb-2 max-w-xs h-auto"
            />
        )}
        {message.imageUrl && (
            <div className="relative">
                <img 
                    src={message.imageUrl} 
                    alt="Imagem gerada pela enhaIA" 
                    className="rounded-lg mb-2 max-w-full h-auto"
                />
                {!isUser && (
                     <a
                        href={message.imageUrl}
                        download={`enhaIA-image-${Date.now()}.png`}
                        className="absolute bottom-2 right-2 p-2 bg-black bg-opacity-50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        aria-label="Baixar Imagem"
                        title="Baixar Imagem"
                    >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                    </a>
                )}
            </div>
        )}
        {message.videoUrl && (
             <div className="relative">
                <video 
                    src={message.videoUrl}
                    controls
                    className="rounded-lg mb-2 max-w-full h-auto"
                >
                    O seu navegador não suporta a tag de vídeo.
                </video>
                 {!isUser && (
                    <a
                        href={message.videoUrl}
                        download={`enhaIA-video-${Date.now()}.mp4`}
                        className="absolute bottom-10 right-2 p-2 bg-black bg-opacity-50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        aria-label="Baixar Vídeo"
                        title="Baixar Vídeo"
                    >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                    </a>
                )}
            </div>
        )}
        {message.audioUrl && !message.content && (
            <audio
                src={message.audioUrl}
                controls
                className="w-full mt-2"
            >
                O seu navegador não suporta o elemento de áudio.
            </audio>
        )}
        {message.content && (
            <div className="flex items-center space-x-2">
                <p className="text-sm whitespace-pre-wrap flex-1">
                    <HighlightedText text={message.content} highlight={searchQuery || ''} />
                </p>
                {message.audioUrl && !isUser && (
                    <>
                        <audio ref={audioRef} src={message.audioUrl} className="hidden" preload="auto" />
                        <button 
                            onClick={handlePlayPause}
                            className="flex-shrink-0 self-end mb-1 text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                            aria-label={isPlaying ? 'Pausar áudio' : 'Reproduzir áudio'}
                        >
                            {isPlaying ? <PauseCircleIcon className="w-6 h-6" /> : <PlayCircleIcon className="w-6 h-6" />}
                        </button>
                    </>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;