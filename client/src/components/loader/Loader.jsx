import React from 'react';
import './loader.scss';

const Loader = ({ size = 'md', message = 'Loading...' }) => {
  return (
    <div className="custom-loader-wrapper">
      <div className={`dots-loader ${size}`}>
        <div></div><div></div><div></div>
      </div>
      <span className="loader-message">{message}</span>
    </div>
  );
};

export default Loader;
