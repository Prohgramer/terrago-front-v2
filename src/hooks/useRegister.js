import { useState, useCallback } from 'react';

const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Configuración de la API
  const API_BASE_URL =  'http://localhost:5000'  // process.env.REACT_APP_API_URL ||;

  // Función para limpiar errores
  const clearErrors = useCallback(() => {
    setErrors({});
    setSuccessMessage('');
  }, []);

  // Validación de email en tiempo real
  const checkEmailExists = useCallback(async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/check-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error('Error al verificar email:', error);
      return false;
    }
  }, [API_BASE_URL]);

  // Función principal de registro
  const register = useCallback(async (formData) => {
    setLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      // Preparar datos para la API
      const userData = {
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim(),
        userType: formData.userType,
        acceptMarketing: formData.acceptMarketing
      };

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        // Manejar diferentes tipos de errores del servidor
        if (response.status === 409) {
          setErrors({ email: 'Este email ya está registrado' });
        } else if (response.status === 400) {
          // Puede ser un error de validación específico
          const errorMessage = data.error || 'Datos inválidos';
          if (errorMessage.includes('email')) {
            setErrors({ email: errorMessage });
          } else if (errorMessage.includes('contraseña')) {
            setErrors({ password: errorMessage });
          } else {
            setErrors({ general: errorMessage });
          }
        } else {
          setErrors({ general: data.error || 'Error en el servidor' });
        }
        return { success: false, errors };
      }

      // Registro exitoso
      setSuccessMessage('¡Registro exitoso! Bienvenido a TERREGO');
      
      return { 
        success: true, 
        user: data.user, 
        message: data.message 
      };

    } catch (error) {
      console.error('Error de conexión:', error);
      const connectionError = 'Error de conexión. Verifica tu internet e intenta nuevamente.';
      setErrors({ general: connectionError });
      return { success: false, error: connectionError };
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  // Función para limpiar el estado
  const reset = useCallback(() => {
    setLoading(false);
    setErrors({});
    setSuccessMessage('');
  }, []);

  return {
    loading,
    errors,
    successMessage,
    register,
    checkEmailExists,
    clearErrors,
    reset,
    setErrors
  };
};

export default useRegister;