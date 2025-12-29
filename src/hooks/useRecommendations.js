import { useEffect, useState } from "react";

export const useRecommendations = (userId) => {
  const [data, setData] = useState({ recommendations: [], loading: true, error: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/recommendations/`);
        const result = await res.json();
        setData({
          recommendations: result.recommendations || [],
          loading: false,
          error: result.success ? null : result.error,
        });
      } catch (err) {
        setData({ recommendations: [], loading: false, error: "Error al conectar" });
      }
    };
    fetchData();
  }, [userId]);

  return data;
};
