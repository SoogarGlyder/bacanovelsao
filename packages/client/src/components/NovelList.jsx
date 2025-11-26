import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { useNovelList, useFirstChapterFetcher } from '../hooks/useNovelData.js';

function NovelList({ activeSerie, onNovelClick }) {
  const navigate = useNavigate();
  const { novels, loading, error } = useNovelList(activeSerie);
  const fetchFirstChapterSlug = useFirstChapterFetcher();
  
  const [loadingNovelId, setLoadingNovelId] = useState(null);
  
  const handleNovelClick = async (novelId, novelSlug) => {
    if (loadingNovelId) return; 

    setLoadingNovelId(novelId);
    
    try {
      const firstChapterSlug = await fetchFirstChapterSlug(novelId); 
      onNovelClick(); 
      navigate(`/${novelSlug}/${firstChapterSlug}`); 
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingNovelId(null);
    }
  };

  const renderContent = () => {
    if (loading) return <div className={styles.novelListWrapper}>Mengaktifkan server... Mohon tunggu sebentar.</div>;
    if (error) return <div className={styles.novelListWrapper}>Error: {error}</div>;
    if (novels.length === 0) return <div className={styles.novelListWrapper}>Tidak ada novel yang ditemukan.</div>;
    
    return (
      <div className={styles.novelGallery}>
        {novels.map((novel) => {
          const isLoading = loadingNovelId === novel._id;
          
          return (
            <div 
              key={novel._id} 
              className={styles.contentCover}
              onClick={() => handleNovelClick(novel._id, novel.novel_slug)} 
              style={{ cursor: isLoading ? 'wait' : 'pointer', opacity: isLoading ? 0.7 : 1 }} 
              disabled={isLoading}
            >
              <img 
                src={novel.cover_image || 'https://via.placeholder.com/250x350'} 
                className={styles.contentCoverImg} 
                alt={novel.title} 
              />
              <figcaption className={styles.captionLink}>
                {novel.title} {isLoading && '...'}
              </figcaption>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={styles.novelListWrapper}>
      {renderContent()}
    </div>
  );
}

export default NovelList;