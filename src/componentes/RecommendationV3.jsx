import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Loader2, DollarSign, Maximize, ChevronDown, ChevronUp, GraduationCap, Heart, ShoppingCart, Bus, TreePine, Pill, Building2, Star, CheckCircle2 } from 'lucide-react';
import { Header } from '@/MainPage/Header';
import { useAuth } from '@/routes/AuthProvider';

const TerrenosMap = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?.id || null;

  const [terrenos, setTerrenos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTerreno, setSelectedTerreno] = useState(null);
  const [expandedTerreno, setExpandedTerreno] = useState(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);

  // fetch recomendaciones desde backend y mapear a la forma que usa el componente
  useEffect(() => {
    const fetchRecs = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/recommendations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id:userId })
        });

        const data = await res.json();

        if (data && data.success && Array.isArray(data.recommendations)) {
          const mapped = data.recommendations.map((r, idx) => ({
            // id usado internamente (asegurar único)
            id: r.id_terreno ?? r.id ?? `rec-${idx}`,
            id_terreno: r.id_terreno ?? r.id ?? null,
            titulo: r.titulo ?? r.title ?? 'Sin título',
            // si el backend no retorna precio/superficie, dejamos placeholder
            precio: r.precio ?? r.price ?? '—',
            superficie: r.superficie ?? r.surface ?? '—',
            lat: r.latitud ?? r.lat ?? r.latitude ?? 0,
            lng: r.longitud ?? r.lng ?? r.longitude ?? 0,
            compatibilidad: r.compatibilidad ?? 'Media',
            resumen: r.resumen ?? '',
            motivos_principales: r.motivos_principales ?? r.motives ?? [],
            entorno_y_servicios: r.entorno_y_servicios ?? r.services ?? []
          }));
          setTerrenos(mapped);
        } else {
          // si no hay success, vaciamos lista
          setTerrenos([]);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setTerrenos([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchRecs();
    } else {
      setLoading(false);
    }
  }, []);

  // Inicializar mapa con Leaflet (mantengo tu lógica)
  useEffect(() => {
    if (!mapRef.current) return;
    if (window.L && !map) {
      try {
        const newMap = window.L.map(mapRef.current).setView([-25.2637, -57.5759], 12);
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(newMap);
        setMap(newMap);
      } catch (error) {
        console.error('Error inicializando mapa:', error);
      }
      return;
    }

    if (!window.L && !map) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
      script.onload = () => {
        setTimeout(() => {
          try {
            const newMap = window.L.map(mapRef.current).setView([-25.2637, -57.5759], 12);
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors',
              maxZoom: 19
            }).addTo(newMap);
            setMap(newMap);
          } catch (error) {
            console.error('Error inicializando mapa:', error);
          }
        }, 200);
      };
      script.onerror = () => console.error('Error cargando Leaflet');
      document.body.appendChild(script);
    }
  }, [map]);

  // Añadir marcadores al mapa
  useEffect(() => {
    if (!map || !window.L) return;

    const L = window.L;

    // limpiar markers previos
    markers.forEach(marker => marker.remove());

    const validTerrenos = terrenos.filter(t => Number(t.lat) && Number(t.lng));
    const newMarkers = validTerrenos.map(terreno => {
      const marker = L.marker([terreno.lat, terreno.lng])
        .addTo(map)
        .bindPopup(`<b>${terreno.titulo}</b><br>${terreno.precio}<br><span style="color: ${getCompatibilidadColor(terreno.compatibilidad)}">${terreno.compatibilidad} Compatibilidad</span>`);

      marker.on('click', () => {
        setSelectedTerreno(terreno);
        setExpandedTerreno(terreno.id);
      });

      return marker;
    });

    setMarkers(newMarkers);

    if (validTerrenos.length > 0) {
      const bounds = L.latLngBounds(validTerrenos.map(t => [t.lat, t.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, terrenos]);

  const irATerreno = (terreno) => {
    setSelectedTerreno(terreno);
    if (map) {
      map.setView([terreno.lat, terreno.lng], 15);
      markers.forEach(marker => {
        const pos = marker.getLatLng();
        if (pos.lat === terreno.lat && pos.lng === terreno.lng) {
          marker.openPopup();
        }
      });
    }
  };

  const goToTerreno = (terreno) => {
    if (terreno.id_terreno) {
      navigate(`/terreno/${terreno.id_terreno}`);
    } else {
      console.warn('No se encontró ID del terreno');
    }
  };


  const toggleExpanded = (terrenoId) => {
    setExpandedTerreno(expandedTerreno === terrenoId ? null : terrenoId);
  };

  const getCompatibilidadColor = (nivel) => {
    switch(nivel) {
      case 'Alta': return '#10b981';
      case 'Media': return '#f59e0b';
      case 'Baja': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getCompatibilidadBg = (nivel) => {
    switch(nivel) {
      case 'Alta': return 'bg-green-100 text-green-700 border-green-300';
      case 'Media': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'Baja': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const parseServicio = (texto) => {
    if (!texto) return { icon: Building2, text: '' };
    if (texto.toLowerCase().includes('colegio')) return { icon: GraduationCap, text: texto };
    if (texto.toLowerCase().includes('hospital')) return { icon: Heart, text: texto };
    if (texto.toLowerCase().includes('supermercado')) return { icon: ShoppingCart, text: texto };
    if (texto.toLowerCase().includes('transporte')) return { icon: Bus, text: texto };
    if (texto.toLowerCase().includes('parque')) return { icon: TreePine, text: texto };
    if (texto.toLowerCase().includes('farmacia')) return { icon: Pill, text: texto };
    return { icon: Building2, text: texto };
  };

  return (
    <>
      <Header />
      <div className="flex h-screen bg-gray-50">
        <div className="w-[480px] bg-white shadow-xl overflow-y-auto">
          <div className="p-6 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-2xl font-bold text-white">Terrenos Recomendados</h2>
              {!loading && <span className="bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full">{terrenos.length} encontrados</span>}
            </div>
            <p className="text-blue-100 text-sm">Analizados con IA según tus necesidades</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600 text-center font-medium">Analizando terrenos perfectos para ti...</p>
              <p className="text-gray-400 text-sm mt-2">Esto puede tomar unos segundos</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {terrenos.map(terreno => {
                const isExpanded = expandedTerreno === terreno.id;
                const isSelected = selectedTerreno?.id === terreno.id;
                return (
                  <div key={terreno.id} className={`rounded-xl border-2 transition-all overflow-hidden ${isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-blue-300 hover:shadow-md'}`}>
                    <div onClick={() => irATerreno(terreno)} className="p-5 cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg mb-2 leading-tight">{terreno.titulo}</h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getCompatibilidadBg(terreno.compatibilidad)}`}><Star className="w-3 h-3 mr-1" /> Compatibilidad {terreno.compatibilidad}</span>
                        </div>
                        <MapPin className={`w-5 h-5 flex-shrink-0 ml-2 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                      </div>

                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center text-sm">
                          <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                          <span className="font-bold text-green-600 text-lg">{terreno.precio}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Maximize className="w-4 h-4 mr-1" />
                          <span className="font-medium">{terreno.superficie}</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 leading-relaxed">{terreno.resumen}</p>
                    </div>

                    <button onClick={(e) => { e.stopPropagation(); toggleExpanded(terreno.id); }} className="w-full py-3 px-5 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-sm font-medium text-gray-700 border-t border-gray-200">
                      <span>{isExpanded ? 'Ocultar detalles' : 'Ver análisis completo'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {isExpanded && (
                      <div className="p-5 bg-gradient-to-b from-gray-50 to-white border-t border-gray-200 space-y-5">
                        <div>
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center"><CheckCircle2 className="w-5 h-5 mr-2 text-blue-600" />¿Por qué es ideal para ti?</h4>
                          <ul className="space-y-2">
                            {terreno.motivos_principales.map((motivo, idx) => (
                              <li key={idx} className="flex items-start text-sm">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 mr-3 flex-shrink-0" />
                                <span className="text-gray-700 leading-relaxed">{motivo}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center"><Building2 className="w-5 h-5 mr-2 text-blue-600" />Entorno y Servicios</h4>
                          <div className="space-y-3">
                            {terreno.entorno_y_servicios.map((servicio, idx) => {
                              const { icon: Icon, text } = parseServicio(servicio);
                              return (
                                <div key={idx} className="flex items-start bg-white p-3 rounded-lg border border-gray-200">
                                  <Icon className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0 mt-0.5" />
                                  <span className="text-sm text-gray-700 leading-relaxed">{text}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            goToTerreno(terreno); 
                          }} 
                          className="w-full py-3 px-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg"
                        >
                          Ver Terreno Completo
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex-1 relative">
          <div ref={mapRef} className="w-full h-full" />
          {loading && (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-700 font-medium text-lg">Cargando mapa...</p>
                <p className="text-gray-500 text-sm mt-1">Preparando ubicaciones</p>
              </div>
            </div>
          )}

          {selectedTerreno && !loading && (
            <div className="absolute top-6 left-6 bg-white rounded-xl shadow-2xl p-4 max-w-sm border-2 border-blue-500">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-gray-900 text-sm flex-1 leading-tight">{selectedTerreno.titulo}</h3>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${getCompatibilidadBg(selectedTerreno.compatibilidad)}`}>{selectedTerreno.compatibilidad}</span>
              </div>
              <p className="text-lg font-bold text-green-600 mb-1">{selectedTerreno.precio}</p>
              <p className="text-xs text-gray-600">{selectedTerreno.superficie}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TerrenosMap;