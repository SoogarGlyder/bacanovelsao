import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { useNovelList, useFirstChapterFetcher } from '../hooks/useNovelData.js';

function NovelList({ activeSerie, onNovelClick }) {
  const navigate = useNavigate();
  const { novels, loading, error } = useNovelList(activeSerie);
  const fetchFirstChapterSlug = useFirstChapterFetcher();
  
  const handleNovelClick = async (novelId, novelSlug) => {
    try {
      const firstChapterSlug = await fetchFirstChapterSlug(novelId); 
      onNovelClick(); 
      navigate(`/${novelSlug}/${firstChapterSlug}`); 
    } catch (err) {
      console.error(err);
    }
  };

  const renderContent = () => {
    if (loading) return <div className={styles.novelListWrapper} style={{textAlign: 'center', padding: '50px'}}>Mengaktifkan server... Mohon tunggu sebentar.</div>;
    if (error) return <div className={styles.novelListWrapper} style={{textAlign: 'center', padding: '50px'}}>Error: {error}</div>;
    if (novels.length === 0) return <div className={styles.novelListWrapper} style={{textAlign: 'center', padding: '50px'}}>Tidak ada novel yang ditemukan.</div>;
    
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

export default NovelList;