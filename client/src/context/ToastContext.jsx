import { useState, createContext, useContext, useCallback } from 'react';
import Toast from '../components/toast/Toast';
// import './Toast.scss';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

let counter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = counter++;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(({ id, message, type }) => (
          <Toast key={id} id={id} message={message} type={type} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
