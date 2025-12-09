import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { useNovelList } from '../hooks/useNovelData.js';
import LoadingSpinner from './LoadingSpinner.jsx';

function NovelList({ activeSerie, onNovelClick }) {
  const navigate = useNavigate();
  const { novels, loading, error } = useNovelList(activeSerie);
  
  const handleNovelClick = (novelSlug) => {
    onNovelClick();
    navigate(`/${novelSlug}`);
  };

  const renderContent = () => {
    if (loading) return <LoadingSpinner/>;
    if (error) return <div className={styles.novelListWrapper}>Error: {error}</div>;
    if (novels.length === 0) return <div className={styles.novelListWrapper}>Tidak ada novel yang ditemukan.</div>;
    
    return (
      <div className={styles.novelGallery}>
        {novels.map((novel) => {
          return (
            <div 
              key={novel._id} 
              className={styles.contentCover}
              onClick={() => handleNovelClick(novel.novel_slug)} 
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