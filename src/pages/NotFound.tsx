import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

useEffect(() => {
    // Completely suppress logging for admin routes to prevent console spam
    if (!location.pathname.startsWith('/admin') && 
        !location.pathname.includes('admin') &&
        location.pathname !== '/dashboard' &&
        location.pathname !== '/login') {
      console.warn(
        "404 Warning: User attempted to access non-existent route:",
        location.pathname
      );
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="max-w-md w-full mx-4">
        <div className="bg-card rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="text-6xl font-bold text-primary mb-2">404</div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Page Not Found
            </h1>
            <p className="text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Go to Homepage
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <button onClick={() => window.history.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </button>
            </Button>
          </div>
          
          {location.pathname.startsWith('/admin') && (
            <div className="mt-4 p-3 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground mb-2">
                Looking for the admin panel?
              </p>
              <Button variant="secondary" asChild size="sm">
                <Link to="/admin/login">
                  Admin Login
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
