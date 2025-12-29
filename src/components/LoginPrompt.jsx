import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

export const LoginPrompt = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-4"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
        >
          <X size={16} />
        </button>
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
            <span role="img" aria-label="house" className="text-lg">🏠</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Encuentra tu terreno ideal</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
              Accede a funciones exclusivas como guardar favoritos y recibir recomendaciones personalizadas
            </p>
            <Link 
              to="/register" 
              className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2 text-sm font-medium"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};