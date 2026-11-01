import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DemoLayout from "@/components/admin/DemoLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/integrations/api/client";
import { Package, HelpCircle, Mail, TrendingUp, Users, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AdminDashboard = ({ demo = false }: { demo?: boolean }) => {
  const [stats, setStats] = useState({
    packages: demo ? 8 : 0,
    faqs: demo ? 24 : 0,
    submissions: demo ? 126 : 0,
    newSubmissions: demo ? 12 : 0,
  });

  useEffect(() => {
    if (!demo) loadStats();
  }, [demo]);

  const loadStats = async () => {
    const [packagesRes, faqsRes, submissionsRes, newSubmissionsRes] = await Promise.all([
      api.from("packages").select("id", { count: "exact" }),
      api.from("faqs").select("id", { count: "exact" }),
      api.from("contact_submissions").select("id", { count: "exact" }),
      api.from("contact_submissions").select("id", { count: "exact" }).eq("is_read", false),
    ]);

    setStats({
      packages: packagesRes.count || 0,
      faqs: faqsRes.count || 0,
      submissions: submissionsRes.count || 0,
      newSubmissions: newSubmissionsRes.count || 0,
    });
  };

  const statCards = [
    {
      title: "Total Packages",
      value: stats.packages,
      icon: Package,
      color: "text-primary",
      bgColor: "bg-primary/10",
      description: "Exhibitor & Sponsor packages",
    },
    {
      title: "FAQs",
      value: stats.faqs,
      icon: HelpCircle,
      color: "text-secondary",
      bgColor: "bg-secondary/20",
      description: "Published questions",
    },
    {
      title: "Total Submissions",
      value: stats.submissions,
      icon: Mail,
      color: "text-accent",
      bgColor: "bg-accent/10",
      description: "All contact forms",
    },
    {
      title: "New Submissions",
      value: stats.newSubmissions,
      icon: TrendingUp,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "Unread inquiries",
    },
  ];

  const quickActions = [
    {
      title: "Site Settings",
      description: "Update general info, hero, stats, contact",
      icon: Award,
      link: "/admin/settings",
      color: "bg-gradient-to-br from-primary to-primary/80",
    },
    {
      title: "Page Content",
      description: "Edit content for all 8 pages",
      icon: Users,
      link: "/admin/content",
      color: "bg-gradient-to-br from-secondary to-secondary/80",
    },
    {
      title: "SEO Settings",
      description: "Optimize meta tags & social media",
      icon: TrendingUp,
      link: "/admin/seo",
      color: "bg-gradient-to-br from-accent to-accent/80",
    },
    {
      title: "Manage Packages",
      description: "Update exhibitor & sponsor packages",
      icon: Package,
      link: "/admin/packages",
      color: "bg-gradient-to-br from-blue-600 to-blue-500",
    },
  ];

  const Layout = demo ? DemoLayout : AdminLayout;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Premium Dashboard</h1>
              <p className="text-white/80 text-lg">Welcome to Green Life Expo Admin Panel</p>
            </div>
            <Calendar className="h-16 w-16 text-white/30" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} to={demo ? "/admin/demo" : action.link} aria-disabled={demo || undefined} onClick={demo ? (event) => event.preventDefault() : undefined}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Premium Website Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-primary">What You Can Control:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>All text content on every page</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Website logo and favicon</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Brand colors (4 customizable colors)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>SEO meta tags and Open Graph</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Exhibitor & sponsor packages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>FAQs and contact submissions</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-primary">Premium Pages:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Homepage - Hero, value prop, sectors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>About - Vision, mission, values</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Sectors - 6 curated sectors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Exhibitors - ROI-focused messaging</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Sponsors - Executive positioning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Content & Talks, Visitors, Contact</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Need help?</p>
                  <p className="text-xs text-muted-foreground">Check the documentation or contact support</p>
                </div>
                <Button asChild variant="outline">
                  <a href="https://github.com/omarfouad01/premium-website" target="_blank" rel="noopener noreferrer">
                    View Documentation
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
