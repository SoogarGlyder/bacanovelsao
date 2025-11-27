import { useCallback } from 'react';

const ADMIN_API_KEY = import.meta.env.VITE_ADMIN_API_KEY; 

export const useAdminFetcher = () => {

    const authenticatedFetch = useCallback(async (url, options = {}) => {
        
        if (!ADMIN_API_KEY) {
            throw new Error("ADMIN_API_KEY tidak terdefinisi di lingkungan frontend.");
        }

        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ADMIN_API_KEY}`,
        };

        const response = await fetch(url, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `API Error: ${response.status}`);
        }

        return data;

    }, []);

    return authenticatedFetch;
};