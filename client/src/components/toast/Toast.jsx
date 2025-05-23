import { useEffect } from 'react';
import './Toast.scss';

const Toast = ({ id, message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000); // auto dismiss after 3 sec
    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div className={`toast ${type}`}>
      <span>{message}</span>
    </div>
  );
};

export default Toast;
