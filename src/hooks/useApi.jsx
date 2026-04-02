import { useState, useEffect, useCallback } from 'react';

export const useApi = (apiFunction, dependencies = [], condition = true) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        if (!condition) return;
        setLoading(true);
        setError(null);

        try {
            const result = await apiFunction();
            setData(result);
        } catch (err) {
            setError(err);
            console.error("API Error:", err);
        } finally {
            setLoading(false);
        }
    }, [apiFunction, condition, ...dependencies]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refresh: fetchData };
};