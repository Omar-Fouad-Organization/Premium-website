import { useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Settings, 
  Package, 
  HelpCircle, 
  Mail, 
  LogOut,
  Palette,
  FileText,
  Image as ImageIcon,
  Search
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/admin/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Settings, label: "Site Settings", path: "/admin/settings" },
    { icon: Search, label: "SEO Settings", path: "/admin/seo" },
    { icon: ImageIcon, label: "Logo & Branding", path: "/admin/logo" },
    { icon: Palette, label: "Design & Colors", path: "/admin/design" },
    { icon: FileText, label: "Page Content", path: "/admin/content" },
    { icon: Package, label: "Packages", path: "/admin/packages" },
    { icon: HelpCircle, label: "FAQs", path: "/admin/faqs" },
    { icon: Mail, label: "Submissions", path: "/admin/submissions" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-primary text-primary-foreground border-r">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-primary-foreground/80 mt-1">Green Life Expo</p>
        </div>

        <nav className="px-3 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary-foreground/20">
          <div className="mb-3 px-3">
            <p className="text-sm font-medium">{user.email}</p>
          </div>
          <Button
            variant="outline"
            className="w-full bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
