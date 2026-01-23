import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'video.other';
  canonicalUrl?: string;
  noIndex?: boolean;
}

const SEOHead = ({
  title = "Miber Film Köşesi - Birlikte İzle, Birlikte Yaşa",
  description = "Arkadaşlarınızla birlikte film ve dizi izleyin, görüntülü sohbet edin. Gerçek zamanlı senkronize izleme deneyimi.",
  keywords = "birlikte film izle, watch party, görüntülü sohbet, YouTube birlikte izle, sosyal izleme",
  ogImage = "/og-image.png",
  ogType = "website",
  canonicalUrl,
  noIndex = false,
}: SEOHeadProps) => {
  
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper to update or create meta tag
    const updateMeta = (name: string, content: string, property?: boolean) => {
      const attr = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard meta tags
    updateMeta('description', description);
    updateMeta('keywords', keywords);
    
    // Robots
    if (noIndex) {
      updateMeta('robots', 'noindex, nofollow');
    } else {
      updateMeta('robots', 'index, follow');
    }

    // Open Graph
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:type', ogType, true);
    updateMeta('og:image', ogImage.startsWith('http') ? ogImage : `${window.location.origin}${ogImage}`, true);
    updateMeta('og:url', canonicalUrl || window.location.href, true);
    updateMeta('og:site_name', 'Miber Film Köşesi', true);
    updateMeta('og:locale', 'tr_TR', true);

    // Twitter Card
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', ogImage.startsWith('http') ? ogImage : `${window.location.origin}${ogImage}`);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl || window.location.href);

    // Structured Data - Organization
    let structuredData = document.querySelector('script[type="application/ld+json"]#org-schema');
    if (!structuredData) {
      structuredData = document.createElement('script');
      structuredData.setAttribute('type', 'application/ld+json');
      structuredData.setAttribute('id', 'org-schema');
      document.head.appendChild(structuredData);
    }
    structuredData.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Miber Film Köşesi",
      "description": description,
      "url": window.location.origin,
      "applicationCategory": "Entertainment",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "TRY"
      },
      "author": {
        "@type": "Organization",
        "name": "Miber Film Köşesi"
      }
    });

  }, [title, description, keywords, ogImage, ogType, canonicalUrl, noIndex]);

  return null;
};

export default SEOHead;
