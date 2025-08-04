import { useState, useEffect } from 'react';

/**
 * Hook pour gérer les états de loading avec des délais minimum
 * Évite les flickers en s'assurant que le loading dure au moins un certain temps
 */
export const useLoadingState = (initialLoading = true, minLoadingTime = 500) => {
  const [loading, setLoading] = useState(initialLoading);
  const [startTime, setStartTime] = useState(Date.now());

  const setLoadingWithDelay = async (isLoading) => {
    if (isLoading) {
      setStartTime(Date.now());
      setLoading(true);
    } else {
      const elapsed = Date.now() - startTime;
      const remaining = minLoadingTime - elapsed;

      if (remaining > 0) {
        // Attendre le temps minimum avant de masquer le loading
        setTimeout(() => {
          setLoading(false);
        }, remaining);
      } else {
        setLoading(false);
      }
    }
  };

  return [loading, setLoadingWithDelay];
};

/**
 * Hook pour simuler un appel API avec loading
 */
export const useAsyncOperation = (operation, dependencies = []) => {
  const [loading, setLoading] = useLoadingState(true, 800);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const executeOperation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await operation();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeOperation();
  }, dependencies);

  return { loading, data, error, refetch: executeOperation };
};

export default useLoadingState; 