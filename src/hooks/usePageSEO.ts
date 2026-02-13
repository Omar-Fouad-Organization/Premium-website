import { useEffect } from 'react';
import { useSEO } from '@/contexts/SEOContext';

interface PageSEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
}

export const usePageSEO = (props: PageSEOProps) => {
  const { updateMetaTags, seoData } = useSEO();

  useEffect(() => {
    const pageData = {
      meta_title: props.title || seoData.meta_title,
      meta_description: props.description || seoData.meta_description,
      meta_keywords: props.keywords || seoData.meta_keywords,
      og_title: props.ogTitle || props.title || seoData.og_title,
      og_description: props.ogDescription || props.description || seoData.og_description,
      og_image: props.ogImage || seoData.og_image,
      twitter_title: props.twitterTitle || props.title || seoData.twitter_title,
      twitter_description: props.twitterDescription || props.description || seoData.twitter_description,
      twitter_image: props.twitterImage || props.ogImage || seoData.twitter_image,
      canonical_url: props.canonicalUrl || (typeof window !== 'undefined' ? window.location.href : ''),
    };

    updateMetaTags(pageData);

    // Cleanup function to restore default SEO data when component unmounts
    return () => {
      updateMetaTags(seoData);
    };
  }, [props, updateMetaTags, seoData]);
};

export default usePageSEO;