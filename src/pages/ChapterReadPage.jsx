import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useOutletContext } from 'react-router-dom';
import styles from './ChapterReadPage.module.css';

function ChapterReadPage() {
  const { novelSlug, chapterSlug } = useParams();
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
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setPrevChapterId(null);
        setNextChapterId(null);

        const chapterResponse = await fetch(`/api/chapters/slug/${chapterSlug}?novelSlug=${novelSlug}`);
        if (!chapterResponse.ok) {
          throw new Error('Chapter tidak ditemukan');}

        const chapterData = await chapterResponse.json();
        setChapter(chapterData);
        setPageSerie(chapterData.novel.serie);

        document.title = `${chapterData.novel.title} - ${chapterData.title}`;

        const novelId = chapterData.novel._id;
        const currentChapterSlug = chapterData.chapter_slug;

        const allChaptersResponse = await fetch(`/api/chapters/novel/${novelId}`);
        if (!allChaptersResponse.ok) {
          throw new Error('Gagal mengambil daftar chapter');}

        const allChaptersData = await allChaptersResponse.json();
        setAllChapters(allChaptersData);
        setPageSerie(chapterData.novel.serie);

        const currentIndex = allChaptersData.findIndex(c => c.chapter_slug === currentChapterSlug);

        if (currentIndex > 0) {
          setPrevChapterId(allChaptersData[currentIndex - 1].chapter_slug);
        }

        if (currentIndex < allChaptersData.length - 1) {
          setNextChapterId(allChaptersData[currentIndex + 1].chapter_slug);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
}, [chapterSlug, setPageSerie, novelSlug]);

useEffect(() => {
    if (chapter) { 
        try {
            if (window.adsbygoogle && window.adsbygoogle.loaded) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (e) {
            console.error("AdSense execution failed:", e);
        }
    }
}, [chapter]);

useEffect(() => {
    return () => {
        document.title = "Baca Novel SAO";
    };
}, []);


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
            <div className={styles.navigation}>
              <button 
                onClick={() => navigate(createNewChapterUrl(prevChapterId))} 
                disabled={!prevChapterId}
              >
                &laquo; Chapter Sebelumnya
              </button>
              <button 
                onClick={() => navigate(createNewChapterUrl(nextChapterId))}
                disabled={!nextChapterId}
              >
                Chapter Selanjutnya &raquo;
              </button>
            </div>
          </>
        )}
      </main>

    <aside className={styles.rightSidebar}>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4365395677457990"
             crossorigin="anonymous"></script>
        <ins class="adsbygoogle"
        style="display:block"
        data-ad-client="ca-pub-4365395677457990"
        data-ad-slot="4896743654"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
      <script>
          (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
    </aside>

  </div>
);
}

export default ChapterReadPage;