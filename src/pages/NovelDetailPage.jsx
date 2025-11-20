import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './NovelDetailPage.module.css';

function NovelDetailPage() {
  const { id } = useParams();

  const [novel, setNovel] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const novelResponse = await fetch(`http://localhost:2612/api/novels/${id}`);
        if (!novelResponse.ok) {
          throw new Error('Novel tidak ditemukan');
        }
        const novelData = await novelResponse.json();
        setNovel(novelData);

        const chapterResponse = await fetch(`http://localhost:2612/api/chapters/novel/${id}`);
        if (!chapterResponse.ok) {
          throw new Error('Gagal mengambil chapter');
        }
        const chapterData = await chapterResponse.json();
        setChapters(chapterData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div>Memuat data novel...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!novel) {
    return <div>Novel tidak ditemukan.</div>;
  }

  return (
    <div className={styles.detailContainer}>
      
      <div className={styles.infoGrid}>
        
        <div className={styles.coverWrapper}>
          <img 
            src={novel.cover_image || 'https://via.placeholder.com/250x350'} 
            alt={novel.title}
            className={styles.coverImage}
          />
        </div>

        <div className={styles.infoWrapper}>
          <h1>{novel.title}</h1>
          <p className={styles.synopsis}>{novel.synopsis}</p>
        </div>
      </div>

      <div className={styles.chapterListSection}>
        <h2>Daftar Chapter</h2>
        {chapters.length > 0 ? (
          <ul className={styles.chapterList}>
            {chapters.map((chapter) => (
              <li key={chapter._id} className={styles.chapterItem}>
                <Link to={`/chapter/${chapter._id}`} className={styles.chapterLink}>
                  {chapter.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noChapters}>Belum ada chapter untuk novel ini.</p>
        )}
      </div>
    </div>
  );
}

export default NovelDetailPage;