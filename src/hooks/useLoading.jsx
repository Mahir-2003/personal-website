import { createContext, useContext, useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import LoadingScreen from '../components/LoadingScreen';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const [currentPath, setCurrentPath] = useState(location.pathname);
    // Ref instead of state: won't trigger nav effect when it flips to false
    const isInitialLoadRef = useRef(true);

    // Initial load
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
            isInitialLoadRef.current = false;
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Fire synchronously before browser paint so loading screen blocks the new
    // route from ever being visible, even on slow mobile devices.
    useLayoutEffect(() => {
        if (isInitialLoadRef.current) return;
        window.scrollTo(0, 0);
        setIsLoading(true);
        setCurrentPath(location.pathname);
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, [location.pathname]);

    const value = { isLoading, currentPath };

    return (
        <LoadingContext.Provider value={value}>
            <LoadingScreen isLoading={isLoading} currentPage={currentPath} />
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};
