import React, { useState, useEffect } from 'react'
import { Header } from './MainPage/Header';
import { HeroSection } from './MainPage/Hero';
import { Footer } from './MainPage/Footer';
import { ResultsSection } from './MainPage/Result';
import { useAuth } from './routes/AuthProvider';
import { RecentlyViewed } from './componentes/RecentlyViewed';
import { ProfileCompletionModal } from './componentes/ProfileCompletionModal';
import useSearchFilter from './hooks/useSearchFilter';
import ChatbaseBot from '@/componentes/ChatbaseBot';
import { Navigate } from 'react-router-dom';
import * as Sentry from '@sentry/react';

export const TerrenosCompare = () => {
  const [lands, setLands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    ciudad: '',
  });
  const [page, setPage] = useState(1);
  const [perPage] = useState(12); // ajustar si deseas
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [profileData, setProfileData] = useState({missing_fields: [
        "Rango precio",
        "Superficie minima",
        "Motivo compra"
    ],
    next_improvement: "Completa tus preferencias para mejorar las recomendaciones",
    progress: 100,
    success: false,
    user_id: "68e41f2d874abe0c14b860ba"});
  const [userid, setUserId] = useState(null);
  const [searchActive, setSearchActive] = useState(false);
  const [currentSearchFilters, setCurrentSearchFilters] = useState(null);
  const { loggedIn, user, logout } = useAuth();

  // hook de búsqueda
  const { 
    terrains, 
    loading: searchLoading, 
    error: searchError, 
    count: searchCount,
    searchTerrains 
  } = useSearchFilter();

  // ---- reemplaza el useEffect inicial por este: solo carga lista general si NO hay búsqueda activa
  useEffect(() => {
    if (!searchActive) {
      fetchLands(searchFilters, page);
    }
  }, [searchFilters, page, searchActive]);

  const fetchLands = async (filters = {}, pageParam = 1) => {
     try {
       setIsLoading(true);
        const params = new URLSearchParams();
      params.set('page', String(pageParam));
      params.set('per_page', String(perPage));

      // Agregar el token a las peticiones
      const token = localStorage.getItem('authToken');
      const headers = {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/resultados?${params.toString()}`, {
        headers
      });
      
      // Si el token es inválido, hacer logout
      if (res.status === 401) {
        logout();
        return;
      }

      const json = await res.json();
      // La API devuelve: { results: [...], total, total_pages, page, per_page }
      const items = json.results ?? [];
      setLands(items);
      setTotalItems(json.total ?? 0);
      setTotalPages(json.total_pages ?? 1);
     } catch (error) {
       console.error("Error al obtener datos:", error);
     } finally {
       setIsLoading(false);
       Sentry.logger.info('User triggered test log', { log_source: 'sentry_test' })
     }
   };

   useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      setUserId(user?.id || null);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${user.id}/progress`);
        const data = await res.json();
        if (data.success) setProfileData(data);
      } catch (err) {
        console.error("Error obteniendo progreso:", err);
      }
    };
    fetchProgress();
  }, [userid,user]);

  // handleSearch ahora marca búsqueda activa y usa page=1
  const handleSearch = async (filters) => {
    try {
      setIsLoading(true);
      setSearchActive(true);
      setCurrentSearchFilters(filters);
      setPage(1);

      const result = await searchTerrains(filters, perPage, 1);

      if (result.success) {
        setLands(result.data || []);
        setTotalItems(result.count || 0);
        setTotalPages(Math.max(1, Math.ceil((result.count || 0) / perPage)));
      } else {
        setLands([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error searching terrains:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // handlePageChange ahora considera búsqueda activa
  const handlePageChange = async (newPage) => {
    // evitar llamadas innecesarias
    if (newPage === page) return;

    // scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Si estamos en búsqueda, pedir la página correspondiente al endpoint de búsqueda
    if (searchActive && currentSearchFilters) {
      try {
        setIsLoading(true);
        const result = await searchTerrains(currentSearchFilters, perPage, newPage);
        if (result.success) {
          setLands(result.data || []);
          setTotalItems(result.count || 0);
          setTotalPages(Math.max(1, Math.ceil((result.count || 0) / perPage)));
          setPage(newPage);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // si no hay búsqueda activa, solo actualizamos page y el useEffect fetchLands lo cargará
    setPage(newPage);
  };

  // Puedes agregar una función para limpiar la búsqueda y volver al listado general
  const clearSearch = () => {
    setSearchActive(false);
    setCurrentSearchFilters(null);
    setSearchFilters({ ciudad: '' });
    setPage(1);
    // fetchLands se ejecutará por el useEffect porque searchActive cambió a false
  };

  if (user?.first_login === true) {
    return <Navigate to="/userOnboarding" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-emerald-50 to-amber-50 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900 text-neutral-800 dark:text-neutral-100">
      <ChatbaseBot />
      <Header  />

      <HeroSection
        onSearch={handleSearch}
        searchFilters={searchFilters}
        setSearchFilters={setSearchFilters}
      />

      <ProfileCompletionModal
        userProgress={profileData.progress}
        missing={profileData.missing_fields}
        nextImprovement={profileData.next_improvement}
      />

      {searchError && (
        <div className="max-w-7xl mx-auto px-4 py-4 text-red-500">
          Error: {searchError}
        </div>
      )}

      <ResultsSection
        lands={searchActive && terrains.length ? terrains : lands}
        isLoading={isLoading || searchLoading}
        onClearFilters={clearSearch}    // <-- pasar la función aquí
      />

      {/* Show "No results found" message when search returns empty */}
      {!isLoading && terrains.length === 0 && searchFilters.ciudad && (
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            No se encontraron terrenos en "{searchFilters.ciudad}"
          </p>
        </div>
      )}

      {/* Controles simples de paginación */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-center items-center gap-3">
        <button
          onClick={() => handlePageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-white/20 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <div className="">
          Página {page} de {totalPages} ({totalItems} items)
        </div>
        <button
          onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-white/20 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>

      <RecentlyViewed />
      
      <Footer />
      
    </div>
    
  );
};
