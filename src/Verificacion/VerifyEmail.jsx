import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader, Mail } from 'lucide-react';

export default function VerifyEmail() {
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState(null);
  const [errorCode, setErrorCode] = useState('');

  useEffect(() => {
    verifyEmail();
  }, []);

  const verifyEmail = async () => {
    try {
      // Obtener el token de la URL
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('No se encontró el token de verificación en la URL');
        setErrorCode('TOKEN_MISSING');
        return;
      }

      // Llamar al endpoint de verificación
      const response = await fetch('http://localhost:5000/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || '¡Email verificado exitosamente!');
        setUserData(data.user);
        
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Error al verificar el email');
        setErrorCode(data.code);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Error de conexión con el servidor');
      setErrorCode('CONNECTION_ERROR');
      console.error('Error:', error);
    }
  };

  const getErrorMessage = () => {
    const errorMessages = {
      'TOKEN_REQUIRED': 'El token de verificación es requerido',
      'INVALID_TOKEN': 'El token de verificación es inválido o ha expirado',
      'USER_NOT_FOUND': 'No se encontró el usuario asociado a este token',
      'ALREADY_VERIFIED': 'Este email ya ha sido verificado anteriormente',
      'INTERNAL_ERROR': 'Error interno del servidor. Intenta nuevamente más tarde',
      'TOKEN_MISSING': 'No se proporcionó un token de verificación',
      'CONNECTION_ERROR': 'No se pudo conectar con el servidor'
    };

    return errorMessages[errorCode] || message;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Loading State */}
        {status === 'loading' && (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Loader className="w-16 h-16 text-blue-500 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Verificando tu email...
            </h2>
            <p className="text-gray-600">
              Por favor espera mientras procesamos tu solicitud
            </p>
          </div>
        )}

        {/* Success State */}
        {status === 'success' && (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              ¡Email Verificado!
            </h2>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            
            {userData && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">Bienvenido/a</p>
                <p className="text-lg font-semibold text-gray-800">
                  {userData.name}
                </p>
                <p className="text-sm text-gray-600 flex items-center justify-center gap-2 mt-2">
                  <Mail className="w-4 h-4" />
                  {userData.email}
                </p>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Loader className="w-4 h-4 animate-spin" />
              <span>Redirigiendo al login en 3 segundos...</span>
            </div>

            <button
              onClick={() => window.location.href = '/login'}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              Ir al Login Ahora
            </button>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 rounded-full p-4">
                <XCircle className="w-16 h-16 text-red-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Error en la Verificación
            </h2>
            <p className="text-gray-600 mb-6">
              {getErrorMessage()}
            </p>

            <div className="space-y-3">
              <button
                onClick={verifyEmail}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                Reintentar Verificación
              </button>

              {errorCode === 'ALREADY_VERIFIED' && (
                <button
                  onClick={() => window.location.href = '/login'} 
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-200"
                >
                  Ir al Login
                </button>
              )}

              {(errorCode === 'INVALID_TOKEN' || errorCode === 'TOKEN_REQUIRED') && (
                <button
                  onClick={() => window.location.href = '/resend-verification'}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-200"
                >
                  Solicitar Nuevo Email
                </button>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}