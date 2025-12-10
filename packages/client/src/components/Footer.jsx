import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.copyright}>
        <p>&copy; {currentYear} BacaNovelSAO. Made with ❤ by SoogarGlyder.</p>
      </div>
    </footer>
  );
}

export default Footer;