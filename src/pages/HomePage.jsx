import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

function HomePage() {
  const { setPageSerie, setDropdownSerie, setIsListOpen } = useOutletContext();

  useEffect(() => {
    setPageSerie('main');
    setDropdownSerie('main');
    setIsListOpen(true);
  }, []);

  return (
    <div className="container">
      <h1>Selamat Datang</h1>
      <h3>Silakan pilih seri novel dari navigasi di atas.</h3>
    </div>
  );
}
export default HomePage;