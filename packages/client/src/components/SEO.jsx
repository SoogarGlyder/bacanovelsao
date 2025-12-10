import React from 'react';
import { Helmet } from 'react-helmet-async';

function SEO({ title, description, image, type = 'article', url, keywords, noindex = false }) {
  
  const siteTitle = 'Baca Novel SAO';
  const metaTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const metaDesc = description || 'Baca Novel Seri Sword Art Online (SAO) lengkap, mulai dari Aincrad, Progressive, Gun Gale Online, dan seri lainnya.';
  const metaImage = image || 'https://bacanovelsao.vercel.app/social-cover.jpg'; 
  const metaUrl = url || window.location.href;
  const metaKeywords = keywords || "novel sao, sword art online, aincrad, progressive, light novel, baca online, ggo, novel fantasi";

  const stripHtml = (html) => {
      if (!html) return '';
      const stripped = html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
      if (stripped.length > 160) {
          return stripped.substring(0, 160) + '...';
      }
      return stripped;
  };

  const cleanDesc = stripHtml(metaDesc);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": type === 'article' ? 'Article' : 'WebPage',
    "headline": metaTitle,
    "description": cleanDesc,
    "image": metaImage,
    "url": metaUrl,
    "author": {
        "@type": "Person",
        "name": "SoogarGlyder"
    },
    "publisher": {
        "@type": "Organization",
        "name": siteTitle,
        "logo": {
            "@type": "ImageObject",
            "url": "https://bacanovelsao.vercel.app/favicon.ico"
        }
    },
    "datePublished": new Date().toISOString()
  };

  return (
    <Helmet defer={false}>
      <title>{metaTitle}</title>
      <meta name="description" content={cleanDesc} />
      <meta name="keywords" content={metaKeywords} />
      <link rel="canonical" href={metaUrl} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={cleanDesc} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:site_name" content={siteTitle} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={cleanDesc} />
      <meta name="twitter:image" content={metaImage} />

      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
}

export default SEO;