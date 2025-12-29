import { useState } from 'react';

const useSearchFilter = () => {
    const [terrains, setTerrains] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [count, setCount] = useState(0);

    // ahora acepta page y perPage
    const searchTerrains = async (filters, perPage = 20, page = 1) => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('authToken');
            const res = await fetch(`http://localhost:5000/api/terrains/search?page=${page}&per_page=${perPage}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify({ filters }),
            });

            const data = await res.json();

            if (!res.ok) {
                const message = data?.error || 'Error searching terrains';
                setError(message);
                return { success: false, error: message };
            }

            // Nueva estructura: { total, total_pages, page, per_page, results_count, results }
            const results = data.results || data.data || [];
            const total = data.total ?? data.total_items ?? data.count ?? 0;
            const totalPages = data.total_pages ?? Math.max(1, Math.ceil(total / perPage));

            setTerrains(results);
            setCount(total);

            return {
                success: true,
                data: results,
                count: total,
                meta: {
                    page: data.page ?? page,
                    per_page: data.per_page ?? perPage,
                    total,
                    total_pages: totalPages,
                    results_count: data.results_count ?? results.length
                }
            };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    return {
        terrains,
        loading,
        error,
        count,
        searchTerrains,
    };
};

export default useSearchFilter;