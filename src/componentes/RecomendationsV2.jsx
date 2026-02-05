import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, Home, DollarSign, Maximize } from 'lucide-react';

const TerrenosMap = () => {
  const [terrenos, setTerrenos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTerreno, setSelectedTerreno] = useState(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);

  // Simulación de búsqueda de terrenos (reemplaza con tu llamada a la IA)
//   useEffect(() => {
//     const buscarTerrenos = async () => {
//       setLoading(true);
      
//       // Simula una búsqueda de 2 segundos
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       // Datos de ejemplo - reemplaza con tus datos reales
//       const terrenosEncontrados = [
//         {
//           id: 1,
//           nombre: "Terreno Urbano Centro",
//           precio: "$85,000",
//           superficie: "250 m²",
//           lat: -25.2637,
//           lng: -57.5759,
//           descripcion: "Ubicación céntrica, ideal para comercio"
//         },
//         {
//           id: 2,
//           nombre: "Terreno Residencial",
//           precio: "$120,000",
//           superficie: "450 m²",
//           lat: -25.2800,
//           lng: -57.6300,
//           descripcion: "Zona residencial tranquila, servicios completos"
//         },
//         {
//           id: 3,
//           nombre: "Terreno Esquina",
//           precio: "$95,000",
//           superficie: "320 m²",
//           lat: -25.2500,
//           lng: -57.5500,
//           descripcion: "Esquina con alto tránsito, excelente visibilidad"
//         },
//         {
//           id: 4,
//           nombre: "Terreno Industrial",
//           precio: "$200,000",
//           superficie: "800 m²",
//           lat: -25.3000,
//           lng: -57.6000,
//           descripcion: "Zona industrial, acceso a rutas principales"
//         }
//       ];
      
//       setTerrenos(terrenosEncontrados);
//       setLoading(false);
//     };

//     buscarTerrenos();
//   }, []);


useEffect(() => {
    const fetchRecs = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/recommendations/recommendations`, {
                method: 'POST', // 1. Especificar el método
                headers: {
                    'Content-Type': 'application/json' // 2. Decirle al server que envías JSON
                },
                body: JSON.stringify({ userId: userId }) // 3. Enviar el dato en el cuerpo
            });

            const data = await res.json();
            
            if (data.success) {
                setRecs(data.recommendations);
            }
        } catch (error) {
            console.error("Error fetching recommendations:", error);
        } finally {
            setLoading(false);
        }
    };

    if (userId) { // Buena práctica: solo llamar si existe el userId
        fetchRecs();
    }
}, [userId]);


  // Inicializar mapa con Leaflet
  useEffect(() => {
    if (!mapRef.current || map) return;

    // Cargar Leaflet CSS y JS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
    script.onload = () => {
      const L = window.L;
      
      // Crear mapa centrado en Asunción
      const newMap = L.map(mapRef.current).setView([-25.2637, -57.5759], 12);
      
      // Añadir capa de tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(newMap);
      
      setMap(newMap);
    };
    document.body.appendChild(script);

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  // Añadir marcadores al mapa
  useEffect(() => {
    if (!map || !window.L || terrenos.length === 0) return;

    const L = window.L;
    
    // Limpiar marcadores anteriores
    markers.forEach(marker => marker.remove());
    
    const newMarkers = terrenos.map(terreno => {
      const marker = L.marker([terreno.lat, terreno.lng])
        .addTo(map)
        .bindPopup(`<b>${terreno.nombre}</b><br>${terreno.precio}`);
      
      marker.on('click', () => {
        setSelectedTerreno(terreno);
      });
      
      return marker;
    });
    
    setMarkers(newMarkers);
    
    // Ajustar vista para mostrar todos los marcadores
    if (terrenos.length > 0) {
      const bounds = L.latLngBounds(terrenos.map(t => [t.lat, t.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, terrenos]);

  // Navegar a un terreno específico
  const irATerreno = (terreno) => {
    setSelectedTerreno(terreno);
    if (map) {
      map.setView([terreno.lat, terreno.lng], 15);
      
      // Abrir popup del marcador
      markers.forEach(marker => {
        const pos = marker.getLatLng();
        if (pos.lat === terreno.lat && pos.lng === terreno.lng) {
          marker.openPopup();
        }
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar con lista de terrenos */}
      <div className="w-96 bg-white shadow-lg overflow-y-auto">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700">
          <h2 className="text-2xl font-bold text-white mb-2">
            Terrenos Recomendados
          </h2>
          <p className="text-blue-100 text-sm">
            Basados en tus preferencias
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600 text-center">
              Buscando los mejores terrenos para ti...
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {terrenos.map(terreno => (
              <div
                key={terreno.id}
                onClick={() => irATerreno(terreno)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                  selectedTerreno?.id === terreno.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-800 flex-1">
                    {terreno.nombre}
                  </h3>
                  <MapPin className={`w-5 h-5 flex-shrink-0 ${
                    selectedTerreno?.id === terreno.id
                      ? 'text-blue-600'
                      : 'text-gray-400'
                  }`} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span className="font-medium text-green-600">
                      {terreno.precio}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Maximize className="w-4 h-4 mr-1" />
                    <span>{terreno.superficie}</span>
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-2">
                    {terreno.descripcion}
                  </p>
                </div>

                <button
                  className="mt-3 w-full py-2 px-4 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    irATerreno(terreno);
                  }}
                >
                  Ver en el mapa
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mapa */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" />
        
        {loading && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Cargando mapa...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TerrenosMap;