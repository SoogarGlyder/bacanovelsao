import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

const seriesTabs = [
  { id: 'main', name: 'Main' },
  { id: 'progressive', name: 'Progressive' },
  { id: 'ggo', name: 'Gun Gale Online' },
  { id: 'clover', name: "Clover's Regret" },
  { id: 'anthology', name: 'Anthology' },
  { id: 'gourmet', name: 'Gourmet Seekers' },
  { id: 'mystery', name: 'Mystery Labyrinth' },
];

function NovelList({ activeSerie, onNovelClick, navigate }) {
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchNovels = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/novels?serie=${activeSerie}`);
        if (!response.ok) throw new Error('Gagal mengambil data novel');
        const data = await response.json();
        setNovels(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNovels();
  }, [activeSerie]);

  const handleNovelClick = async (novelId, novelSlug) => {
    try {
      const response = await fetch(`/api/novels/find-first-chapter/${novelId}`);
      if (!response.ok) {
        throw new Error('Tidak bisa menemukan chapter pertama.');
      }
      const data = await response.json();
      onNovelClick(); 
      navigate(`/${novelSlug}/${data.firstChapterSlug}`); 
    } catch (err) {
      console.error(err);
    }
  };

  const renderContent = () => {
    if (loading) return <div>Mengaktifkan server... Mohon tunggu sebentar.</div>;
    if (error) return <div>Error: {error}</div>;
    if (novels.length === 0) return <div>Tidak ada novel yang ditemukan.</div>;
    return (
      <div className={styles.novelGallery}>
        {novels.map((novel) => (
          <div 
            key={novel._id} 
            className={styles.contentCover}
            onClick={() => handleNovelClick(novel._id, novel.novel_slug)} 
            style={{ cursor: 'pointer' }}
          >
            <img 
              src={novel.cover_image || 'https://via.placeholder.com/250x350'} 
              className={styles.contentCoverImg} 
              alt={novel.title} 
            />
            <figcaption className={styles.captionLink}>
              {novel.title}
            </figcaption>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.novelListWrapper}>
      {renderContent()}
    </div>
  );
}

function Header({ activeSerie, isListOpen, dropdownSerie, setDropdownSerie, setIsListOpen }) {
  
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null);
  const [maskStyle, setMaskStyle] = useState({});

  const updateMask = () => {
    const el = navRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const isAtStart = scrollLeft <= 0;
    const isAtEnd = scrollWidth - scrollLeft - clientWidth <= 1;
    let maskImage = '';

    if (window.innerWidth > 1023) {
      maskImage = '';
    } else if (isAtStart) {
      maskImage = 'linear-gradient(to right, black 85%, transparent 100%)';
    } else if (isAtEnd) {
      maskImage = 'linear-gradient(to right, transparent 0%, black 15%)'; 
    } else {
      maskImage = 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)';
    }

    setMaskStyle({
      maskImage: maskImage,
      WebkitMaskImage: maskImage
    });
  };

  useEffect(() => {
    updateMask();
    window.addEventListener('resize', updateMask);
    return () => window.removeEventListener('resize', updateMask);
  }, []);

  useEffect(() => {
    if (location.pathname !== '/') {
      setIsListOpen(false);
    }
  }, [location.pathname]);

  const handleTabClick = (serieId) => {
    if (serieId === activeSerie && isListOpen) {
      setIsListOpen(false);
    } else {
      setDropdownSerie(serieId);
      setIsListOpen(true);
    }
  };

  return (
    <>
      <div className={styles.headerBar}>
        <div className={styles.containerImgHeader}>
            <a href="/" className={styles.imgHeader}>
                <img src="/header-sao.svg"
                     alt="Logo"
                     style={{ height: '100%' }}
                />
            </a>
        </div>
        
        <nav
          className={styles.navContainer}
          ref={navRef}
          onScroll={updateMask}
          style={maskStyle}
          >
          {seriesTabs.map((tab) => {
            const isThisTabActive = activeSerie === tab.id;
            const isOnHomePage = location.pathname === '/';

            let showAsActive = false;

            if (isOnHomePage) {
              showAsActive = isThisTabActive && isListOpen;
            } else {
              showAsActive = isThisTabActive;
            }

            return (
              <div
                key={tab.id}
                className={`${styles.navContent} ${
                  showAsActive ? styles.active : ''
                }`}
                onClick={() => handleTabClick(tab.id)}
              >
                {tab.name}
              </div>
            );
          })}
        </nav>
      </div>

      {isListOpen && (
        <NovelList 
          activeSerie={dropdownSerie}
          onNovelClick={() => setIsListOpen(false)}
          navigate={navigate}
       />
      )}
    </>
  );
}

export default Header;