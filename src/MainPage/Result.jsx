import React, { useState } from 'react'
import { TerrainCard } from './TerrainCard';
import { Card } from "@/components/ui/card";

import { MapContainer } from '@/maps/mapContainer';


export const ResultsSection = ({ lands, isLoading, onClearFilters }) => {
  //console.log(JSON.stringify(lands, null, 2));
  const [selectedProperty, setSelectedProperty] = useState({
    lat: -34.6037,
    lng: -58.3816,
    type: 'Terreno',
  });
   const handlePropertySelect = (propertyData) => {
    setSelectedProperty(propertyData);
  };
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);

  //const selectedProperty = properties.find(p => p.id === selectedPropertyId);

  const handlePropertySelectId = (propertyId) => {
    setSelectedPropertyId(propertyId);
  };
    
    return (
      <section id="comprar" className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Resultados: </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
            {(!lands || lands.length === 0) ? (
              <div className="col-span-2 text-center">
                <p className="text-center text-gray-500">No existen terrenos.</p>

                {/* Botón para reiniciar filtros */}
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => onClearFilters && onClearFilters()}
                    className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
                  >
                    Reiniciar filtros
                  </button>
                </div>
              </div>
            ) : (
              lands.map((t, index) => {
                const key = t.id ?? t._id ?? `land-${index}`;
                return (
                  <TerrainCard
                    key={key}
                    terreno={t}
                    onSelect={handlePropertySelect}
                  />
                );
              })
            )}
          </div>
          </div>

          {/* SIDE MAP */}
          <Card id="mapa" className="rounded-3xl sticky top-20 h-[560px] overflow-hidden">
              <MapContainer selectedProperty={selectedProperty} />  
          </Card>
        </div>
      </section>
    );
  };