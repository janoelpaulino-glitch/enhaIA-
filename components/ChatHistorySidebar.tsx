import React, { useState, useRef, useEffect } from 'react';
import { Chat } from '../types';

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

const PencilIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);

const XMarkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);


interface ChatItemProps {
    chat: Chat;
    isActive: boolean;
    renamingId: string | null;
    onSelect: () => void;
    onDelete: () => void;
    onRenameStart: (chat: Chat) => void;
    onRenameConfirm: () => void;
    onRenameCancel: () => void;
    renameValue: string;
    setRenameValue: (value: string) => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, isActive, renamingId, onSelect, onDelete, onRenameStart, onRenameConfirm, onRenameCancel, renameValue, setRenameValue }) => {
    const isRenaming = renamingId === chat.id;
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isRenaming) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isRenaming]);
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onRenameConfirm();
        } else if (e.key === 'Escape') {
            onRenameCancel();
        }
    };

    return (
        <div
            onClick={!isRenaming ? onSelect : undefined}
            className={`group flex items-center justify-between p-3 mx-2 my-1 rounded-lg cursor-pointer transition-colors ${
                isActive ? 'bg-indigo-200 dark:bg-indigo-800' : 'hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
        >
            {isRenaming ? (
                <input
                    ref={inputRef}
                    type="text"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={onRenameConfirm}
                    onKeyDown={handleKeyDown}
                    className="flex-1 w-0 bg-transparent text-sm font-semibold text-gray-800 dark:text-gray-200 focus:outline-none"
                />
            ) : (
                <p className="flex-1 truncate text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {chat.title}
                </p>
            )}
            <div className={`flex items-center transition-opacity ${isRenaming ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                {isRenaming ? (
                    <>
                        <button onClick={onRenameConfirm} className="p-1 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"><CheckIcon className="w-4 h-4" /></button>
                        <button onClick={onRenameCancel} className="p-1 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"><XMarkIcon className="w-4 h-4" /></button>
                    </>
                ) : (
                    <>
                        <button onClick={(e) => { e.stopPropagation(); onRenameStart(chat); }} className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"><PencilIcon className="w-4 h-4" /></button>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"><TrashIcon className="w-4 h-4" /></button>
                    </>
                )}
            </div>
        </div>
    );
};


interface ChatHistorySidebarProps {
    chats: Chat[];
    activeChatId: string | null;
    isOpen: boolean;
    onClose: () => void;
    onNewChat: () => void;
    onSelectChat: (id: string) => void;
    onDeleteChat: (id: string) => void;
    onRenameChat: (id: string, newTitle: string) => void;
}

const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({ chats, activeChatId, isOpen, onClose, onNewChat, onSelectChat, onDeleteChat, onRenameChat }) => {
    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState('');
    
    const handleRenameStart = (chat: Chat) => {
        setRenamingId(chat.id);
        setRenameValue(chat.title);
    };

    const handleRenameConfirm = () => {
        if (renamingId && renameValue.trim()) {
            onRenameChat(renamingId, renameValue.trim());
        }
        setRenamingId(null);
    };

    const handleRenameCancel = () => {
        setRenamingId(null);
    };
    
    return (
        <>
            <aside className={`fixed md:relative z-30 flex flex-col w-72 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Conversas</h2>
                    <button 
                        onClick={onNewChat}
                        className="p-2 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors"
                        title="Nova Conversa"
                    >
                        <PlusIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto pt-2">
                    {chats.map(chat => (
                        <ChatItem 
                            key={chat.id}
                            chat={chat}
                            isActive={chat.id === activeChatId}
                            renamingId={renamingId}
                            onSelect={() => onSelectChat(chat.id)}
                            onDelete={() => onDeleteChat(chat.id)}
                            onRenameStart={handleRenameStart}
                            onRenameConfirm={handleRenameConfirm}
                            onRenameCancel={handleRenameCancel}
                            renameValue={renameValue}
                            setRenameValue={setRenameValue}
                        />
                    ))}
                </div>
            </aside>
            {isOpen && <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"></div>}
        </>
    );
};

export default ChatHistorySidebar;
