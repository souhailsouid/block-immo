import { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    open: false,
    title: '',
    content: '',
    type: '', // 'success', 'error', 'warning', 'info'
    duration: 3000,
    position: 'top-right',
    autoHide: true
  });

  const showNotification = (title, content, type = 'success', options = {}) => {
    const {
      duration = 3000,
      position = 'top-right',
      autoHide = true
    } = options;

    setNotification({
      open: true,
      title,
      content,
      type,
      duration,
      position,
      autoHide
    });

    // Auto-hide si activé
    if (autoHide && duration > 0) {
      setTimeout(() => {
        hideNotification();
      }, duration);
    }
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <NotificationContext.Provider value={{
      notification,
      showNotification,
      hideNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};