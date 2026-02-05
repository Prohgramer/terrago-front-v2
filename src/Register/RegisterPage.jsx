import React, { useState } from 'react';
import useRegister from '../hooks/useRegister';
import { useNavigate } from 'react-router-dom';

export const RegisterPage = () => { 
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'buyer',
    acceptTerms: false,
    acceptMarketing: false
  });
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { 
    errors, 
    register, 
    checkEmailExists, 
    clearErrors,
    setErrors  
  } = useRegister();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    if (errors[name]) {
      clearErrors();
    }
  };

  const validateForm = async () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es requerido';
    if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es requerido';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }else {
        // 3. AWAIT: Espera el resultado de la base de datos
        // Solo verificamos si la sintaxis del email es correcta.
        const emailAlreadyExists = await checkEmailExists(formData.email); 
        
        if (emailAlreadyExists) {
            newErrors.email = 'Este email ya está registrado';
        }
    }

    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
    if (formData.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    if (!formData.acceptTerms) newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    
    if (isSubmitting) return;

    const formErrors = await validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await register(formData);
      
      if (result.success) {
        // setFormData({
        //   firstName: '',
        //   lastName: '',
        //   email: '',
        //   phone: '',
        //   password: '',
        //   confirmPassword: '',
        //   userType: 'buyer',
        //   acceptTerms: false,
        //   acceptMarketing: false
        // });
        null;
      }
      console.log(formData.email);
      navigate('/preVerify-email', { state: { email: formData.email } });
    } catch (error) {
      console.error('Error during registration:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

   const handleEmailBlur = async () => {
       const exists = await checkEmailExists(formData.email);
       if (exists) {
         setErrors(prev => ({
           ...prev,
           email: 'Este email ya está registrado'
         }));
       }
   };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950 px-4">
      <div className="w-full max-w-2xl bg-white dark:bg-neutral-900 shadow-xl rounded-2xl p-8">
        
        <h1 className="text-3xl font-extrabold text-center text-emerald-600">
          TERREGO
        </h1>
        <p className="text-center text-neutral-600 dark:text-neutral-400 mt-2">
          Crea tu cuenta y encontrá tu hogar ideal
        </p>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Nombre *"
                className={`${inputField} h-12 ${errors.firstName ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.firstName}
                </p>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Apellido *"
                className={`${inputField} h-12 ${errors.lastName ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.lastName}
                </p>
              )}
            </div>

            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Correo Electrónico *"
                className={`${inputField} h-12 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Teléfono *"
                className={`${inputField} h-12 ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone}
                </p>
              )}
            </div>
            <div className="relative">
              <input
                type={passwordVisibility.password ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Contraseña *"
                className={`${inputField} h-12 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`} 
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password}
                </p>
              )}
            </div>
            <div className="relative">
              <input
                type={passwordVisibility.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirmar Contraseña *"
                className={`${inputField} h-12 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`} 
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            <div>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  className={`accent-emerald-600 ${errors.acceptTerms ? 'ring-2 ring-red-500' : ''}`}
                />
                Acepto los <a href="#" className="text-emerald-600 hover:underline">términos y condiciones</a>
              </label>
              {errors.acceptTerms && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.acceptTerms}
                </p>
              )}
            </div>

          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl font-semibold text-white 
              ${isSubmitting 
                ? 'bg-emerald-400 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-700'} 
              transition relative`}
          >
            {isSubmitting ? (
              <>
                <span className="opacity-0">Crear Cuenta →</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg 
                    className="animate-spin h-5 w-5 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>
              </>
            ) : (
              'Crear Cuenta →'
            )}
          </button>

          <p className="text-center text-sm text-neutral-600 dark:text-neutral-400 mt-4">
            ¿Ya tienes una cuenta?{" "}
            <a href="/login" className="text-emerald-600 hover:underline">
              Inicia sesión aquí
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

const inputField =
  "w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-600";
