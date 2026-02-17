import { formatearGuaranies } from '@/utils/formatters';
import React, { useState } from 'react'
import { useEffect } from 'react';

// Constante con los límites del área urbana de Asunción
const LIMITES_ASUNCION = [

  [-25.35585199517452, -57.5699024315337],
  [-25.35024951082645, -57.57306452756903],
  [-25.347740114587317, -57.575942977207255],
  [-25.34410858255803, -57.580827348347555],
  [-25.339268468023654, -57.58494756679606],
  [-25.320083203285, -57.560036033259486],
  [-25.309533008597327, -57.55372125992591],
  [-25.309296476297746, -57.55254153362284],
  [-25.307326115572668, -57.55100223978491],
  [-25.30002653981804, -57.54618562381503],
  [-25.29632267172524, -57.5434775014992],
  [-25.294199289769523, -57.543742294738934],
  [-25.292618690235358, -57.542927992081914],
  [-25.292364575948334, -57.542277070694375],
  [-25.29181635408531, -57.54171908927151],
  [-25.29568156962197, -57.53599690447711],
  [-25.298866607284044, -57.534313546382464],
  [-25.302537381116508, -57.53336282320885],
  [-25.30449162143271, -57.53102179590843],
  [-25.307726378452866, -57.52829002998356],
  [-25.311414181946482, -57.52571073937116],
  [-25.314263070818527, -57.5229849217734],
  [-25.316703510407624, -57.520820790948854],
  [-25.318746587381675, -57.51821707917206],
  [-25.32020789250506, -57.51884059821812],
  [-25.320790539991485, -57.520136478638065],
  [-25.321470226758713, -57.5195534881488],
  [-25.323221116284508, -57.52126348199374],
  [-25.320818989493425, -57.523473109769796],
  [-25.32285465254743, -57.52592668770899],
  [-25.325444224043395, -57.52866835630986],
  [-25.325676158867, -57.52716024256203],
  [-25.328901223715235, -57.52735751260906],
  [-25.3338111270011, -57.52748711299762],
  [-25.333392766141817, -57.53166744866954],
  [-25.333170758693875, -57.534146750827524],
  [-25.334615202262, -57.53467277039323],
  [-25.332567071812566, -57.5400951696922],
  [-25.336766318181645, -57.54302866663457],
  [-25.34096556455073, -57.54596216357693],
  [-25.35013107492592, -57.550980474008114],
  [-25.356927735776868, -57.551994637929354],
  [-25.35585199517452, -57.5699024315337]

];

export const MapContainer = ({ selectedProperty }) => {
  const mapRef = React.useRef(null);
  const leafletMapRef = React.useRef(null);
  const currentMarkerRef = React.useRef(null);
  const asuncionAreaRef = React.useRef(null); // Nueva referencia para el área
  
  useEffect(() => {
    if (!selectedProperty && leafletMapRef.current) {
      // Volver a la vista general cuando no hay selección
      leafletMapRef.current.flyTo([-25.2822, -57.6351], 12, {
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
          center: [-25.2822, -57.6351],
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

        // Agregar el área urbana de Asunción
        asuncionAreaRef.current = window.L.polygon(LIMITES_ASUNCION, {
          color: '#f97316',
          fillColor: '#f97316',
          fillOpacity: 0.15,
          weight: 2,
          dashArray: '5, 10'
        }).addTo(leafletMapRef.current);

        asuncionAreaRef.current.bindPopup('<b>Asunción</b><br>Área urbana');
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
        ${ formatearGuaranies(selectedProperty.price)}
      </div>
    `;

    currentMarkerRef.current.bindPopup(popupContent).openPopup();

    // Centrar mapa con animación
    leafletMapRef.current.flyTo([selectedProperty.lat || -25.33, selectedProperty.lng || -57.6351], 15, {
      duration: 1.5
    });
  }, [selectedProperty]);

  return (
    <div className="relative bg-gray-900 h-screen">
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
      
      <style>{`
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