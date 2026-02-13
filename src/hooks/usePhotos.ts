import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Photo {
  id: string;
  photo_name: string;
  photo_url: string;
  photo_alt: string;
  page_location: string;
  section_name: string;
  display_order: number;
  is_active: boolean;
}

export const usePhotos = (pageLocation?: string, sectionName?: string) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPhotos();
  }, [pageLocation, sectionName]);
  
  // Add interval to refresh photos every 30 seconds for testing
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing photos...');
      loadPhotos();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [pageLocation, sectionName]);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Loading photos for:', { pageLocation, sectionName });

      let query = supabase
        .from('photos_premium_20251225')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (pageLocation) {
        query = query.eq('page_location', pageLocation);
      }

      if (sectionName) {
        query = query.eq('section_name', sectionName);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('❌ Error loading photos:', fetchError);
        setError(fetchError.message);
      } else {
        console.log('✅ Photos loaded successfully:', data?.length || 0, 'photos');
        console.log('📊 Photo data:', data);
        setPhotos(data || []);
      }
    } catch (err) {
      console.error('Error in loadPhotos:', err);
      setError('Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  const getPhotoBySection = (section: string) => {
    return photos.find(photo => photo.section_name === section);
  };

  const getPhotosBySection = (section: string) => {
    return photos.filter(photo => photo.section_name === section);
  };

  const getPhotoUrl = (section: string, fallbackUrl?: string) => {
    const photo = getPhotoBySection(section);
    console.log(`🖼️ Getting photo URL for section '${section}':`, photo);
    const result = photo?.photo_url || fallbackUrl || '';
    console.log(`🔗 Returning URL:`, result);
    return result;
  };

  const getPhotoAlt = (section: string, fallbackAlt?: string) => {
    const photo = getPhotoBySection(section);
    return photo?.photo_alt || fallbackAlt || '';
  };

  return {
    photos,
    loading,
    error,
    getPhotoBySection,
    getPhotosBySection,
    getPhotoUrl,
    getPhotoAlt,
    refetch: loadPhotos
  };
};

export default usePhotos;