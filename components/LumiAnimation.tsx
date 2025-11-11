import React from 'react';

const EnhaAnimation: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
      <div className="animate-pulse">
        <span className="text-8xl" role="img" aria-label="crescent-moon">🌙</span>
      </div>
      <h2 className="mt-6 text-xl font-semibold text-indigo-500 dark:text-indigo-400">Olá! Eu sou a enhaIA.</h2>
      <p className="mt-2 text-gray-500 dark:text-gray-400">Faça sua primeira pergunta e deixe a lua guiar seus pensamentos!</p>
    </div>
  );
};

export default EnhaAnimation;