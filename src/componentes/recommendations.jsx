import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Recommendations({ userId }) {
  const [loading, setLoading] = useState(true);
  const [recs, setRecs] = useState([]);

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/recommendations/recommendations/${userId}`);
        const data = await res.json();
        if (data.success) setRecs(data.recommendations);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecs();
  }, [userId]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        🌿 Terrenos recomendados para vos
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {loading
            ? Array(6)
                .fill(0)
                .map((_, idx) => (
                  <SkeletonCard key={idx} />
                ))
            : recs.map((terreno, idx) => (
                <motion.div
                  key={terreno.id_terreno || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition"
                >
                  <img
                    src={terreno.imagen}
                    alt={terreno.titulo}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {terreno.titulo}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      Compatibilidad:{" "}
                      <span
                        className={
                          terreno.compatibilidad === "Alta"
                            ? "text-green-600 font-medium"
                            : terreno.compatibilidad === "Media"
                            ? "text-yellow-600 font-medium"
                            : "text-red-600 font-medium"
                        }
                      >
                        {terreno.compatibilidad}
                      </span>
                    </p>
                    <p className="text-gray-600 text-sm">{terreno.razon}</p>
                    <p className="mt-2 text-green-700 font-semibold">
                      Puntaje: {terreno.puntaje}/100
                    </p>
                  </div>
                </motion.div>
              ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white rounded-2xl shadow-md overflow-hidden">
      <div className="bg-gray-200 h-48 w-full"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  );
}
