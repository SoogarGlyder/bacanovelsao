import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

function HomePage() {
  const { setPageSerie, setDropdownSerie, setIsListOpen, isListOpen } = useOutletContext();

  useEffect(() => {
    setPageSerie('main');       
    setDropdownSerie('main');
    setIsListOpen(true);
  }, []);
  
  const textStyle = {
    display: isListOpen ? 'none' : 'block'
  };

  return (
    <div className="container">
      <h1 style={textStyle}>Selamat Datang</h1>
      <h3 style={textStyle}>Silakan pilih seri novel dari navigasi di atas.</h3>
    </div>
  );
}
export default HomePage;