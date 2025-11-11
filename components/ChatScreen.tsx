import React, { useRef, useEffect, useState } from 'react';
import { Message } from '../types';
import MessageBubble from './MessageBubble';
import ChatInputBar from './ChatInputBar';
import EnhaAnimation from './LumiAnimation';
import InstallPWAButton from './InstallPWAButton';

interface ChatScreenProps {
  chatTitle: string;
  messages: Message[];
  loading: boolean;
  onSendMessage: (input: string, imageFile?: File | null) => void;
  onToggleSidebar: () => void;
}

const MenuIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const SearchIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);

const XIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

const ChatScreen: React.FC<ChatScreenProps> = ({ chatTitle, messages, loading, onSendMessage, onToggleSidebar }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, searchQuery]);

  useEffect(() => {
    if (isSearching) {
      searchInputRef.current?.focus();
    }
  }, [isSearching]);

  const isChatEmpty = messages.length <= 1 && !searchQuery;

  const filteredMessages = searchQuery
    ? messages.filter(msg => msg.content?.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  return (
    <div className="relative flex flex-col h-screen max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-2xl rounded-lg overflow-hidden">
      <header className="flex items-center justify-between p-4 bg-indigo-600 text-white shadow-md z-10">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
             <button 
                onClick={onToggleSidebar}
                className="p-2 -ml-2 rounded-full hover:bg-indigo-700 transition md:hidden" 
                aria-label="Abrir histórico de conversas"
            >
                <MenuIcon className="w-6 h-6"/>
            </button>
            {isSearching ? (
               <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar mensagens..."
                className="w-full bg-indigo-700 text-white placeholder-indigo-300 rounded-md py-1 px-3 focus:outline-none transition-all duration-300"
              />
            ) : (
              <h1 className="text-xl font-bold truncate pr-2" title={chatTitle}>{chatTitle}</h1>
            )}
        </div>
        <div className="flex items-center space-x-2 pl-2">
            <InstallPWAButton />
            <button 
                onClick={() => {
                  setIsSearching(!isSearching);
                  if (isSearching) {
                    setSearchQuery('');
                  }
                }}
                className="p-2 rounded-full hover:bg-indigo-700 transition" 
                aria-label={isSearching ? "Fechar pesquisa" : "Pesquisar"}
            >
                {isSearching ? <XIcon className="w-6 h-6"/> : <SearchIcon className="w-6 h-6"/>}
            </button>
        </div>
      </header>
      <main className="flex-1 p-4 overflow-y-auto bg-indigo-50 dark:bg-gray-900">
        {isChatEmpty ? (
          <EnhaAnimation />
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} searchQuery={searchQuery} />
            ))}
            {searchQuery && filteredMessages.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                    <p>Nenhuma mensagem encontrada para "{searchQuery}".</p>
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>
      <footer className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <ChatInputBar onSendMessage={onSendMessage} loading={loading} />
      </footer>
      <p className="absolute bottom-2 left-4 text-xs text-green-900 opacity-70 dark:text-green-200 dark:opacity-50">(criado por janoel)</p>
    </div>
  );
};

export default ChatScreen;
