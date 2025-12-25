import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, FileText } from "lucide-react";

interface PageContent {
  id: string;
  page_name: string;
  section_name: string;
  content_key: string;
  content_value: string;
  content_type: string;
  display_order: number;
}

const AdminContent = () => {
  const [content, setContent] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const { data, error } = await supabase
      .from("page_content_premium_20251225")
      .select("*")
      .order("page_name", { ascending: true })
      .order("section_name", { ascending: true })
      .order("display_order", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load page content",
        variant: "destructive",
      });
    } else {
      setContent(data || []);
    }
    setLoading(false);
  };

  const handleChange = (id: string, value: string) => {
    setContent(content.map((c) => (c.id === id ? { ...c, content_value: value } : c)));
  };

  const handleSave = async () => {
    setSaving(true);

    for (const item of content) {
      const { error } = await supabase
        .from("page_content_premium_20251225")
        .update({
          content_value: item.content_value,
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update content",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }
    }

    toast({
      title: "Success",
      description: "Page content updated successfully. Refresh the website to see changes.",
    });

    setSaving(false);
  };

  const getContentByPage = (pageName: string) => {
    return content.filter((c) => c.page_name === pageName);
  };

  const groupBySection = (pageContent: PageContent[]) => {
    const sections: { [key: string]: PageContent[] } = {};
    pageContent.forEach((item) => {
      if (!sections[item.section_name]) {
        sections[item.section_name] = [];
      }
      sections[item.section_name].push(item);
    });
    return sections;
  };

  const renderContentField = (item: PageContent) => {
    const isLongText = item.content_value.length > 100 || item.content_key.includes("description") || item.content_key.includes("paragraph");

    return (
      <div key={item.id} className="space-y-2">
        <Label htmlFor={item.id} className="capitalize">
          {item.content_key.replace(/_/g, " ")}
        </Label>
        {isLongText ? (
          <Textarea
            id={item.id}
            value={item.content_value}
            onChange={(e) => handleChange(item.id, e.target.value)}
            rows={4}
          />
        ) : (
          <Input
            id={item.id}
            value={item.content_value}
            onChange={(e) => handleChange(item.id, e.target.value)}
          />
        )}
      </div>
    );
  };

  const renderPageContent = (pageName: string, displayName: string) => {
    const pageContent = getContentByPage(pageName);
    const sections = groupBySection(pageContent);

    return (
      <TabsContent value={pageName} className="space-y-6">
        {Object.entries(sections).map(([sectionName, items]) => (
          <Card key={sectionName}>
            <CardHeader>
              <CardTitle className="capitalize">{sectionName.replace(/_/g, " ")} Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => renderContentField(item))}
            </CardContent>
          </Card>
        ))}
      </TabsContent>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Page Content</h1>
            <p className="text-muted-foreground mt-2">
              Edit content for all pages on your website
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save All Changes"}
          </Button>
        </div>

        <Tabs defaultValue="home" className="space-y-6">
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="exhibitors">Exhibitors</TabsTrigger>
            <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
            <TabsTrigger value="visitors">Visitors</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          {renderPageContent("home", "Homepage")}
          {renderPageContent("about", "About Page")}
          {renderPageContent("exhibitors", "Exhibitors Page")}
          {renderPageContent("sponsors", "Sponsors Page")}
          {renderPageContent("visitors", "Visitors Page")}
          {renderPageContent("contact", "Contact Page")}
        </Tabs>

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              💡 Content Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Writing Tips:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Keep titles concise and compelling</li>
                  <li>Use clear, action-oriented language</li>
                  <li>Break long paragraphs into shorter ones</li>
                  <li>Include relevant keywords naturally</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Best Practices:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Save changes frequently</li>
                  <li>Preview on the live site after saving</li>
                  <li>Maintain consistent tone across pages</li>
                  <li>Update content regularly to keep it fresh</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminContent;
