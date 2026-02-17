import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTerrainDetail } from '@/hooks/useTerrainDetail';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Heart, Printer } from 'lucide-react';
import { MapContainerDetail } from '@/Register/MapContainerDetail';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useFavorites } from '@/hooks/useFavorites';

export const TerrainDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { terrain, loading, error } = useTerrainDetail(id);
  const { addToRecentlyViewed } = useRecentlyViewed();
  //console.log(terrain.cercanias);
  
  const { toggleFavorite, loading: favLoading, isFavorite } = useFavorites();

  const handleFavoriteClick = async (e) => {
    e?.stopPropagation();
    if (favLoading) return;
    try {
      await toggleFavorite(terrain._id);
    } catch (err) {
      console.error('favorite error', err);
    }
  };

  const [selectedImage, setSelectedImage] = useState(0);
  React.useEffect(() => {
    if (terrain) {
      addToRecentlyViewed(terrain);
    }
  }, [terrain, addToRecentlyViewed]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;
  if (!terrain) return <div className="text-center p-6">No se encontró el terreno</div>;
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Galería de imágenes */}
   <div className="grid grid-cols-2 gap-4 p-4 bg-white dark:bg-neutral-800">
  {/* Imagen principal - ocupa toda la altura del lado izquierdo */}
  <div 
    className={`relative row-span-2 cursor-pointer transition-all h-80 ${
      selectedImage === 0 ? 'ring-2 ring-emerald-500' : ''
    }`}
    onClick={() => setSelectedImage(0)}
  >
    <img 
      src={terrain.galeria_imagenes?.[0]} 
      alt="Vista principal"
      className="w-full h-full object-cover rounded-lg"
    />
  </div>

  {/* Cuadrícula de 4 imágenes en el lado derecho (2x2) */}
  <div className="grid grid-cols-2 gap-4">
    {terrain.galeria_imagenes?.slice(1, 5).map((img, index) => (
      <div 
        key={index + 1}
        className={`relative h-[9.5rem] cursor-pointer transition-all ${
          selectedImage === index + 1 ? 'ring-2 ring-emerald-500' : ''
        }`}
        onClick={() => setSelectedImage(index + 1)}
      >
        <img 
          src={img} 
          alt={`Vista ${index + 2}`}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    ))}
  </div>
</div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Botón volver y acciones */}
        <div className="flex items-center justify-between mb-8">
          <div 
            variant="ghost" 
            className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >

          </div>

          <div className="flex gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleFavoriteClick}
              disabled={favLoading}
              className={favLoading ? 'opacity-60 cursor-not-allowed' : ''}
            >
              <Heart className={`w-5 h-5 ${
                  isFavorite(terrain._id)
                    ? 'fill-red-500 text-red-500'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              />
            </Button>
            {/* <Button variant="ghost" size="icon">
              <Share2 className="w-5 h-5" />
            </Button> */}
          </div>
        </div>

        {/* Información del terreno */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                {terrain.titulo}
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 mt-2">
                {terrain.ciudad}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Cuota desde</p>
                <p className="text-lg font-semibold"> {terrain.cuota?.toLocaleString()}</p>
              </Card>

              <Card className="p-4">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Lotes disponibles</p>
                <p className="text-lg font-semibold">{terrain.lotes_disponibles} de {terrain.total_lotes}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Tipo</p>
                <p className="text-lg font-semibold">{'Terreno'}</p>
              </Card>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Descripción</h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {terrain.descripcion}
              </p>
            </div>

            {/* Servicios */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Servicios y Accesos</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(terrain.servicios || {}).map(([key, value]) => (
                  <div 
                    key={key}
                    className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400"
                  >
                    <div className={`w-2 h-2 rounded-full ${value ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mapa y formulario de contacto */}
          <div className="space-y-6">
            {/* <Card className="p-4">
              <div className="h-[300px] rounded-lg overflow-hidden">
                <MapContainer selectedProperty={terrain} />
              </div>
            </Card> */}
             <MapContainerDetail
              selectedProperty={terrain}
              cercanias={/*cercaniasData*/ terrain.cercanias}
            /> 

          </div>
        </div>
      </div>
    </div>
  );
};

