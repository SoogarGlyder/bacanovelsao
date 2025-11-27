import React, { useState, useEffect } from 'react';
import { useAdminFetcher } from '../hooks/useAdminFetcher.js';
import styles from '../pages/AdminDashboard.module.css';

const seriesOptions = [
  { id: 'main', name: 'Main' },
  { id: 'progressive', name: 'Progressive' },
  { id: 'ggo', name: 'Gun Gale Online' },
  { id: 'clover', name: "Clover's Regret" },
  { id: 'anthology', name: 'Anthology' },
  { id: 'gourmet', name: 'Gourmet Seekers' },
  { id: 'mystery', name: 'Mystery Labyrinth' },
];

const initialFormState = {
  title: '',
  serie: 'main', 
  synopsis: '',
  cover_image: '',
};

function NovelForm({ novelToEdit, onSaveSuccess }) {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const authenticatedFetch = useAdminFetcher();
  const isEditing = !!novelToEdit;

  useEffect(() => {
    if (novelToEdit) {
      setFormData({
        title: novelToEdit.title || '',
        serie: novelToEdit.serie || 'main',
        synopsis: novelToEdit.synopsis || '',
        cover_image: novelToEdit.cover_image || '',
        _id: novelToEdit._id 
      });
    } else {
      setFormData(initialFormState);
    }
  }, [novelToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `/api/novels/${formData._id}` : '/api/novels';

    try {
      await authenticatedFetch(url, {
        method: method,
        body: JSON.stringify(formData),
      });

      setSuccess(`Novel berhasil di${isEditing ? 'perbarui' : 'buat'}!`);
      if (!isEditing) {
        setFormData(initialFormState);
      }
      onSaveSuccess();
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.novelForm}>
      <h3>{isEditing ? 'Edit Novel' : 'Buat Novel Baru'}</h3>

      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      <label htmlFor="title">Judul Novel</label>
      <input
        id="title"
        name="title"
        type="text"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <label htmlFor="serie">Seri</label>
      <select
        id="serie"
        name="serie"
        value={formData.serie}
        onChange={handleChange}
        required
      >
        {seriesOptions.map(option => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>

      <label htmlFor="cover_image">URL Cover Image</label>
      <input
        id="cover_image"
        name="cover_image"
        type="text"
        value={formData.cover_image}
        onChange={handleChange}
      />
      
      <label htmlFor="novel_slug">Slug URL (Otomatis jika kosong)</label>
      <input
        id="novel_slug"
        name="novel_slug"
        type="text"
        value={formData.novel_slug || ''}
        onChange={handleChange}
        placeholder={formData.title ? `Akan menjadi: ${formData.title.toLowerCase().replace(/\s/g, '-')}` : 'slug-url-novel'}
      />

      <label htmlFor="synopsis">Sinopsis</label>
      <textarea
        id="synopsis"
        name="synopsis"
        value={formData.synopsis}
        onChange={handleChange}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Memproses...' : (isEditing ? 'Update Novel' : 'Simpan Novel')}
      </button>
    </form>
  );
}

export default NovelForm;