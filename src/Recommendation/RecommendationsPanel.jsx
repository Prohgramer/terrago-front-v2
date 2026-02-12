import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { RecommendationCard } from "./RecommendationCard";

export const RecommendationsPanel = ({ userId }) => {
    console.log("UserID in RecommendationsPanel:", userId);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/recommendations/recommendations/${userId}`);
        const data = await res.json();
        if (data.success) {
          setRecommendations(data.recommendations);
        } else {
          setError(data.error || "Error al obtener recomendaciones");
        }
      } catch (err) {
        setError("Error al conectar con el servidor");
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin mb-2" />
        Cargando recomendaciones...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 rounded-xl shadow-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-2xl shadow-md p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Recomendaciones personalizadas
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Filtros
          </Button>
        </div>
      </div>

      {recommendations.length === 0 ? (
        <p className="text-gray-500 text-sm text-center mt-4">
          No se encontraron recomendaciones.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {recommendations.map((rec, i) => (
            <motion.div
              key={rec.id_terreno || i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <RecommendationCard recommendation={rec} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
