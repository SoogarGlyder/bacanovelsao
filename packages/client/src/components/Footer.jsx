// packages/client/src/components/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css'; // Kita buat CSS-nya setelah ini

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        {/* KOLOM 1: IDENTITAS & DISCLAIMER */}
        <div className={styles.column}>
          <h3 className={styles.logoText}>BacaNovelSAO</h3>
          <p className={styles.description}>
            Platform baca novel Sword Art Online Bahasa Indonesia terlengkap. 
            Mulai dari Aincrad, Progressive, hingga Unital Ring.
          </p>
          <div className={styles.disclaimer}>
            <p>
              <strong>Disclaimer:</strong> Kami tidak berafiliasi dengan Reki Kawahara, 
              ASCII Media Works, atau pemegang lisensi resmi lainnya. 
              Ini adalah proyek penggemar. Dukung penulis dengan membeli karya aslinya.
            </p>
          </div>
        </div>

        {/* KOLOM 2: NAVIGASI */}
        <div className={styles.column}>
          <h4 className={styles.heading}>Navigasi</h4>
          <ul className={styles.linkList}>
            <li><Link to="/">Beranda</Link></li>
            <li><Link to="/">Daftar Novel</Link></li>
            {/* Jika Anda membuat halaman About atau Privacy Policy nanti */}
            <li><span className={styles.disabledLink}>Tentang Kami</span></li>
            <li><span className={styles.disabledLink}>Privacy Policy</span></li>
          </ul>
        </div>

        {/* KOLOM 3: DUKUNGAN & SOSIAL */}
        <div className={styles.column}>
          <h4 className={styles.heading}>Dukungan & Kontak</h4>
          <ul className={styles.linkList}>
            <li>
              <a href="https://saweria.co/SoogarGlyder" target="_blank" rel="noreferrer" className={styles.supportLink}>
                ☕ Traktir Kopi (Saweria)
              </a>
            </li>
            <li>
              <a href="#" className={styles.disabledLink}>💬 Discord Community (Soon)</a>
            </li>
            <li>
              <a href="mailto:admin@bacanovelsao.com">📧 Lapor Masalah / DMCA</a>
            </li>
          </ul>
        </div>

      </div>

      {/* COPYRIGHT BAR */}
      <div className={styles.copyright}>
        <p>&copy; {currentYear} BacaNovelSAO. Made with ❤ by SoogarGlyder.</p>
      </div>
    </footer>
  );
}

export default Footer;