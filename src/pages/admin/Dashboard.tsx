import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Package, HelpCircle, Mail, Settings } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    packages: 0,
    faqs: 0,
    submissions: 0,
    newSubmissions: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [packagesRes, faqsRes, submissionsRes, newSubmissionsRes] = await Promise.all([
      supabase.from("packages_premium_20251225").select("id", { count: "exact" }),
      supabase.from("faqs_premium_20251225").select("id", { count: "exact" }),
      supabase.from("contact_submissions_premium_20251225").select("id", { count: "exact" }),
      supabase.from("contact_submissions_premium_20251225").select("id", { count: "exact" }).eq("status", "new"),
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
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "FAQs",
      value: stats.faqs,
      icon: HelpCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Submissions",
      value: stats.submissions,
      icon: Mail,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "New Submissions",
      value: stats.newSubmissions,
      icon: Mail,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome to your admin dashboard. Manage your website content here.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <a
                href="/admin/settings"
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <Settings className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Site Settings</p>
                  <p className="text-sm text-muted-foreground">Update general information</p>
                </div>
              </a>
              <a
                href="/admin/packages"
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <Package className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Manage Packages</p>
                  <p className="text-sm text-muted-foreground">Edit exhibitor & sponsor packages</p>
                </div>
              </a>
              <a
                href="/admin/submissions"
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">View Submissions</p>
                  <p className="text-sm text-muted-foreground">Check contact form submissions</p>
                </div>
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/50">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Settings className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Dashboard initialized</p>
                    <p className="text-xs text-muted-foreground">All systems ready</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
