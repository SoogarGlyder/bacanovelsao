import React, { useState, useEffect} from 'react'; 
import styles from './AdminDashboard.module.css'; 
import NovelListAdmin from '../components/NovelListAdmin.jsx'; 
import NovelForm from '../components/NovelForm.jsx'; 
import ChapterListAdmin from '../components/ChapterListAdmin.jsx';
import ChapterForm from '../components/ChapterForm.jsx';

function AdminDashboard() {
  const [novelToEdit, setNovelToEdit] = useState(null); 
  const [chapterToEdit, setChapterToEdit] = useState(null);
  const [refreshList, setRefreshList] = useState(false); 

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const checkResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', checkResize);
    return () => window.removeEventListener('resize', checkResize);
  }, []);


  const handleSaveSuccess = () => {
    setNovelToEdit(null); 
    setChapterToEdit(null);
    setRefreshList(prev => !prev); 
  };

  const handleEditNovel = (novel) => {
    setChapterToEdit(null);
    document.getElementById('edit-novel-form').scrollIntoView({ behavior: 'smooth' });
    setNovelToEdit(novel);
  };
  
  const handleEditChapter = (chapter) => {
    setNovelToEdit(null);
    document.getElementById('edit-chapter-form').scrollIntoView({ behavior: 'smooth' });
    setChapterToEdit(chapter);
  };

  const listKey = refreshList ? 'refresh' : 'initial'; 

  if (isMobile) {
    return (
      <div className={styles.adminContainer} style={{ textAlign: 'center', padding: '50px' }}>
        <h1 style={{color: '#ff6347'}}>Akses Dibatasi</h1>
        <p>Dashboard Administrasi hanya dapat diakses pada layar dengan lebar minimal 769px (Desktop/Tablet besar).</p>
        <p>Silakan buka halaman ini menggunakan komputer atau perangkat dengan layar yang lebih lebar.</p>
      </div>
    );
  }

  useEffect(() => {
        let metaTag = document.querySelector('meta[name="robots"]');
        if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.name = 'robots';
            document.head.appendChild(metaTag);
        }
        
        metaTag.content = 'noindex, nofollow';

        return () => {
             if (metaTag) document.head.removeChild(metaTag);
        };
    }, []);

  return (
    <div className={styles.adminContainer}>
      <h1>Dashboard Administrasi Novel</h1>
      
      <div className={styles.adminMenu}>
        <h2>Kelola Data</h2>
        <ul>
          <li><a href="#kelola-novel" onClick={() => {setNovelToEdit(null); setChapterToEdit(null);}}>Kelola Novel</a></li>
          <li><a href="#kelola-chapter" onClick={() => {setNovelToEdit(null); setChapterToEdit(null);}}>Kelola Chapter</a></li>
          <li><a href="#buat-novel" id="buat-novel-btn" onClick={() => {setNovelToEdit(null); setChapterToEdit(null);}}>Buat Baru</a></li>
        </ul>
      </div>
      
      <section id="edit-novel-form" style={{ marginTop: '30px' }}>
          <NovelForm 
            novelToEdit={novelToEdit}
            onSaveSuccess={handleSaveSuccess}
          />
      </section>
      
      <section id="edit-chapter-form" style={{ marginTop: '30px' }}>
          <ChapterForm 
            chapterToEdit={chapterToEdit}
            onSaveSuccess={handleSaveSuccess}
          />
      </section>

      <section id="kelola-novel" style={{ marginTop: '30px' }}>
          <h2>Daftar Novel</h2>
          <NovelListAdmin 
            key={`novel-${listKey}`} 
            onEditNovel={handleEditNovel} 
          />
      </section>

      <section id="kelola-chapter" style={{ marginTop: '30px' }}>
          <h2>Daftar Chapter</h2>
          <ChapterListAdmin 
            key={`chapter-${listKey}`}
            onEditChapter={handleEditChapter} 
            refreshToggle={refreshList}
          />
      </section>
      
    </div>
  );
}

export default AdminDashboard;