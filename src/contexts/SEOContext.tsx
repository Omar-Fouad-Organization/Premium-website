import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from './LanguageContext';

interface SEOData {
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_title: string;
  og_description: string;
  og_image: string;
  twitter_title: string;
  twitter_description: string;
  twitter_image: string;
  canonical_url: string;
}

interface SEOContextType {
  seoData: SEOData;
  loading: boolean;
  updateMetaTags: (data: Partial<SEOData>) => void;
  refreshSEOData: () => void;
}

const defaultSEOData: SEOData = {
  meta_title: "Green Life Expo - Egypt's Leading Go Green & Healthy Living Expo",
  meta_description: "Egypt's premier exhibition for sustainable living, organic products, and green innovation. Join us for the ultimate green lifestyle experience.",
  meta_keywords: "green life expo, sustainable living, organic products, healthy lifestyle, egypt expo, green innovation",
  og_title: "Green Life Expo - Egypt's Leading Go Green & Healthy Living Expo",
  og_description: "Egypt's premier exhibition for sustainable living, organic products, and green innovation. Join us for the ultimate green lifestyle experience.",
  og_image: "/images/green_life_expo_logo_variations_20251225134629_1.webp",
  twitter_title: "Green Life Expo - Egypt's Leading Go Green & Healthy Living Expo",
  twitter_description: "Egypt's premier exhibition for sustainable living, organic products, and green innovation.",
  twitter_image: "/images/green_life_expo_logo_variations_20251225134629_1.webp",
  canonical_url: typeof window !== 'undefined' ? window.location.origin : '',
};

const SEOContext = createContext<SEOContextType | undefined>(undefined);

export const SEOProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [seoData, setSeoData] = useState<SEOData>(defaultSEOData);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  const loadSEOData = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings_premium_20251225')
        .select('setting_key, setting_value')
        .eq('category', 'seo');

      if (error) {
        console.error('Error loading SEO data:', error);
        return;
      }

      const seoSettings: { [key: string]: string } = {};
      data?.forEach((item) => {
        seoSettings[item.setting_key] = item.setting_value || '';
      });

      // Map database settings to SEO data
      const newSeoData: SEOData = {
        meta_title: seoSettings.meta_title || defaultSEOData.meta_title,
        meta_description: seoSettings.meta_description || defaultSEOData.meta_description,
        meta_keywords: seoSettings.meta_keywords || defaultSEOData.meta_keywords,
        og_title: seoSettings.og_title || seoSettings.meta_title || defaultSEOData.og_title,
        og_description: seoSettings.og_description || seoSettings.meta_description || defaultSEOData.og_description,
        og_image: seoSettings.og_image || defaultSEOData.og_image,
        twitter_title: seoSettings.twitter_title || seoSettings.meta_title || defaultSEOData.twitter_title,
        twitter_description: seoSettings.twitter_description || seoSettings.meta_description || defaultSEOData.twitter_description,
        twitter_image: seoSettings.twitter_image || seoSettings.og_image || defaultSEOData.twitter_image,
        canonical_url: seoSettings.canonical_url || defaultSEOData.canonical_url,
      };

      setSeoData(newSeoData);
    } catch (error) {
      console.error('Error in loadSEOData:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateMetaTags = (data: Partial<SEOData>) => {
    const updatedData = { ...seoData, ...data };
    setSeoData(updatedData);
    applyMetaTags(updatedData);
  };

  const applyMetaTags = (data: SEOData) => {
    // Update document title
    document.title = data.meta_title;

    // Update or create meta tags
    updateMetaTag('description', data.meta_description);
    updateMetaTag('keywords', data.meta_keywords);
    
    // Open Graph tags
    updateMetaTag('og:title', data.og_title, 'property');
    updateMetaTag('og:description', data.og_description, 'property');
    updateMetaTag('og:image', data.og_image, 'property');
    updateMetaTag('og:url', data.canonical_url, 'property');
    updateMetaTag('og:type', 'website', 'property');
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image', 'name');
    updateMetaTag('twitter:title', data.twitter_title, 'name');
    updateMetaTag('twitter:description', data.twitter_description, 'name');
    updateMetaTag('twitter:image', data.twitter_image, 'name');
    
    // Canonical URL
    updateLinkTag('canonical', data.canonical_url);
  };

  const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
    let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
    
    if (element) {
      element.content = content;
    } else {
      element = document.createElement('meta');
      element.setAttribute(attribute, name);
      element.content = content;
      document.head.appendChild(element);
    }
  };

  const updateLinkTag = (rel: string, href: string) => {
    let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
    
    if (element) {
      element.href = href;
    } else {
      element = document.createElement('link');
      element.rel = rel;
      element.href = href;
      document.head.appendChild(element);
    }
  };

  const refreshSEOData = () => {
    setLoading(true);
    loadSEOData();
  };

  useEffect(() => {
    loadSEOData();
  }, [language]);

  useEffect(() => {
    if (!loading) {
      applyMetaTags(seoData);
    }
  }, [seoData, loading]);

  return (
    <SEOContext.Provider value={{ seoData, loading, updateMetaTags, refreshSEOData }}>
      {children}
    </SEOContext.Provider>
  );
};

export const useSEO = () => {
  const context = useContext(SEOContext);
  if (context === undefined) {
    throw new Error('useSEO must be used within a SEOProvider');
  }
  return context;
};

export default SEOContext;