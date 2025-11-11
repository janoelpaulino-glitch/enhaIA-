import React, { useRef, useEffect, useState } from 'react';

interface CameraModalProps {
  onPhotoTaken: (file: File) => void;
  onClose: () => void;
}

const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.776 48.776 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
    </svg>
);


const CameraModal: React.FC<CameraModalProps> = ({ onPhotoTaken, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } else {
            setError('A câmara não é suportada neste navegador.');
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        let errorMessage = 'Não foi possível aceder à câmara. Verifique as suas permissões.';
        if (err instanceof DOMException && (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")) {
            errorMessage = "Permissão da câmara negada. Para usar esta funcionalidade, por favor, permita o acesso à câmara nas configurações do seu navegador e atualize a página.";
        }
        setError(errorMessage);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        const video = videoRef.current;
        canvasRef.current.width = video.videoWidth;
        canvasRef.current.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
            onPhotoTaken(file);
          }
        }, 'image/jpeg');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-4 rounded-lg shadow-xl relative max-w-3xl w-full">
        <h3 className="text-white text-lg mb-2 text-center">Tirar Foto</h3>
        {error ? (
            <div className="text-red-400 bg-red-900 p-4 rounded-md text-center">
                <p>{error}</p>
            </div>
        ) : (
             <video ref={videoRef} autoPlay playsInline className="w-full rounded-md" />
        )}
        <canvas ref={canvasRef} className="hidden" />
        <div className="mt-4 flex justify-center items-center space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-full text-white bg-gray-600 hover:bg-gray-500 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleCapture}
            disabled={!!error}
            className="p-4 rounded-full text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition ring-4 ring-white ring-opacity-50"
            aria-label="Take Photo"
          >
            <CameraIcon className="w-8 h-8"/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraModal;