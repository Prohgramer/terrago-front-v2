import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCompare } from '@/context/CompareContext';

export const CompareBar = () => {
  const { compareList, clearCompareList, showCompareBar } = useCompare();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {showCompareBar && compareList.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border-t border-neutral-200 dark:border-neutral-800 shadow-lg z-50"
        >
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium dark:text-neutral-300">
                  {compareList.length} terreno{compareList.length !== 1 ? 's' : ''} seleccionado{compareList.length !== 1 ? 's' : ''}
                </span>
                <div className="flex gap-2">
                  {compareList.map(terreno => (
                    <div key={terreno._id} className="relative w-16 h-16">
                      <img 
                        src={terreno.galeria_imagenes?.[0]} 
                        alt={terreno.titulo}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={clearCompareList}
                  className="px-4 py-2 text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => navigate(`/comparar/${compareList.map(t => t._id).join(',')}`)}
                  disabled={compareList.length < 2}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Comparar terrenos
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};