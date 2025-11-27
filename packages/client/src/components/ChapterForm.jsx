import React, { useState, useEffect } from 'react';
import { useAdminFetcher } from '../hooks/useAdminFetcher.js';
import styles from '../pages/AdminDashboard.module.css'; 

const initialChapterState = {
  novel: '',
  title: '',
  chapter_number: '',
  chapter_slug: '',
  content: '',
};

function ChapterForm({ chapterToEdit, onSaveSuccess }) {
  const [formData, setFormData] = useState(initialChapterState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [novelOptions, setNovelOptions] = useState([]);

  const authenticatedFetch = useAdminFetcher();
  const isEditing = !!chapterToEdit;

  useEffect(() => {
    const fetchNovels = async () => {
        try {
            const response = await fetch('/api/novels'); 
            if (!response.ok) throw new Error('Gagal memuat daftar Novel untuk formulir.');
            const data = await response.json();
            setNovelOptions(data);

            if (!isEditing && data.length > 0) {
                setFormData(prev => ({ ...prev, novel: data[0]._id }));
            }
        } catch (err) {
            console.error(err);
            setError('Gagal memuat daftar novel: ' + err.message);
        }
    };
    fetchNovels();
  }, [isEditing]);

  useEffect(() => {
    if (chapterToEdit) {
      setFormData({
        novel: chapterToEdit.novel._id,
        title: chapterToEdit.title,
        chapter_number: chapterToEdit.chapter_number,
        content: chapterToEdit.content,
        chapter_slug: chapterToEdit.chapter_slug,
        _id: chapterToEdit._id 
      });
    } else {
      setFormData(prev => ({ 
          ...initialChapterState, 
          novel: novelOptions.length > 0 ? novelOptions[0]._id : ''
      }));
    }
  }, [chapterToEdit, novelOptions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const payload = { 
        ...formData, 
        chapter_number: Number(formData.chapter_number) 
    };

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `/api/chapters/${formData._id}` : '/api/chapters';

    try {
      await authenticatedFetch(url, {
        method: method,
        body: JSON.stringify(payload),
      });

      setSuccess(`Chapter berhasil di${isEditing ? 'perbarui' : 'buat'}!`);
      if (!isEditing) {
        setFormData(prev => ({ 
            ...initialChapterState, 
            novel: payload.novel 
        }));
      }
      onSaveSuccess();
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSlugPlaceholder = () => {
    if (formData.title) {
        return `Akan menjadi: ${formData.title.toLowerCase().replace(/\s/g, '-')}`;
    }
    return 'slug-url-chapter';
  };

  return (
    <form onSubmit={handleSubmit} className={styles.novelForm}>
      <h3>{isEditing ? 'Edit Chapter' : 'Buat Chapter Baru'}</h3>

      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
      
      {novelOptions.length > 0 ? (
          <>
            <label htmlFor="novel">Novel Induk</label>
            <select
                id="novel"
                name="novel"
                value={formData.novel}
                onChange={handleChange}
                required
            >
                {novelOptions.map(novel => (
                    <option key={novel._id} value={novel._id}>
                        {novel.title} ({novel.serie})
                    </option>
                ))}
            </select>
            
            <label htmlFor="title">Judul Chapter</label>
            <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                required
            />
            
            <label htmlFor="chapter_number">Nomor Chapter</label>
            <input
                id="chapter_number"
                name="chapter_number"
                type="number"
                value={formData.chapter_number}
                onChange={handleChange}
                required
            />

            <label htmlFor="chapter_slug">Slug URL (Otomatis jika kosong)</label>
            <input
                id="chapter_slug"
                name="chapter_slug"
                type="text"
                value={formData.chapter_slug || ''}
                onChange={handleChange}
                placeholder={getSlugPlaceholder()}
            />

            <label htmlFor="content">Konten Chapter (Mendukung HTML)</label>
            <textarea
                id="content"
                name="content"
                rows="15"
                value={formData.content}
                onChange={handleChange}
            />

            <button type="submit" disabled={loading}>
                {loading ? 'Memproses...' : (isEditing ? 'Update Chapter' : 'Simpan Chapter')}
            </button>
          </>
      ) : (
          <p>Memuat Novel atau tidak ada Novel ditemukan. Silakan buat Novel terlebih dahulu.</p>
      )}

    </form>
  );
}

export default ChapterForm;