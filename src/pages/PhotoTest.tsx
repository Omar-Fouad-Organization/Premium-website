import { usePhotos } from '@/hooks/usePhotos';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const PhotoTest = () => {
  const { photos, loading, error, getPhotoUrl, getPhotoAlt, refetch } = usePhotos();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading photos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error loading photos: {error}</p>
          <Button onClick={refetch} className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Photo System Test</h1>
          <Button onClick={refetch}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Photos
          </Button>
        </div>

        <div className="grid gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">All Photos ({photos.length})</h2>
            {photos.length === 0 ? (
              <p className="text-gray-500">No photos found in database</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="border rounded-lg p-4">
                    <img
                      src={photo.photo_url}
                      alt={photo.photo_alt}
                      className="w-full h-32 object-cover rounded mb-2"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                      }}
                    />
                    <h3 className="font-medium">{photo.photo_name}</h3>
                    <p className="text-sm text-gray-600">
                      {photo.page_location} / {photo.section_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Order: {photo.display_order} | Active: {photo.is_active ? 'Yes' : 'No'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Homepage Hero Test</h2>
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={getPhotoUrl('hero', 'https://via.placeholder.com/800x400?text=No+Hero+Photo')}
                alt={getPhotoAlt('hero', 'Hero Image')}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-2 text-sm text-gray-600">
              URL: {getPhotoUrl('hero', 'No hero photo found')}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Debug Info</h2>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
              {JSON.stringify({ photos, loading, error }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoTest;