import React, { useEffect, useState } from 'react';

const ReadingProgressBar = () => {
  const [width, setWidth] = useState(0);

  const scrollHeight = () => {
    const el = document.documentElement;
    const ScrollTop = el.scrollTop || document.body.scrollTop;
    const ScrollHeight = el.scrollHeight || document.body.scrollHeight;
    
    const percent = (ScrollTop / (ScrollHeight - el.clientHeight)) * 100;
    setWidth(percent);
  };

  useEffect(() => {
    window.addEventListener('scroll', scrollHeight);
    return () => window.removeEventListener('scroll', scrollHeight);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 'var(--total-header-height)',
      left: 0,
      width: `${width}%`,
      height: '4px',
      backgroundColor: '#38b6ff',
      zIndex: 9999,
      transition: 'width 0.1s ease-out'
    }} />
  );
};

export default ReadingProgressBar;