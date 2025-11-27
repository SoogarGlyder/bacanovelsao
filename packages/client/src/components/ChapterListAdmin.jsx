import React, { useState, useEffect } from 'react';
import { useAdminFetcher } from '../hooks/useAdminFetcher.js';
import styles from '../pages/AdminDashboard.module.css';

function ChapterListAdmin({ onEditChapter, refreshToggle }) {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const authenticatedFetch = useAdminFetcher();

  useEffect(() => {
    const fetchAllChapters = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await authenticatedFetch('/api/chapters/all', { method: 'GET' }); 
            setChapters(response);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    fetchAllChapters();
  }, [refreshToggle, authenticatedFetch]); 

  const handleDelete = async (chapterId, title) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus chapter "${title}"?`)) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await authenticatedFetch(`/api/chapters/${chapterId}`, {
        method: 'DELETE',
      });

      onEditChapter(null);
      setChapters(prev => prev.filter(c => c._id !== chapterId));
      alert(`Chapter "${title}" berhasil dihapus.`);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Memuat data Chapter...</p>;
  if (error) return <p className={styles.error}>Error saat memuat daftar Chapter: {error}</p>;

  return (
    <div className={styles.tableWrapper}>
        <p>Total Chapter: {chapters.length}</p>
        
        {chapters.length === 0 ? (
            <p>Tidak ada chapter ditemukan.</p>
        ) : (
            <table className={styles.novelTable}>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Judul Chapter</th>
                    <th>Novel</th>
                    <th>Slug</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                {chapters.map((chapter) => (
                    <tr key={chapter._id}>
                        <td>{chapter.chapter_number}</td> 
                        <td>{chapter.title}</td>
                        <td>{chapter.novel?.title || 'N/A'}</td> 
                        <td>{chapter.chapter_slug}</td>
                        <td>
                            <button 
                                onClick={() => onEditChapter(chapter)} 
                                disabled={loading}
                                style={{ marginRight: '5px', backgroundColor: '#ffd700', color: '#333' }}
                            >
                                Edit
                            </button>
                            <button 
                                onClick={() => handleDelete(chapter._id, chapter.title)}
                                disabled={loading}
                                style={{ backgroundColor: '#ff6347', color: 'white' }}
                            >
                                Hapus
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
            </table>
        )}
    </div>
  );
}

export default ChapterListAdmin;