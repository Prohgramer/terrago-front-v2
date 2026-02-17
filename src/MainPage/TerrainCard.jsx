import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Heart, Scale } from "lucide-react";
import { useFavorites } from '@/hooks/useFavorites';
import { useCompare } from '@/contexto/CompareContext';
import { formatearGuaranies } from '@/utils/formatters';


export const TerrainCard = ({ terreno,onSelect }) => {
  const navigate = useNavigate();
  const { toggleFavorite, loading, isFavorite } = useFavorites();

    const { toggleCompare, isInCompareList } = useCompare();

    const handleCompareClick = (e) => {
      e.stopPropagation();
      toggleCompare(terreno);
    };

    const handleCardClick = () => {
    // Crear objeto con la información necesaria para el mapa
      const propertyData = {
        lat: terreno.latitud || -25.2867,
        lng: terreno.longitud || -57.3333,
        type: terreno.tipo || 'Terreno',
        address: terreno.direccion || terreno.ciudad,
        price: terreno.cuota || 'Consultar',
        area: `${terreno.superficie || 0}m²`,
        image: '🏗️' // Puedes usar un emoji o ícono que represente el terreno
      };
    onSelect(propertyData);
    };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    
    if (loading) return;

    try {
      const result = await toggleFavorite(terreno._id);

    } catch (error) {
       toast({
         title: "Error",
         description: "No se pudo actualizar favoritos. Por favor, intenta nuevamente.",
         variant: "destructive",
       });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }}
      className="cursor-pointer"
      onClick={handleCardClick}
    >
      <Card className="overflow-hidden rounded-3xl hover:shadow-lg transition-shadow">
        <div className="relative h-44 bg-neutral-200 dark:bg-neutral-800">
          {terreno.galeria_imagenes && terreno.galeria_imagenes.length > 0 && (
            <img 
              src={terreno.galeria_imagenes[0]} 
              alt={terreno.titulo} 
              className="w-full h-full object-cover" 
            />
          )}
          <div className="absolute bottom-3 left-3 flex gap-2">
            <button
              onClick={handleFavoriteClick}
              disabled={loading}
              className={`p-2 rounded-full bg-white/90 dark:bg-neutral-900/90 shadow hover:scale-110 transition-transform ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Heart
                className={`h-5 w-5 ${
                  isFavorite(terreno._id) ? "fill-red-500 text-red-500" : "text-gray-600 dark:text-gray-300"
                }`}
              />
            </button>
            <button
              onClick={handleCompareClick}
              className="p-2 rounded-full bg-white/90 dark:bg-neutral-900/90 shadow hover:scale-110 transition-transform"
            >
              <Scale
                className={`h-5 w-5 ${
                  isInCompareList(terreno._id) ? "fill-blue-500 text-blue-500" : "text-gray-600 dark:text-gray-300"
                }`}
              />
            </button>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold leading-snug">{terreno.titulo}</p>
              <p className="text-xs opacity-70">{terreno.ciudad}</p>
            </div>
            <p className="font-extrabold text-emerald-700 dark:text-emerald-300">{formatearGuaranies(terreno.cuota)}</p>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Button 
              size="sm" 
              className="rounded-xl"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/terreno/${terreno._id}`);
              }}
            >
              Ver más
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="rounded-xl"
              onClick={(e) => {
                e.stopPropagation();
                window.open(terreno.ubicacion_url, '_blank');
              }}
            >
              Ver ubicación
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}