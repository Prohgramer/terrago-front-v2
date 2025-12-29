import React, { useState } from "react";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useLocation } from 'react-router-dom';

export default function VerifyEmailPage() {
  const location = useLocation();
  const email = location.state?.email;
  const [resent, setResent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      setResent(true);
      setTimeout(() => setResent(false), 3000);
    } catch (error) {
      console.error("Error al reenviar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob top-0 -left-4"></div>
        <div className="absolute w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 top-0 right-4"></div>
        <div className="absolute w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 bottom-8 left-20"></div>
      </div>

      {/* Card principal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 sm:p-12 transform transition-all duration-500 hover:scale-[1.02]">
        {/* Icono principal */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <Mail className="w-10 h-10 text-white" />
            </div>
            {/* Ring pulsante */}
            <div className="absolute inset-0 w-20 h-20 bg-purple-400 rounded-full animate-ping opacity-20"></div>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-3">
          ¡Confirmá tu correo!
        </h1>

        {/* Descripción */}
        <p className="text-gray-600 text-center mb-2 leading-relaxed">
          Te enviamos un enlace de verificación a
        </p>
        <p className="text-purple-600 font-semibold text-center mb-6 break-all">
          {email}
        </p>

        {/* Mensaje de éxito/info */}
        {resent && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800 text-sm font-medium">
              ¡Correo reenviado exitosamente! Revisá tu bandeja de entrada.
            </p>
          </div>
        )}

        {/* Botón principal */}
        <button
          onClick={handleResend}
          disabled={isLoading || resent}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3.5 px-6 rounded-xl hover:from-purple-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Enviando...</span>
            </>
          ) : resent ? (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Correo enviado</span>
            </>
          ) : (
            <span>Reenviar correo</span>
          )}
        </button>

        {/* Link secundario */}
        <a
          href="/login"
          className="flex items-center justify-center gap-2 text-purple-600 hover:text-purple-700 font-medium mt-6 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Volver al inicio de sesión</span>
        </a>

        {/* Divider */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

        {/* Caja de información */}
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-purple-900 font-semibold text-sm mb-1">
              💡 Consejo útil
            </p>
            <p className="text-purple-700 text-sm leading-relaxed">
              Si no recibís el correo en unos minutos, verificá tu carpeta de spam o correo no deseado.
            </p>
          </div>
        </div>
      </div>

      {/* Estilos para animaciones personalizadas */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-in-from-top-2 {
          from {
            transform: translateY(-0.5rem);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-in {
          animation: fade-in 0.3s ease-out, slide-in-from-top-2 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}