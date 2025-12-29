import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Brain, X } from "lucide-react";
import { Link } from 'react-router-dom';

export const ProfileCompletionModal = ({
  userProgress = 100,
  missing = [],
  nextImprovement,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Mostrar el modal después de 2 segundos si el perfil está incompleto
    const hasClosedModal = localStorage.getItem("hasClosedProfileModal");
    if (userProgress < 80 && !hasClosedModal) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [userProgress]);

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem("hasClosedProfileModal", "true");
  };

  const level =
    userProgress >= 80
      ? "Alto"
      : userProgress >= 50
      ? "Medio"
      : "Bajo";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed top-20 right-4 w-72 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-4 z-50"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          >
            <X size={16} />
          </button>

          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Completa tu perfil</h3>
              <Progress value={userProgress} className="h-2 w-full my-2" />
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                Nivel de precisión IA:{" "}
                <span
                  className={
                    level === "Alto"
                      ? "text-green-600 dark:text-green-400"
                      : level === "Medio"
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-red-600 dark:text-red-400"
                  }
                >
                  {level}
                </span>
              </p>

              {missing.length > 0 && (
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                  Faltan: {missing.join(", ")}
                </p>
              )}

              <Link
                to="/perfil"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium"
              >
                Completar ahora
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
