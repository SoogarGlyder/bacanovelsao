import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useOutletContext } from 'react-router-dom';
import DOMPurify from 'dompurify';
import styles from './ChapterReadPage.module.css';
import { useChapterData, useNovelList } from '../hooks/useNovelData.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import SEO from '../components/SEO.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import Breadcrumbs from '../components/Breadcrumbs';
import { saveReadingHistory } from '../utils/readingHistory';
import ReadingProgressBar from '../components/ReadingProgressBar';

function ChapterReadPage() {
  const { novelSlug, chapterSlug } = useParams();
  const navigate = useNavigate();
  const { setPageSerie } = useOutletContext();
  const [isListVisible, setIsListVisible] = useState(window.innerWidth > 767);

  const {
    chapter, 
    loading, 
    error, 
    prevChapterSlug, 
    nextChapterSlug, 
    allChapters
  } = useChapterData(novelSlug, chapterSlug, setPageSerie);

  const handleChapterClick = () => {
    if (window.innerWidth <= 767) {
      setIsListVisible(false);
    }
  };

  const createNewChapterUrl = (targetChapterSlug) => {
    return `/${novelSlug}/${targetChapterSlug}`; 
  };
 
  const currentSerie = chapter?.novel?.serie;
  const { novels: serieNovels } = useNovelList(currentSerie);
  const currentUrl = window.location.href;

  const calculateReadingTime = (textHtml) => {
    if (!textHtml) return 0;
    const text = textHtml.replace(/<[^>]*>/g, '');
    const wordCount = text.split(/\s+/).length;
    const readingSpeed = 200;
    return Math.ceil(wordCount / readingSpeed);
  };

  const readingTime = chapter ? calculateReadingTime(chapter.content) : 0;

  const [fontSize, setFontSize] = useState(18);

  const changeFontSize = (delta) => {
    setFontSize(prev => {
      const newSize = prev + delta;
      if (newSize < 14) return 14;
      if (newSize > 24) return 24;
      return newSize;
    });
  };

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
    if (chapter && chapter.novel) {
      saveReadingHistory(
        chapter.novel.novel_slug,
        chapter.chapter_slug,
        chapter.title,
        chapter.chapter_number
      );
    }
  }, [chapter]);

  // useEffect(() => {
  //   if (chapter) { 
  //       try {
  //           if (window.adsbygoogle) {
  //               (window.adsbygoogle = window.adsbygoogle || []).push({});
  //           }
  //       } catch (e) {
  //           console.error("AdSense execution failed:", e);
  //       }
  //   }
  // }, [chapter]);


  if (loading) {
      return <LoadingSpinner/>;
  }
  if (error) {
      if (error.includes('tidak ditemukan') || error.includes('not found') || error.includes('404')) {
          return <NotFoundPage />;
      }
      return <div style={{ padding: '20px', textAlign: 'center' }}>Terjadi Kesalahan: {error}</div>;
  }

  return (
    <div className={styles.holyGrailLayout}>
      <ReadingProgressBar />
      {chapter && (
        <SEO 
          key={chapterSlug}
          title={`${chapter.title} | ${chapter.novel.title}`}
          description={chapter.content ? chapter.content.substring(0, 200) : ''}
          image={chapter.novel.cover_image}
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
                  className={styles.chapterLink}
                  onClick={handleChapterClick}
                >
                Sinopsis
                </Link>
              </li>
              {allChapters.map((chapterItem) => (
                <li key={chapterItem._id}>
                  <Link 
                    to={createNewChapterUrl(chapterItem.chapter_slug)}
                    className={`${styles.chapterLink} ${
                    chapterItem.chapter_slug === chapterSlug ? styles.activeChapter : ''}`}
                    onClick={handleChapterClick}>
                    {chapterItem.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
      </aside>

      <main className={styles.mainContent}>
        {chapter && (
          <>
            <Breadcrumbs 
              items={[
                { label: chapter.novel.title, link: `/${novelSlug}` }, 
                { label: `${chapter.title}`, link: null } 
              ]} 
            />
            <div className={styles.chapterHeader}>
              <h1>{chapter.novel.title}</h1>
              <h2>{chapter.title}</h2>
                <span style={{ 
                  fontSize: '0.9rem', 
                  color: '#888', 
                  marginTop: '5px', 
                }}>
                  Estimasi waktu baca: {readingTime} menit
                </span>
            </div>
            <hr className={styles.divider} />
            <div className={styles.content}
              style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}
            >
              {(chapter.content || '').split('\n').map((paragraph, index) => {
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
              <button 
                onClick={() => {
                  if (prevChapterSlug) {
                    navigate(createNewChapterUrl(prevChapterSlug));
                  } else {
                      navigate(`/${novelSlug}`);
                  }
                }}
              >
                {prevChapterSlug ? '« Chapter Sebelumnya' : '« Sinopsis'}
              </button>
              <button 
                onClick={() => {
                  if (nextChapterSlug) {
                    navigate(createNewChapterUrl(nextChapterSlug));
                  } else {
                    if (serieNovels && serieNovels.length > 0) {
                      const currentIndex = serieNovels.findIndex(n => n.novel_slug === novelSlug);  
                      if (currentIndex !== -1 && currentIndex < serieNovels.length - 1) {
                        const nextNovel = serieNovels[currentIndex + 1];
                        navigate(`/${nextNovel.novel_slug}`);
                      } else {
                        navigate('/');
                      }
                    } else {
                      navigate('/');
                    }
                  }
                }}
              >
                {nextChapterSlug 
                  ? 'Chapter Selanjutnya »' 
                  : (serieNovels.findIndex(n => n.novel_slug === novelSlug) < serieNovels.length - 1 
                    ? 'Novel Selanjutnya »' 
                    : 'Ke Beranda »')
                }
              </button>
            </div>
            <div className={styles.disclaimer}>
              <p>
                <strong>Disclaimer:</strong> Kami tidak berafiliasi dengan Reki Kawahara, ASCII Media Works, atau 
                pemegang lisensi resmi lainnya. Ini adalah proyek penggemar. Dukung penulis dengan membeli karya aslinya.
              </p>
            </div>
          </>
        )}
      </main>

      <aside className={styles.rightSidebar}>
        {/* <ins className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-4365395677457990"
          data-ad-slot="4896743654"
          data-ad-format="auto"
          data-full-width-responsive="true">
        </ins> */}
        <h3>Dukung Kami Yuk!</h3>
        <a href="https://saweria.co/SoogarGlyder" target="_blank">
          <img src="/saweria.png" alt="QR Code Saweria" width="200"></img>
        </a>
      </aside>

      </div>
  );
}

export default ChapterReadPage;