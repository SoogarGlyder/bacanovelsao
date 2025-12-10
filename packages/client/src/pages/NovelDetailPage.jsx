import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useOutletContext } from 'react-router-dom';
import DOMPurify from 'dompurify';
import styles from './NovelDetailPage.module.css';
import { useNovelDetail } from '../hooks/useNovelData.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import SEO from '../components/SEO.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import Breadcrumbs from '../components/Breadcrumbs';
import { getReadingHistory } from '../utils/readingHistory';

function NovelDetailPage() {
  const { novelSlug } = useParams();
  const navigate = useNavigate();
  const { setPageSerie, setDropdownSerie, setIsListOpen } = useOutletContext();
  const [isListVisible, setIsListVisible] = useState(window.innerWidth > 767);
  
  const {
    novel,
    chapters: allChapters,
    loading,
    error
  } = useNovelDetail(novelSlug);

  const [lastRead, setLastRead] = useState(null);
  
  const handleLinkClick = () => {
    if (window.innerWidth <= 767) {
      setIsListVisible(false);
    }
  };

  const createNewChapterUrl = (targetChapterSlug) => {
      return `/${novelSlug}/${targetChapterSlug}`; 
  };

  const firstChapterSlug = allChapters.length > 0 ? allChapters[0].chapter_slug : null;
  
  const currentUrl = window.location.href;
  
  useEffect(() => {
    if (novel) {
        setPageSerie(novel.serie);
        setDropdownSerie(novel.serie);
    }
    setIsListOpen(false);
    window.scrollTo(0, 0);
  }, [novel, setPageSerie, setDropdownSerie, setIsListOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 767) {
        setIsListVisible(true);
      } else {
        setIsListVisible(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (novelSlug) {
      const historyData = getReadingHistory(novelSlug);
      setLastRead(historyData);
    }
  }, [novelSlug]);

  if (loading) {
    return <LoadingSpinner/>;
  }
  if (error) {
      if (error.includes('tidak ditemukan') || error.includes('404')) {
          return <NotFoundPage />;
      }
      return <div style={{ padding: '20px', textAlign: 'center' }}>Error: {error}</div>;
  }
  if (!novel) {
      return <NotFoundPage />;
  }

  return (
    <div className={styles.holyGrailLayout}>
      {novel && (
        <SEO 
          key={novelSlug}
          title={`${novel.title} (${novel.serie})`}
          description={novel.synopsis}
          image={novel.cover_image}
          url={currentUrl}
        />
      )}
      <aside className={styles.leftSidebar}>
        <button
          className={styles.mobileToggle}
          onClick={() => setIsListVisible(!isListVisible)}>Daftar Chapter {isListVisible ? '▴' : '▾'}
        </button>
        <h2 className={styles.leftSidebarTitle}>Daftar Chapter</h2>
        {isListVisible && (
          <ul className={styles.chapterList}>
            <li>
              <Link 
                to={`/${novelSlug}`} 
                className={`${styles.chapterLink} ${styles.activeChapter}`} 
                onClick={handleLinkClick}
              >
              Sinopsis
              </Link>
            </li>
            {allChapters.map((chapterItem) => (
              <li key={chapterItem._id}>
                <Link 
                  to={createNewChapterUrl(chapterItem.chapter_slug)}
                  className={styles.chapterLink}
                  onClick={handleLinkClick}>
                  {chapterItem.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </aside>

      <main className={styles.mainContent}>
        <Breadcrumbs 
          items={[
            { label: novel.title, link: `/${novelSlug}` }, 
            { label: `Sinopsis`, link: null } 
          ]} 
        />
        <div className={styles.chapterHeader}>
          <h1>{novel.title}</h1>
          <h2>Sinopsis</h2>
        </div>
        <hr className={styles.divider} />
        <div className={styles.content}>
          {(novel.synopsis || '<p>Belum ada sinopsis.</p>').split('\n').map((paragraph, index) => {
            const cleanedHtml = DOMPurify.sanitize(paragraph);
              if (!cleanedHtml.trim()) {
               return null;
              }
              return (
                <p 
                  key={index}
                  dangerouslySetInnerHTML={{ __html: cleanedHtml }}
                />
              );
          })}
        </div>
        <div className={styles.navigation}>
          {lastRead && (
            <div className={styles.lastRead}>
              <div>
                <span style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginRight: '20px' }}>
                  Terakhir dibaca:
                </span>
                <strong style={{ color: '#333' }}>
                  {lastRead.chapterTitle}
                </strong>
              </div>
              <Link to={`/${novelSlug}/${lastRead.chapterSlug}`}>
                Lanjut Baca »
              </Link>
            </div>
          )}
          <button 
            onClick={() => navigate(createNewChapterUrl(firstChapterSlug))}
            disabled={!firstChapterSlug}
          >
            Chapter Pertama &raquo;
          </button>
        </div>
      </main>

      <aside className={styles.rightSidebar}>
        <h3>Dukung Kami Yuk!</h3>
        <a href="https://saweria.co/SoogarGlyder" target="_blank" rel="noreferrer">
          <img src="/saweria.png" alt="QR Code Saweria" width="200"></img>
        </a>
      </aside>

    </div>
  );
}

export default NovelDetailPage;