import React from 'react';

function LoadingSpinner({ message = '' }) {
  return (
    <div className="loadingContainer">
      <div className="spinner"></div>
      <p style={{ marginLeft: '15px', color: '#555' }}>{message}</p>
    </div>
  );
}

export default LoadingSpinner;