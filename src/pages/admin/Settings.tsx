import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

interface Setting {
  id: string;
  setting_key: string;
  setting_value: string;
  setting_type: string;
  category: string;
  description: string;
}

const AdminSettings = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data, error } = await supabase
      .from("site_settings_premium_20251225")
      .select("*")
      .order("category", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    } else {
      setSettings(data || []);
    }
    setLoading(false);
  };

  const handleChange = (key: string, value: string) => {
    setSettings(
      settings.map((s) => (s.setting_key === key ? { ...s, setting_value: value } : s))
    );
  };

  const handleSave = async () => {
    setSaving(true);

    const updates = settings.map((setting) => ({
      id: setting.id,
      setting_value: setting.setting_value,
      updated_at: new Date().toISOString(),
    }));

    for (const update of updates) {
      const { error } = await supabase
        .from("site_settings_premium_20251225")
        .update({ setting_value: update.setting_value, updated_at: update.updated_at })
        .eq("id", update.id);

      if (error) {
        toast({
          title: "Error",
          description: `Failed to update setting`,
          variant: "destructive",
        });
        setSaving(false);
        return;
      }
    }

    toast({
      title: "Success",
      description: "Settings updated successfully",
    });

    setSaving(false);
  };

  const getSettingsByCategory = (category: string) => {
    return settings.filter((s) => s.category === category);
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
            <h1 className="text-3xl font-bold">Site Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your website's general information and configuration
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="hero">Hero Section</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="contact">Contact Info</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {getSettingsByCategory("general").map((setting) => (
                  <div key={setting.id} className="space-y-2">
                    <Label htmlFor={setting.setting_key}>
                      {setting.description || setting.setting_key}
                    </Label>
                    <Input
                      id={setting.setting_key}
                      value={setting.setting_value}
                      onChange={(e) => handleChange(setting.setting_key, e.target.value)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hero" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {getSettingsByCategory("hero").map((setting) => (
                  <div key={setting.id} className="space-y-2">
                    <Label htmlFor={setting.setting_key}>
                      {setting.description || setting.setting_key}
                    </Label>
                    {setting.setting_key.includes("subtitle") ? (
                      <textarea
                        id={setting.setting_key}
                        value={setting.setting_value}
                        onChange={(e) => handleChange(setting.setting_key, e.target.value)}
                        className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                      />
                    ) : (
                      <Input
                        id={setting.setting_key}
                        value={setting.setting_value}
                        onChange={(e) => handleChange(setting.setting_key, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Homepage Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {getSettingsByCategory("stats").map((setting) => (
                  <div key={setting.id} className="space-y-2">
                    <Label htmlFor={setting.setting_key}>
                      {setting.description || setting.setting_key}
                    </Label>
                    <Input
                      id={setting.setting_key}
                      value={setting.setting_value}
                      onChange={(e) => handleChange(setting.setting_key, e.target.value)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {getSettingsByCategory("contact").map((setting) => (
                  <div key={setting.id} className="space-y-2">
                    <Label htmlFor={setting.setting_key}>
                      {setting.description || setting.setting_key}
                    </Label>
                    {setting.setting_key.includes("address") ? (
                      <textarea
                        id={setting.setting_key}
                        value={setting.setting_value}
                        onChange={(e) => handleChange(setting.setting_key, e.target.value)}
                        className="w-full min-h-[80px] px-3 py-2 border rounded-md"
                      />
                    ) : (
                      <Input
                        id={setting.setting_key}
                        value={setting.setting_value}
                        onChange={(e) => handleChange(setting.setting_key, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
