import { useState, useEffect, useCallback } from 'react';
import { getProperties } from 'services/api';

/**
 * Hook personnalisé pour gérer le fetch des propriétés
 * @param {Object} options - Options de configuration
 * @param {Object} options.filters - Filtres pour la recherche
 * @param {Object} options.pagination - Paramètres de pagination
 * @param {boolean} options.autoFetch - Si true, fetch automatique au montage
 * @returns {Object} État et fonctions pour gérer les propriétés
 */
export const useProperties = (options = {}) => {
  const {
    filters = {},
    pagination = { page: 1, limit: 20 },
    autoFetch = true
  } = options;

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Fonction pour récupérer les propriétés
  const fetchProperties = useCallback(async (customFilters = {}, customPagination = {}) => {
    try {
      setLoading(true);
      setError(null);

      const result = await getProperties(
        { ...filters, ...customFilters },
        { ...pagination, ...customPagination }
      );

      // Traiter les résultats
      const newProperties = result.items || result || [];
      const currentPage = customPagination.page || pagination.page;
      
      if (currentPage === 1) {
        // Première page, remplacer toutes les propriétés
        setProperties(newProperties);
      } else {
        // Pages suivantes, ajouter aux propriétés existantes
        setProperties(prev => [...prev, ...newProperties]);
      }

      // Mettre à jour les métadonnées
      setTotalCount(result.totalCount || newProperties.length);
      setHasMore(newProperties.length === (customPagination.limit || pagination.limit));

    } catch (err) {
      setError(err.message || 'Erreur lors de la récupération des propriétés');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination]);

  // Fonction pour recharger les propriétés
  const refetch = useCallback(() => {
    return fetchProperties({}, { page: 1 });
  }, [fetchProperties]);

  // Fonction pour charger la page suivante
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = Math.ceil(properties.length / pagination.limit) + 1;
      return fetchProperties({}, { page: nextPage });
    }
  }, [loading, hasMore, properties.length, pagination.limit, fetchProperties]);

  // Fonction pour filtrer les propriétés
  const filterProperties = useCallback((newFilters) => {
    return fetchProperties(newFilters, { page: 1 });
  }, [fetchProperties]);

  // Fetch automatique au montage si activé
  useEffect(() => {
    if (autoFetch) {
      fetchProperties();
    }
  }, [autoFetch]);

  return {
    // État
    properties,
    loading,
    error,
    totalCount,
    hasMore,
    
    // Actions
    fetchProperties,
    refetch,
    loadMore,
    filterProperties,
    
    // Utilitaires
    isEmpty: properties.length === 0 && !loading,
    isError: !!error,
  };
}; 