import { getStoredUserRole } from './cognitoUtils';

/**
 * Vérifie si un utilisateur peut accéder à une route basée sur ses rôles
 * @param {Array} allowedRoles - Les rôles autorisés pour cette route
 * @param {string} userRole - Le rôle de l'utilisateur
 * @returns {boolean} True si l'utilisateur peut accéder à la route
 */
export const canAccessRoute = (allowedRoles, userRole) => {
  // Si aucun rôle n'est spécifié, tout le monde peut accéder
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  // Si l'utilisateur n'a pas de rôle, refuser l'accès
  if (!userRole) {
    return false;
  }

  // Vérifier si le rôle de l'utilisateur est dans la liste des rôles autorisés
  return allowedRoles.includes(userRole);
};

/**
 * Filtre les routes en fonction du rôle de l'utilisateur
 * @param {Array} routes - La liste des routes
 * @param {string} userRole - Le rôle de l'utilisateur
 * @returns {Array} Les routes filtrées
 */
export const filterRoutesByRole = (routes, userRole) => {
  if (!routes || !Array.isArray(routes)) {
    return [];
  }

  return routes.map(route => {
    // Si la route a des rôles autorisés, vérifier l'accès
    if (route.allowedRoles) {
      if (!canAccessRoute(route.allowedRoles, userRole)) {
        return null; // Exclure cette route
      }
    }

    // Si la route a des sous-routes (collapse), les filtrer aussi
    if (route.collapse && Array.isArray(route.collapse)) {
      const filteredCollapse = route.collapse
        .map(subRoute => {
          if (subRoute.allowedRoles) {
            if (!canAccessRoute(subRoute.allowedRoles, userRole)) {
              return null; // Exclure cette sous-route
            }
          }
          return subRoute;
        })
        .filter(Boolean); // Supprimer les routes null

      // Si toutes les sous-routes sont exclues, exclure la route parent
      if (filteredCollapse.length === 0) {
        return null;
      }

      return {
        ...route,
        collapse: filteredCollapse
      };
    }

    return route;
  }).filter(Boolean); // Supprimer les routes null
};

/**
 * Filtre automatiquement les routes en utilisant le rôle stocké
 * @param {Array} routes - La liste des routes
 * @returns {Array} Les routes filtrées
 */
export const filterRoutesByStoredRole = (routes) => {
  const userRole = getStoredUserRole();
  return filterRoutesByRole(routes, userRole);
};

/**
 * Vérifie si une route spécifique est accessible
 * @param {string} routeKey - La clé de la route
 * @param {Array} routes - La liste des routes
 * @param {string} userRole - Le rôle de l'utilisateur
 * @returns {boolean} True si la route est accessible
 */
export const isRouteAccessible = (routeKey, routes, userRole) => {
  const findRoute = (routeList, key) => {
    for (const route of routeList) {
      if (route.key === key) {
        return route;
      }
      if (route.collapse) {
        const found = findRoute(route.collapse, key);
        if (found) return found;
      }
    }
    return null;
  };

  const route = findRoute(routes, routeKey);
  if (!route) return false;

  return canAccessRoute(route.allowedRoles, userRole);
};

/**
 * Obtient toutes les routes accessibles pour un rôle donné
 * @param {Array} routes - La liste des routes
 * @param {string} userRole - Le rôle de l'utilisateur
 * @returns {Array} Les routes accessibles
 */
export const getAccessibleRoutes = (routes, userRole) => {
  return filterRoutesByRole(routes, userRole);
}; 