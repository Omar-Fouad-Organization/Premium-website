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
  Search,
  Images,
  Users,
  MapPin,
  Languages,
  BookOpen
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
    { icon: MapPin, label: "Location & Map", path: "/admin/location" },
    { icon: Search, label: "SEO Settings", path: "/admin/seo" },
    { icon: ImageIcon, label: "Logo & Branding", path: "/admin/logo" },
    { icon: Palette, label: "Design & Colors", path: "/admin/design" },
    { icon: FileText, label: "Page Content", path: "/admin/content" },
    { icon: Images, label: "Photo Management", path: "/admin/photos" },
    { icon: Package, label: "Packages", path: "/admin/packages" },
    { icon: HelpCircle, label: "FAQs", path: "/admin/faqs" },
    { icon: BookOpen, label: "Blog Management", path: "/admin/blogs" },
    { icon: Mail, label: "Submissions", path: "/admin/submissions" },
    { icon: Users, label: "User Management", path: "/admin/users" },
    { icon: Languages, label: "Language & Translations", path: "/admin/language" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-primary to-primary/90 text-white border-r border-primary/20 shadow-xl">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold tracking-tight">Premium Admin</h1>
          <p className="text-sm text-white/70 mt-1 font-light">Green Life Expo</p>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-primary/50 backdrop-blur-sm">
          <div className="mb-3 px-3">
            <p className="text-sm font-medium text-white truncate">{user.email}</p>
            <p className="text-xs text-white/60 mt-0.5">Administrator</p>
          </div>
          <Button
            variant="outline"
            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-200"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      {/* Main Content */}
      <main className="ml-64 min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
