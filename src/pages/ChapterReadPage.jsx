import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useOutletContext } from 'react-router-dom';
import styles from './ChapterReadPage.module.css';
import { useChapterData } from '../hooks/useNovelData.js';
import DOMPurify from 'dompurify';

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
    if (chapter) { 
        try {
            if (window.adsbygoogle) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (e) {
            console.error("AdSense execution failed:", e);
        }
    }
  }, [chapter]);


if (loading) {
    return <div style={{ padding: '20px' }}>Memuat chapter...</div>;
}

if (error) {
    return <div style={{ padding: '20px' }}>Error: {error}</div>;
}

return (
    <div className={styles.holyGrailLayout}>
      <aside className={styles.leftSidebar}>
      <button
        className={styles.mobileToggle}
        onClick={() => setIsListVisible(!isListVisible)}>Daftar Chapter {isListVisible ? '▴' : '▾'}
      </button>
        <h2 className={styles.leftSidebarTitle}>Daftar Chapter</h2>
        {isListVisible && (
        <ul className={styles.chapterList}>
          {allChapters.map((chapterItem) => (
            <li key={chapterItem._id}>
              <Link 
                to={createNewChapterUrl(chapterItem.chapter_slug)}
                  className={`${styles.chapterLink} ${
                    chapterItem.chapter_slug === chapterSlug ? styles.activeChapter : ''
                  }`}
                  onClick={handleChapterClick}
                >
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
            <div className={styles.chapterHeader}>
              <h1>{chapter.novel.title}</h1>
              <h2>{chapter.title}</h2>
            </div>

            <hr className={styles.divider} />

            <div className={styles.content}>
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
                onClick={() => navigate(createNewChapterUrl(prevChapterSlug))} 
                disabled={!prevChapterSlug}
              >
                &laquo; Chapter Sebelumnya
              </button>
              <button 
                onClick={() => navigate(createNewChapterUrl(nextChapterSlug))}
                disabled={!nextChapterSlug}
              >
                Chapter Selanjutnya &raquo;
              </button>
            </div>
          </>
        )}
      </main>

      <aside className={styles.rightSidebar}>
        <ins className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-4365395677457990"
            data-ad-slot="4896743654"
            data-ad-format="auto"
            data-full-width-responsive="true">
        </ins>
      </aside>

    </div>
);
}

export default ChapterReadPage;