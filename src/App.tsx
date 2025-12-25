import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import PremiumIndex from "./pages/PremiumIndex";
import PremiumAbout from "./pages/PremiumAbout";
import PremiumExhibitors from "./pages/PremiumExhibitors";
import PremiumSponsors from "./pages/PremiumSponsors";
import PremiumSectors from "./pages/PremiumSectors";
import PremiumContent from "./pages/PremiumContent";
import PremiumVisitors from "./pages/PremiumVisitors";
import PremiumContact from "./pages/PremiumContact";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminSettings from "./pages/admin/Settings";
import AdminLocation from "./pages/admin/Location";
import AdminSEO from "./pages/admin/SEO";
import AdminLogo from "./pages/admin/Logo";
import AdminDesign from "./pages/admin/Design";
import AdminContent from "./pages/admin/Content";
import AdminPhotos from "./pages/admin/Photos";
import AdminPackages from "./pages/admin/Packages";
import AdminFAQs from "./pages/admin/FAQs";
import AdminSubmissions from "./pages/admin/Submissions";
import AdminUsers from "./pages/admin/Users";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PremiumIndex />} />
            <Route path="/about" element={<PremiumAbout />} />
            <Route path="/exhibitors" element={<PremiumExhibitors />} />
            <Route path="/sponsors" element={<PremiumSponsors />} />
            <Route path="/sectors" element={<PremiumSectors />} />
            <Route path="/content" element={<PremiumContent />} />
            <Route path="/visitors" element={<PremiumVisitors />} />
            <Route path="/contact" element={<PremiumContact />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/location" element={<AdminLocation />} />
            <Route path="/admin/seo" element={<AdminSEO />} />
            <Route path="/admin/logo" element={<AdminLogo />} />
            <Route path="/admin/design" element={<AdminDesign />} />
            <Route path="/admin/content" element={<AdminContent />} />
            <Route path="/admin/photos" element={<AdminPhotos />} />
            <Route path="/admin/packages" element={<AdminPackages />} />
            <Route path="/admin/faqs" element={<AdminFAQs />} />
            <Route path="/admin/submissions" element={<AdminSubmissions />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
