import React, { useState } from 'react'
import { useEffect } from 'react';


export const MapContainer = ({ selectedProperty }) => {
  const mapRef = React.useRef(null);
  const leafletMapRef = React.useRef(null);
  const currentMarkerRef = React.useRef(null);
  const [currentLayer, setCurrentLayer] = useState('street'); // 'street' o 'satellite'
  
  useEffect(() => {
    if (!selectedProperty && leafletMapRef.current) {
      // Volver a la vista general cuando no hay selección
      leafletMapRef.current.flyTo([-25.2867, -57.3333], 12, {
        duration: 1.5
      });
      
      // Remover marcador si existe
      if (currentMarkerRef.current) {
        leafletMapRef.current.removeLayer(currentMarkerRef.current);
        currentMarkerRef.current = null;
      }
    }
  }, [selectedProperty]);

  // Inicializar mapa
  useEffect(() => {
    if (!mapRef.current) return;

    const loadLeaflet = async () => {
      if (typeof window !== 'undefined' && !window.L) {
        // Cargar CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
        document.head.appendChild(link);

        // Cargar JS
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
        // Definir las capas
        const streetLayer = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 17
        });

        const satelliteLayer = window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
          maxZoom: 17
        });

        // Agregar la capa inicial
        streetLayer.addTo(leafletMapRef.current);

        // Agregar control de capas
        const baseLayers = {
          "Calles": streetLayer,
          "Satélite": satelliteLayer
        };

        window.L.control.layers(baseLayers, {}).addTo(leafletMapRef.current);
      }
    };

    loadLeaflet();
  }, []);

  // Actualizar marcador cuando cambia la propiedad seleccionada
  useEffect(() => {
    if (!selectedProperty || !leafletMapRef.current || !window.L) return;

    // Remover marcador anterior
    if (currentMarkerRef.current) {
      leafletMapRef.current.removeLayer(currentMarkerRef.current);
    }

    // Crear icono personalizado
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
      ">${selectedProperty.image}</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15],
      className: 'custom-div-icon'
    });

    // Crear nuevo marcador
    currentMarkerRef.current = window.L.marker([selectedProperty.lat, selectedProperty.lng], { 
      icon: customIcon 
    }).addTo(leafletMapRef.current);

    // Crear popup personalizado
    const popupContent = `
      <div style="color: #f97316; font-size: 1.2rem; font-weight: 600; margin-bottom: 8px;">
        ${selectedProperty.type}
      </div>
      <div style="color: #fff; margin-bottom: 8px;">
        ${selectedProperty.address}
      </div>
      <div style="color: #f97316; font-size: 1.1rem; font-weight: 600;">
        ${selectedProperty.price}
      </div>
    `;

    currentMarkerRef.current.bindPopup(popupContent).openPopup();

    // Centrar mapa con animación
    leafletMapRef.current.flyTo([selectedProperty.lat || -25.33, selectedProperty.lng || -15.33], 15, {
      duration: 1.5
    });
  }, [selectedProperty]);

  return (
    <div className="relative bg-gray-900 h-screen">
      {/* <MapHeader selectedProperty={selectedProperty} />
      <NoSelection show={!selectedProperty} /> */}
      {!selectedProperty && (
        <div className="absolute inset-0 z-[400] bg-black/50 flex items-center justify-center text-white pointer-events-none">
          <p className="text-center p-4">
            Selecciona un terreno para ver su ubicación
          </p>
        </div>
      )}
      <div ref={mapRef} className="h-full w-full" />
      
      {/* Control personalizado para cambiar vista */}
      <div className="absolute top-4 right-4 z-[500] bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-2">
        
      </div>
      
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
      `}</style>
    </div>
  );
};