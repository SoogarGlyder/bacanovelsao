import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useOutletContext } from 'react-router-dom';
import styles from './ChapterReadPage.module.css';

function ChapterReadPage() {
  const { id: chapterId } = useParams();
  const navigate = useNavigate();
  const { setPageSerie } = useOutletContext();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prevChapterId, setPrevChapterId] = useState(null);
  const [nextChapterId, setNextChapterId] = useState(null);
  const [allChapters, setAllChapters] = useState([]);
  const [isListVisible, setIsListVisible] = useState(window.innerWidth > 767);
  const handleChapterClick = () => {
    if (window.innerWidth <= 767) {
      setIsListVisible(false);
    }
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
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setPrevChapterId(null);
        setNextChapterId(null);

        const chapterResponse = await fetch(`/api/chapters/${chapterId}`);
        if (!chapterResponse.ok) {
          throw new Error('Chapter tidak ditemukan');}

        const chapterData = await chapterResponse.json();
        setChapter(chapterData);
        setPageSerie(chapterData.novel.serie);

        const novelId = chapterData.novel._id;

        const allChaptersResponse = await fetch(`/api/chapters/novel/${novelId}`);
        if (!allChaptersResponse.ok) {
          throw new Error('Gagal mengambil daftar chapter');}

        const allChaptersData = await allChaptersResponse.json();
        setAllChapters(allChaptersData);
        setPageSerie(chapterData.novel.serie);

        const currentIndex = allChaptersData.findIndex(c => c._id === chapterId);

        if (currentIndex > 0) {
          setPrevChapterId(allChaptersData[currentIndex - 1]._id);
        }

        if (currentIndex < allChaptersData.length - 1) {
          setNextChapterId(allChaptersData[currentIndex + 1]._id);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [chapterId, setPageSerie]);

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
              to={`/chapter/${chapterItem._id}`}
              className={`${styles.chapterLink} ${
                chapterItem._id === chapterId ? styles.activeChapter : ''
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
            {/* <h4>Chapter {chapter.chapter_number}</h4> */}
          </div>

          <hr className={styles.divider} />

          <div className={styles.content}>
            {(chapter.content || '').split('\n').map((paragraph, index) => (
              <p 
                key={index}
                dangerouslySetInnerHTML={{ __html: paragraph }}
              />
            ))}
          </div>

          {/* <hr className={styles.divider} style={{ marginTop: '30px' }} /> */}

          <div className={styles.navigation}>
            <button 
              onClick={() => navigate(`/chapter/${prevChapterId}`)}
              disabled={!prevChapterId}
            >
              &laquo; Chapter Sebelumnya
            </button>
            <button 
              onClick={() => navigate(`/chapter/${nextChapterId}`)}
              disabled={!nextChapterId}
            >
              Chapter Selanjutnya &raquo;
            </button>
          </div>
        </>
      )}
    </main>

    <aside className={styles.rightSidebar}>
      {/* <img src="/ceritanya-iklan.svg" alt="Banner" style={{ height: '600px' }} /> */}
    </aside>

  </div>
);
}

export default ChapterReadPage;