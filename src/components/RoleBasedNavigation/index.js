import React from 'react';
import { useRole } from '../../context/RoleContext';

/**
 * Composant pour filtrer les routes selon les rôles utilisateur
 * Cache les sections et routes non autorisées pour l'utilisateur
 */
const RoleBasedNavigation = ({ routes, children }) => {
  const { userRole, loading } = useRole();

  // Fonction pour vérifier si un utilisateur peut accéder à une route
  const canAccessRoute = (route) => {
    // Si pas de restriction de rôle, accessible à tous
    if (!route.allowedRoles) {
      return true;
    }

    // Si l'utilisateur n'est pas connecté, pas d'accès
    if (!userRole) {
      return false;
    }

    // Vérifier si le rôle de l'utilisateur est dans les rôles autorisés
    return route.allowedRoles.includes(userRole);
  };

  // Fonction pour filtrer les routes récursivement
  const filterRoutesByRole = (routesList) => {
    return routesList
      .filter(route => {
        // Vérifier l'accès à la route principale
        if (!canAccessRoute(route)) {
          return false;
        }

        // Si c'est un collapse, vérifier les sous-routes
        if (route.collapse) {
          const filteredCollapse = filterRoutesByRole(route.collapse);
          // Garder la route seulement si elle a des sous-routes accessibles
          return filteredCollapse.length > 0;
        }

        return true;
      })
      .map(route => {
        // Si c'est un collapse, filtrer les sous-routes
        if (route.collapse) {
          return {
            ...route,
            collapse: filterRoutesByRole(route.collapse)
          };
        }
        return route;
      });
  };

  // Si en cours de chargement, afficher un placeholder
  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Chargement de la navigation...</div>
      </div>
    );
  }

  // Filtrer les routes selon le rôle
  const filteredRoutes = filterRoutesByRole(routes);

  // Passer les routes filtrées aux enfants
  return children(filteredRoutes);
};

export default RoleBasedNavigation; 