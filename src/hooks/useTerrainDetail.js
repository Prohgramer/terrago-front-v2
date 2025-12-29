import { useState, useEffect } from 'react';

// Definir la URL base de la API
const API_BASE_URL = 'http://localhost:5000'; // Ajusta esto según tu configuración

export const useTerrainDetail = (id) => {
  const [terrain, setTerrain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cercanias, setCercanias] = useState(null);

  useEffect(() => {
    const fetchTerrain = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/resultados/${id}`);
        if (!response.ok) throw new Error('No se pudo obtener el terreno');
        const data = await response.json();
        console.log('Terrain data fetched:', data);
        setTerrain(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching terrain:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTerrain();
  }, [id]);

  return { terrain, loading, error };
};
