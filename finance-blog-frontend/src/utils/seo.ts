/**
 * SEO utility functions
 * Handles meta tags and JSON-LD structured data
 */

interface MetaTags {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
}

interface BlogJsonLd {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  url: string;
}

// Set document title
export const setDocumentTitle = (title: string): void => {
  document.title = `${title} | WTF is Finance`;
};

// Set meta tags
export const setMetaTags = (tags: MetaTags): void => {
  // Title
  setDocumentTitle(tags.title);

  // Description
  setOrUpdateMetaTag('name', 'description', tags.description);

  // Keywords
  if (tags.keywords) {
    setOrUpdateMetaTag('name', 'keywords', tags.keywords);
  }

  // Open Graph tags
  setOrUpdateMetaTag('property', 'og:title', tags.title);
  setOrUpdateMetaTag('property', 'og:description', tags.description);
  setOrUpdateMetaTag('property', 'og:type', 'article');

  if (tags.ogUrl) {
    setOrUpdateMetaTag('property', 'og:url', tags.ogUrl);
  }

  if (tags.ogImage) {
    setOrUpdateMetaTag('property', 'og:image', tags.ogImage);
  }

  // Twitter Card
  setOrUpdateMetaTag('name', 'twitter:card', 'summary_large_image');
  setOrUpdateMetaTag('name', 'twitter:title', tags.title);
  setOrUpdateMetaTag('name', 'twitter:description', tags.description);
};

// Helper to set or update meta tag
const setOrUpdateMetaTag = (
  attribute: 'name' | 'property',
  value: string,
  content: string
): void => {
  let element = document.querySelector(`meta[${attribute}="${value}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
};

// Generate JSON-LD for blog article
export const generateBlogJsonLd = (data: BlogJsonLd): void => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    author: {
      '@type': 'Person',
      name: data.author,
    },
    datePublished: data.datePublished,
    dateModified: data.dateModified || data.datePublished,
    url: data.url,
    publisher: {
      '@type': 'Organization',
      name: 'WTF is Finance',
      logo: {
        '@type': 'ImageObject',
        url: `${window.location.origin}/logo.png`,
      },
    },
  };

  injectJsonLd(jsonLd);
};

// Inject JSON-LD script into head
const injectJsonLd = (data: object): void => {
  // Remove existing JSON-LD script if any
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Create new script
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
};

// Clear all dynamic meta tags and JSON-LD
export const clearSeoTags = (): void => {
  // Remove JSON-LD
  const jsonLdScript = document.querySelector('script[type="application/ld+json"]');
  if (jsonLdScript) {
    jsonLdScript.remove();
  }

  // Reset title
  document.title = 'WTF is Finance';
};