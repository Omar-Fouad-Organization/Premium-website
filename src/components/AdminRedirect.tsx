import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('✅ Admin redirect component loaded, navigating to login...');
    // Use setTimeout to ensure the component is fully mounted
    const timer = setTimeout(() => {
      navigate('/admin/login', { replace: true });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  // Show loading while redirecting with fallback link
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground mb-4">Redirecting to admin login...</p>
        <p className="text-sm text-gray-500 mb-4">
          If you're not redirected automatically,{' '}
          <a 
            href="#/admin/login" 
            className="text-primary hover:underline"
            onClick={() => navigate('/admin/login', { replace: true })}
          >
            click here to go to admin login
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminRedirect;