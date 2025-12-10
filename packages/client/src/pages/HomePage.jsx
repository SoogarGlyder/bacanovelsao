import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import SEO from '../components/SEO';

function HomePage() {
  const { setPageSerie, setDropdownSerie, setIsListOpen, isListOpen } = useOutletContext();

  useEffect(() => {
    setPageSerie('main');       
    setDropdownSerie('main');
    setIsListOpen(true);
  }, []);
  
  return (
    <div className="container">
      <SEO 
        title="Beranda"
        description="Baca Novel Seri Sword Art Online (SAO) lengkap Bahasa Indonesia, mulai dari Aincrad, Progressive, Gun Gale Online, dan seri lainnya."
        keywords="novel sao, sword art online, aincrad, progressive, light novel, baca online, ggo, novel fantasi"
      />
      {!isListOpen && (
        <>
          <h1>Selamat Datang</h1>
          <h3>Silakan pilih seri novel dari navigasi di atas.</h3>
        </>
      )}
    </div>
  );
}

export default HomePage;