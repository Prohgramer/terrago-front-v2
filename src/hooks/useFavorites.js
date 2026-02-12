import { useState, useEffect } from 'react';
import { useAuth } from '../routes/AuthProvider';
import toast from 'react-hot-toast';

export const useFavorites = () => {
  const [loading, setLoading] = useState(false);
  const { user, updateUser } = useAuth();
  const [favoritesList, setFavoritesList] = useState(user?.favorites || []);

  useEffect(() => {
    if (user?.favorites) {
      setFavoritesList(user.favorites);
    }
  }, [user]);

  const toggleFavorite = async (loteId) => {
    const prevFavorites = favoritesList; // guardar para revertir
    try {
      setLoading(true);
      const isCurrentlyFavorite = favoritesList.includes(loteId);

      // Optimistic update
      const newFavorites = isCurrentlyFavorite
        ? favoritesList.filter(id => id !== loteId)
        : [...favoritesList, loteId];

      setFavoritesList(newFavorites);

      const endpoint = isCurrentlyFavorite 
        ? `${import.meta.env.VITE_API_URL}/${loteId}`
        : `${import.meta.env.VITE_API_URL}/favoritos`;

      const response = await fetch(endpoint, {
        method: isCurrentlyFavorite ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: isCurrentlyFavorite 
          ? JSON.stringify({ user_id: user?.id })
          : JSON.stringify({ lote_id: loteId, user_data: user })
      });

      if (!response.ok) {
        // Revert optimistic update
        setFavoritesList(prevFavorites);

        if (response.status === 401) {
          // Mostrar toast específico para no autenticado
          toast.error('Debes iniciar sesión para guardar favoritos');
          throw new Error('Unauthorized');
        }

        // intentar leer mensaje de error del backend
        const errBody = await response.json().catch(() => null);
        const msg = errBody?.error || 'Error al actualizar favoritos';
        toast.error(msg);
        throw new Error(msg);
      }

      const data = await response.json();

      // Update user in AuthContext with new favorites
      if (data.success) {
        updateUser({
          ...user,
          favorites: newFavorites
        });
      }

      return data;

    } catch (error) {
      console.error('Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (loteId) => {
    return favoritesList.includes(loteId);
  };

  return { loading, toggleFavorite, isFavorite, favoritesList };
};