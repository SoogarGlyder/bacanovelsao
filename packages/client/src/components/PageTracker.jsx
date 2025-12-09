import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', 'G-3Y3LMERW26', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
}

export default PageTracker;