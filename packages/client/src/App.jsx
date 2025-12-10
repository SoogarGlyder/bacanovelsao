import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [pageSerie, setPageSerie] = useState(null); 
  const [dropdownSerie, setDropdownSerie] = useState(null); 
  const [isListOpen, setIsListOpen] = useState(false);

  useEffect(() => {
    if (isListOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isListOpen]);

  const activeSerie = isListOpen ? dropdownSerie : pageSerie;

  return (
    <>
      <Header 
        activeSerie={activeSerie}
        isListOpen={isListOpen}
        setDropdownSerie={setDropdownSerie}
        setIsListOpen={setIsListOpen}
        dropdownSerie={dropdownSerie}
      />
      
      <main style={{ marginTop: 'var(--total-header-height)', minHeight: 'calc(100vh - var(--total-header-height)' }}>
        <Outlet context={{ setPageSerie, setDropdownSerie, setIsListOpen, isListOpen, activeSerie }} />
      </main>

      <Footer />
    </>
  );
}
export default App;