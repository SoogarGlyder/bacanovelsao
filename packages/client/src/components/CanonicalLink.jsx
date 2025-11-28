import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BASE_URL = 'https://bacanovelsao.vercel.app';

function CanonicalLink() {
  const location = useLocation();

  useEffect(() => {
    const canonicalUrl = `${BASE_URL}${location.pathname}`;

    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }

    link.setAttribute('href', canonicalUrl);
    
  }, [location.pathname]);

  return null;
}

export default CanonicalLink;