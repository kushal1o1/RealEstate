import React, { useEffect } from 'react';
import './about.scss';
import { useToast } from '../../context/ToastContext.jsx';

const About = () => {
  const { showToast } = useToast();
  useEffect(() => {
    showToast('Welcome to the About Page!', 'info');
  }, [showToast]);
  return (
    <div>
  
        About Page
    </div>
  );
};

export default About;