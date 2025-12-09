import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

function NotFoundPage() {
  return (
    <div style={{ alignContent: 'center',textAlign: 'center', height: '70vh' }}>
      <SEO title="404 | Halaman Tidak Ditemukan" />
      <h1 style={{ fontSize: '3em', color: '#333'}}>404</h1>
      <h3 style={{ marginTop: '10px', color: '#666',marginBottom: '5px' }}>Waduh! Halaman Tidak Ditemukan</h3>
      <p style={{ marginBottom: '10px' }}>Sepertinya halaman yang kamu cari sudah ditebas oleh Kirito.</p>
      <Link 
        to="/" 
        style={{ 
          display: 'inline-block', 
          marginTop: '20px', 
          padding: '10px 20px', 
          background: '#38b6ff', 
          color: 'white', 
          textDecoration: 'none',
          borderRadius: '5px'
        }}
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}

export default NotFoundPage;