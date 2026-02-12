import { useState } from 'react';

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar el perfil');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading, error };
};