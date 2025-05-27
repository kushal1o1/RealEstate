import React, { useState, useEffect } from 'react';
import { X, Moon, Sun } from 'lucide-react';
import './settings.scss';

const Settings = ({ isOpen, onClose }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('adminTheme');
    return savedTheme || 'light';
  });

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('adminTheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  if (!isOpen) return null;

  return (
    <div className="settings-modal">
      <div className="settings-modal__overlay" onClick={onClose} />
      <div className="settings-modal__content">
        <div className="settings-modal__header">
          <h2>Settings</h2>
          <button className="settings-modal__close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="settings-modal__body">
          <div className="settings-item">
            <div className="settings-item__label">
              <span>Theme</span>
              <p className="settings-item__description">Choose your preferred theme</p>
            </div>
            <button 
              className={`theme-toggle ${theme === 'dark' ? 'active' : ''}`}
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              <span>{theme === 'light' ? 'Dark' : 'Light'} Mode</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 