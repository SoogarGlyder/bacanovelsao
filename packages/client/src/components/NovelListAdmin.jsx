import React, { useState, useEffect } from 'react';
import { useAdminFetcher } from '../hooks/useAdminFetcher.js';
import styles from '../pages/AdminDashboard.module.css';
import { useNovelList } from '../hooks/useNovelData.js';

function NovelListAdmin({ onEditNovel }) {
  
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshToggle, setRefreshToggle] = useState(false);

  const authenticatedFetch = useAdminFetcher();
  
  useEffect(() => {
    const fetchAllNovels = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/novels'); 
            if (!response.ok) throw new Error('Gagal mengambil data novel.');
            const data = await response.json();
            setNovels(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    fetchAllNovels();
  }, [refreshToggle]);

  const handleDelete = async (novelId, title) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus novel "${title}" dan semua chapternya?`)) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await authenticatedFetch(`/api/novels/${novelId}`, {
        method: 'DELETE',
      });

      setRefreshToggle(prev => !prev); 
      alert(`Novel "${title}" berhasil dihapus.`);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && novels.length === 0) return <p>Memuat data novel...</p>;
  if (error) return <p className={styles.error}>Error saat memuat daftar: {error}</p>;

  return (
    <div className={styles.tableWrapper}>
      <button 
        onClick={() => setRefreshToggle(prev => !prev)}
        disabled={loading}
        style={{ marginBottom: '15px' }}
      >
        Refresh Data
      </button>

      {novels.length === 0 ? (
        <p>Tidak ada novel ditemukan di database.</p>
      ) : (
        <table className={styles.novelTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Judul</th>
              <th>Seri</th>
              <th>Slug</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {novels.map((novel) => (
              <tr key={novel._id}>
                <td>{novel._id.slice(-4)}</td>
                <td>{novel.title}</td>
                <td>{novel.serie}</td>
                <td>{novel.novel_slug}</td>
                <td>
                  <button 
                    onClick={() => onEditNovel(novel)}
                    disabled={loading}
                    style={{ marginRight: '5px', backgroundColor: '#ffd700', color: '#333' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(novel._id, novel.title)}
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

export default NovelListAdmin;