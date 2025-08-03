import React from 'react';
import { useRole } from '../context/RoleContext';
import { ServerRoleGuard, useServerRoleVerification } from '../services/api/modules/auth/roleVerificationService';

/**
 * Exemple d'utilisation de la vérification des rôles côté frontend
 */

// 1. Utilisation basique avec useRole (vérification côté client)
export const BasicRoleExample = () => {
  const { userRole, loading, hasPermission, canAccess } = useRole();

  if (loading) {
    return <div>Chargement des permissions...</div>;
  }

  return (
    <div>
      <h3>Rôle actuel: {userRole}</h3>
      
      <div>
        <h4>Permissions:</h4>
        <ul>
          <li>Peut voir les propriétés: {hasPermission('view_properties') ? '✅' : '❌'}</li>
          <li>Peut acheter des parts: {hasPermission('buy_shares') ? '✅' : '❌'}</li>
          <li>Peut gérer les propriétés: {hasPermission('manage_properties') ? '✅' : '❌'}</li>
        </ul>
      </div>

      <div>
        <h4>Accès aux sections:</h4>
        <ul>
          <li>Marketplace: {canAccess('market-place') ? '✅' : '❌'}</li>
          <li>Analytics: {canAccess('analytics') ? '✅' : '❌'}</li>
          <li>Settings: {canAccess('settings') ? '✅' : '❌'}</li>
        </ul>
      </div>
    </div>
  );
};

// 2. Protection de route avec ServerRoleGuard (vérification côté serveur)
export const ProtectedRouteExample = () => {
  return (
    <ServerRoleGuard 
      allowedRoles={['PROFESSIONAL', 'ADMIN']}
      fallback={
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h3>🔒 Accès restreint</h3>
          <p>Cette page est réservée aux professionnels et administrateurs.</p>
          <p>Contactez votre administrateur pour obtenir les permissions nécessaires.</p>
        </div>
      }
    >
      <div>
        <h3>🎯 Page Analytics (Professionnels/Admins uniquement)</h3>
        <p>Contenu réservé aux professionnels et administrateurs...</p>
        
        {/* Contenu spécifique aux professionnels */}
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5' }}>
          <h4>📊 Statistiques avancées</h4>
          <p>Ces données ne sont visibles que par les professionnels et administrateurs.</p>
        </div>
      </div>
    </ServerRoleGuard>
  );
};

// 3. Utilisation du hook useServerRoleVerification
export const ServerVerificationExample = () => {
  const { loading, userData, error, verifyRoles } = useServerRoleVerification();

  const handleRefresh = async () => {
    try {
      await verifyRoles();
      alert('Rôles vérifiés avec succès !');
    } catch (err) {
      alert('Erreur lors de la vérification des rôles');
    }
  };

  if (loading) {
    return <div>Vérification des rôles en cours...</div>;
  }

  if (error) {
    return (
      <div>
        <h3>❌ Erreur de vérification</h3>
        <p>{error.message}</p>
        <button onClick={handleRefresh}>Réessayer</button>
      </div>
    );
  }

  return (
    <div>
      <h3>✅ Vérification serveur réussie</h3>
      
      {userData && userData.user && (
        <div>
          <h4>Informations utilisateur:</h4>
          <ul>
            <li><strong>Rôle:</strong> {userData.user.role}</li>
            <li><strong>Email:</strong> {userData.user.email}</li>
            <li><strong>Source du rôle:</strong> {userData.user.roleSource}</li>
            <li><strong>Groupes Cognito:</strong> {userData.user.cognitoGroups?.join(', ') || 'Aucun'}</li>
          </ul>

          <h4>Permissions:</h4>
          <ul>
            {userData.user.permissions && Object.entries(userData.user.permissions).map(([permission, hasAccess]) => (
              <li key={permission}>
                {permission}: {hasAccess ? '✅' : '❌'}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={handleRefresh} style={{ marginTop: '20px' }}>
        🔄 Rafraîchir la vérification
      </button>
    </div>
  );
};

// 4. Exemple de protection conditionnelle
export const ConditionalAccessExample = () => {
  const { userRole, hasPermission } = useRole();

  return (
    <div>
      <h3>🔐 Accès conditionnel</h3>
      
      {/* Section visible par tous */}
      <div style={{ marginBottom: '20px' }}>
        <h4>📋 Informations générales</h4>
        <p>Cette section est visible par tous les utilisateurs.</p>
      </div>

      {/* Section visible uniquement par les investisseurs */}
      {userRole === 'INVESTOR' && (
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#e3f2fd' }}>
          <h4>💰 Section Investisseur</h4>
          <p>Contenu spécifique aux investisseurs...</p>
        </div>
      )}

      {/* Section visible uniquement par les professionnels */}
      {userRole === 'PROFESSIONAL' && (
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f3e5f5' }}>
          <h4>🏢 Section Professionnel</h4>
          <p>Contenu spécifique aux professionnels...</p>
        </div>
      )}

      {/* Section visible uniquement par les admins */}
      {userRole === 'ADMIN' && (
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#fff3e0' }}>
          <h4>👑 Section Administrateur</h4>
          <p>Contenu spécifique aux administrateurs...</p>
        </div>
      )}

      {/* Section basée sur les permissions */}
      {hasPermission('manage_properties') && (
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#e8f5e8' }}>
          <h4>⚙️ Gestion des propriétés</h4>
          <p>Cette section n'est visible que par les utilisateurs ayant la permission de gérer les propriétés.</p>
        </div>
      )}
    </div>
  );
};

// 5. Exemple de navigation basée sur les rôles
export const RoleBasedNavigation = () => {
  const { userRole, getDefaultDashboard } = useRole();

  const navigationItems = {
    INVESTOR: [
      { label: 'Marketplace', path: '/dashboards/market-place' },
      { label: 'Mon Portfolio', path: '/dashboards/portfolio' },
      { label: 'Mes Investissements', path: '/dashboards/investments' }
    ],
    PROFESSIONAL: [
      { label: 'Gestion Propriétés', path: '/dashboards/properties' },
      { label: 'Clients', path: '/dashboards/clients' },
      { label: 'Marketplace', path: '/dashboards/market-place' }
    ],
    ADMIN: [
      { label: 'Gestion Utilisateurs', path: '/dashboards/users' },
      { label: 'Paramètres', path: '/dashboards/settings' },
      { label: 'Marketplace', path: '/dashboards/market-place' }
    ]
  };

  const currentItems = navigationItems[userRole] || navigationItems.INVESTOR;

  return (
    <div>
      <h3>🧭 Navigation basée sur les rôles</h3>
      <p>Rôle actuel: <strong>{userRole}</strong></p>
      
      <div style={{ marginTop: '15px' }}>
        <h4>Liens de navigation:</h4>
        <ul>
          {currentItems.map((item, index) => (
            <li key={index}>
              <a href={item.path} style={{ textDecoration: 'none', color: '#1976d2' }}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: '15px' }}>
        <p>Dashboard par défaut: <strong>{getDefaultDashboard()}</strong></p>
      </div>
    </div>
  );
};

export default {
  BasicRoleExample,
  ProtectedRouteExample,
  ServerVerificationExample,
  ConditionalAccessExample,
  RoleBasedNavigation
}; 