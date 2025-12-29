import React, { useState, useEffect, useRef } from 'react';

export const MapContainerDetail = ({ selectedProperty, cercanias }) => {
  console.log(selectedProperty)
  console.log(cercanias)
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const currentMarkerRef = useRef(null);
  const nearbyMarkersRef = useRef([]);
  const [currentLayer, setCurrentLayer] = useState('street');
  const [rangeKm, setRangeKm] = useState(25);
  const [showNearby, setShowNearby] = useState(false);
  
  // Limpiar cuando no hay propiedad seleccionada
  useEffect(() => {
    if (!selectedProperty && leafletMapRef.current) {
      leafletMapRef.current.flyTo([-25.2867, -57.3333], 12, {
        duration: 1.5
      });
      
      if (currentMarkerRef.current) {
        leafletMapRef.current.removeLayer(currentMarkerRef.current);
        currentMarkerRef.current = null;
      }
      
      nearbyMarkersRef.current.forEach(marker => {
        leafletMapRef.current.removeLayer(marker);
      });
      nearbyMarkersRef.current = [];
      setShowNearby(false);
    }
  }, [selectedProperty]);

  // Inicializar mapa
  useEffect(() => {
    if (!mapRef.current) return;

    const loadLeaflet = async () => {
      if (typeof window !== 'undefined' && !window.L) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
        document.head.appendChild(link);

        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }

      if (window.L && !leafletMapRef.current) {
        leafletMapRef.current = window.L.map(mapRef.current, {
          center: [-25.2637, -57.5759],
          zoom: 12,
          minZoom: 8,
          maxZoom: 17,
          zoomControl: true,
        });

        const streetLayer = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 17
        });

        const satelliteLayer = window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri',
          maxZoom: 17
        });

        streetLayer.addTo(leafletMapRef.current);

        const baseLayers = {
          "Calles": streetLayer,
          "Satélite": satelliteLayer
        };

        window.L.control.layers(baseLayers, {}).addTo(leafletMapRef.current);
      }
    };

    loadLeaflet();
  }, []);

  // Actualizar marcador de la propiedad
  useEffect(() => {
    if (!selectedProperty || !leafletMapRef.current || !window.L) return;

    if (currentMarkerRef.current) {
      leafletMapRef.current.removeLayer(currentMarkerRef.current);
    }

    const customIcon = window.L.divIcon({
      html: `<div style="
        background: linear-gradient(45deg, #f97316, #fb923c);
        border: 3px solid #fff;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
      ">${selectedProperty.image || '🏠'}</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15],
      className: 'custom-div-icon'
    });

    currentMarkerRef.current = window.L.marker([selectedProperty.latitud, selectedProperty.longitud], { 
      icon: customIcon 
    }).addTo(leafletMapRef.current);

    const popupContent = `
      <div style="color: #f97316; font-size: 1.2rem; font-weight: 600; margin-bottom: 8px;">
        ${selectedProperty.type || 'Terreno'}
      </div>
      <div style="color: #fff; margin-bottom: 8px;">
        ${selectedProperty.ciudad || 'Sin dirección'}
      </div>
      <div style="color: #f97316; font-size: 1.1rem; font-weight: 600;">
        ${selectedProperty.cuota || 'Consultar'}
      </div>
    `;

    currentMarkerRef.current.bindPopup(popupContent).openPopup();

    leafletMapRef.current.flyTo([selectedProperty.latitud, selectedProperty.longitud], 15, {
      duration: 1.5
    });
  }, [selectedProperty]);

  // Actualizar marcadores de cercanías
  // Actualizar marcadores de cercanías (recursiva)
useEffect(() => {
  if (!selectedProperty || !leafletMapRef.current || !window.L || !showNearby || !cercanias) return;

  // 🔹 Limpiar marcadores anteriores
  nearbyMarkersRef.current.forEach(marker => {
    leafletMapRef.current.removeLayer(marker);
  });
  nearbyMarkersRef.current = [];

  // 🔹 Íconos por categoría
  const iconsByType = {
    'colegios': '🏫',
    'hospitales': '🏥',
    'clinicas': '🏥',
    'farmacias': '💊',
    'supermercados': '🛒',
    'mercados': '🛒',
    'centros_comerciales': '🏬',
    'transporte_publico': '🚌',
    'servicios_emergencia': '🚨',
    'policia': '👮',
    'bomberos': '🚒',
    'parques': '🌳',
    'cafes': '☕',
    'restaurantes': '🍽️',
    'default': '📍'
  };

  // 🔁 Función recursiva
  function renderNearby(data, parentCategory = null) {
    Object.keys(data ?? {}).forEach(category => {
      const value = data[category];
      const categoryKey = parentCategory || category; // para íconos

      if (Array.isArray(value)) {
        value.forEach(place => {
          if (place.distancia_km <= rangeKm && place.ubicacion) {
            const icon = window.L.divIcon({
              html: `<div style="
                background: #3b82f6;
                border: 2px solid #fff;
                border-radius: 50%;
                width: 28px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              ">${iconsByType[category] || iconsByType[categoryKey] || iconsByType.default}</div>`,
              iconSize: [28, 28],
              iconAnchor: [14, 14],
              popupAnchor: [0, -14],
              className: 'nearby-marker'
            });

            const marker = window.L.marker([place.ubicacion.lat, place.ubicacion.lng], { icon })
              .addTo(leafletMapRef.current);

            const popupContent = `
              <div style="color: #3b82f6; font-size: 1rem; font-weight: 600; margin-bottom: 6px;">
                ${place.nombre || place.tipo || category}
              </div>
              <div style="color: #fff; margin-bottom: 6px; font-size: 0.9rem;">
                ${place.direccion || 'Sin dirección'}
              </div>
              <div style="color: #3b82f6; font-weight: 600;">
                📍 ${place.distancia_km.toFixed(2)} km
              </div>
              ${place.nivel ? `<div style="color: #ccc; font-size: 0.85rem; margin-top: 4px;">Nivel: ${place.nivel}</div>` : ''}
            `;

            marker.bindPopup(popupContent);
            nearbyMarkersRef.current.push(marker);
          }
        });
      } 
      else if (typeof value === "object" && value !== null) {
        // 🔁 Llamada recursiva para objetos anidados
        renderNearby(value, category);
      }
    });
  }

  // 🔹 Llamar a la función recursiva con tus datos
  renderNearby(cercanias);

}, [selectedProperty, showNearby, rangeKm, cercanias]);

  const handleLayerToggle = () => {
    const map = leafletMapRef.current;
    if (!map) return;
    
    map.eachLayer((layer) => {
      if (layer instanceof window.L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    if (currentLayer === 'street') {
      window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}').addTo(map);
      setCurrentLayer('satellite');
    } else {
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      setCurrentLayer('street');
    }
  };

  return (
    <div className="relative bg-gray-900 h-screen">
      {!selectedProperty && (
        <div className="absolute inset-0 z-[400] bg-black/50 flex items-center justify-center text-white pointer-events-none">
          <p className="text-center p-4 text-lg">
            Selecciona un terreno para ver su ubicación
          </p>
        </div>
      )}
      
      <div ref={mapRef} className="h-full w-full" />
      
      {/* Panel de control de cercanías */}
      {selectedProperty && (
        <div className="absolute bottom-6 left-6 z-[500] bg-white dark:bg-neutral-800 rounded-lg shadow-xl p-4 max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-neutral-800 dark:text-white">
              🗺️ Lugares cercanos
            </h3>
            <button
              onClick={() => setShowNearby(!showNearby)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                showNearby 
                  ? 'bg-orange-500 text-white hover:bg-orange-600' 
                  : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
              }`}
            >
              {showNearby ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
          
          {showNearby && (
            <>
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    Radio de búsqueda
                  </label>
                  <span className="text-sm font-bold text-orange-500">
                    {rangeKm} km
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  step="1"
                  value={rangeKm}
                  onChange={(e) => setRangeKm(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  style={{
                    background: `linear-gradient(to right, #f97316 0%, #f97316 ${(rangeKm / 25) * 100}%, #e5e7eb ${(rangeKm / 25) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  <span>1 km</span>
                  <span>15 km</span>
                  <span>25 km</span>
                </div>
              </div>
              
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3">
                <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                  Categorías disponibles:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
                    <span>🏫</span> Colegios
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
                    <span>🏥</span> Hospitales
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
                    <span>💊</span> Farmacias
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
                    <span>🛒</span> Supermercados
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
                    <span>🏬</span> C. Comerciales
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
                    <span>🚌</span> Transporte
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      
      <style jsx>{`
        .leaflet-popup-content-wrapper {
          background: #374151 !important;
          color: #fff !important;
          border: 2px solid #f97316 !important;
          border-radius: 10px !important;
        }
        .leaflet-popup-tip {
          background: #374151 !important;
          border: 2px solid #f97316 !important;
        }
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          background: #f97316;
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: #f97316;
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};