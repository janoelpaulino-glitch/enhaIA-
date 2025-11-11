import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
  onRegister: (email: string, password: string) => void;
  onSocialLogin: () => void;
  onGenerateProCode: () => void;
}

const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262">
        <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" />
        <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" />
        <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.8-4.351-25.82 0-9.02.752-17.697 3.2-25.82l-1.73-1.326-40.298-31.187-1.326.638C6.559 93.312 0 110.93 0 130.55s6.559 37.237 16.525 51.085l41.311-31.99-1.555-3.275z" />
        <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.052 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 14.98 69.824l41.311 31.99c10.446-31.477 39.746-51.341 74.26-51.341" />
    </svg>
);

const EyeIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

const EyeSlashIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.243 4.243L6.228 6.228" />
    </svg>
);


const AuthModal: React.FC<{onAllow: () => void; onDeny: () => void}> = ({onAllow, onDeny}) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-sm">
            <div className="flex items-center space-x-3 mb-4">
                 <GoogleIcon className="w-8 h-8"/>
                 <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Autorização</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">enhaIA gostaria de aceder à sua conta Google para uma autenticação segura.</p>
            <p className="text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded-md text-gray-700 dark:text-gray-300 mb-6">user@gmail.com</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-6">Ao permitir, você concorda com os Termos de Serviço da enhaIA. Apenas informações básicas de perfil serão usadas.</p>
            <div className="flex justify-end space-x-3">
                <button onClick={onDeny} className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition">Negar</button>
                <button onClick={onAllow} className="px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 transition">Permitir</button>
            </div>
        </div>
    </div>
);


const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onRegister, onSocialLogin, onGenerateProCode }) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSocialLoginClick = () => {
      setShowModal(true);
  };

  const handleAllow = () => {
      setShowModal(false);
      onSocialLogin();
  };

  const handleDeny = () => {
      setShowModal(false);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginMode) {
        onLogin(email, password);
    } else {
        onRegister(email, password);
    }
  };


  return (
    <>
    {showModal && <AuthModal onAllow={handleAllow} onDeny={handleDeny} />}
    <div className="flex items-center justify-center min-h-screen bg-indigo-50 dark:bg-gray-900 font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-center">
        <div>
            <h1 className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">enhaIA</h1>
            <p className="mt-2 text-indigo-400 dark:text-indigo-300">🌙 Guiando as tuas ideias</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-indigo-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-indigo-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-indigo-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-indigo-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 dark:text-gray-400">
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
            </div>
            <button type="submit" className="w-full py-3 px-4 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-500 transition duration-300">
                {isLoginMode ? 'Iniciar Sessão' : 'Cadastrar'}
            </button>
             <p className="text-sm text-center">
                <button type="button" onClick={() => setIsLoginMode(!isLoginMode)} className="font-medium text-indigo-500 hover:text-indigo-400">
                    {isLoginMode ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Inicie Sessão'}
                </button>
            </p>
        </form>

        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">ou</span>
            </div>
        </div>

        <div>
            <button 
                type="button" 
                onClick={handleSocialLoginClick}
                className="inline-flex items-center justify-center w-full py-3 px-4 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-500 transition duration-300 font-semibold border border-gray-200 dark:border-gray-600"
            >
                <GoogleIcon className="w-6 h-6 mr-3" />
                Entrar com Google
            </button>
        </div>

        <div className="space-y-4">
            <p className="text-xs text-gray-400 dark:text-gray-500">
                Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade.
            </p>
            <button type="button" onClick={onGenerateProCode} className="text-xs text-indigo-500 hover:text-indigo-400">
                Gerar Código Pro (Admin)
            </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default LoginScreen;