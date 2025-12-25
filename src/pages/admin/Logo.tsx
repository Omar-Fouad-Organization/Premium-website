import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, Upload, Image as ImageIcon } from "lucide-react";

interface BrandingSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  setting_type: string;
  description: string;
}

const AdminLogo = () => {
  const [settings, setSettings] = useState<BrandingSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data, error } = await supabase
      .from("site_settings_premium_20251225")
      .select("*")
      .eq("category", "branding");

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load branding settings",
        variant: "destructive",
      });
    } else {
      setSettings(data || []);
    }
    setLoading(false);
  };

  const handleChange = (key: string, value: string) => {
    setSettings(settings.map((s) => (s.setting_key === key ? { ...s, setting_value: value } : s)));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, settingKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 2MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${settingKey}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("logos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("logos").getPublicUrl(filePath);

      // Update setting
      handleChange(settingKey, publicUrl);

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    for (const setting of settings) {
      const { error } = await supabase
        .from("site_settings_premium_20251225")
        .update({
          setting_value: setting.setting_value,
          updated_at: new Date().toISOString(),
        })
        .eq("id", setting.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update settings",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }
    }

    toast({
      title: "Success",
      description: "Branding settings updated successfully. Refresh the website to see changes.",
    });

    setSaving(false);
  };

  const getSetting = (key: string) => {
    return settings.find((s) => s.setting_key === key);
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

  const logoSetting = getSetting("logo_url");
  const logoAltSetting = getSetting("logo_alt_text");
  const faviconSetting = getSetting("favicon_url");

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Logo & Branding</h1>
            <p className="text-muted-foreground mt-2">
              Manage your website logo, favicon, and branding assets
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Main Logo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Main Website Logo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {logoSetting && (
                <>
                  <div className="space-y-2">
                    <Label>Current Logo</Label>
                    <div className="border rounded-lg p-4 bg-accent/50 flex items-center justify-center min-h-[150px]">
                      <img
                        src={logoSetting.setting_value}
                        alt="Current Logo"
                        className="max-h-32 max-w-full object-contain"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logo_upload">Upload New Logo</Label>
                    <div className="flex gap-2">
                      <Input
                        id="logo_upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "logo_url")}
                        disabled={uploading}
                      />
                      <Button variant="outline" disabled={uploading} asChild>
                        <label htmlFor="logo_upload" className="cursor-pointer">
                          <Upload className="h-4 w-4 mr-2" />
                          {uploading ? "Uploading..." : "Browse"}
                        </label>
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Recommended: PNG or SVG format, max 2MB
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logo_url">Logo URL (or paste URL)</Label>
                    <Input
                      id="logo_url"
                      value={logoSetting.setting_value}
                      onChange={(e) => handleChange("logo_url", e.target.value)}
                      placeholder="/images/logo.png"
                    />
                  </div>
                </>
              )}

              {logoAltSetting && (
                <div className="space-y-2">
                  <Label htmlFor="logo_alt_text">Logo Alt Text (for accessibility)</Label>
                  <Input
                    id="logo_alt_text"
                    value={logoAltSetting.setting_value}
                    onChange={(e) => handleChange("logo_alt_text", e.target.value)}
                    placeholder="Green Life Expo Logo"
                  />
                  <p className="text-xs text-muted-foreground">
                    Describe your logo for screen readers and SEO
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Favicon */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Favicon
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {faviconSetting && (
                <>
                  <div className="space-y-2">
                    <Label>Current Favicon</Label>
                    <div className="border rounded-lg p-4 bg-accent/50 flex items-center justify-center min-h-[100px]">
                      <img
                        src={faviconSetting.setting_value}
                        alt="Current Favicon"
                        className="h-16 w-16 object-contain"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="favicon_upload">Upload New Favicon</Label>
                    <div className="flex gap-2">
                      <Input
                        id="favicon_upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "favicon_url")}
                        disabled={uploading}
                      />
                      <Button variant="outline" disabled={uploading} asChild>
                        <label htmlFor="favicon_upload" className="cursor-pointer">
                          <Upload className="h-4 w-4 mr-2" />
                          {uploading ? "Uploading..." : "Browse"}
                        </label>
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Recommended: 32x32px or 64x64px, ICO or PNG format
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="favicon_url">Favicon URL (or paste URL)</Label>
                    <Input
                      id="favicon_url"
                      value={faviconSetting.setting_value}
                      onChange={(e) => handleChange("favicon_url", e.target.value)}
                      placeholder="/favicon.ico"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle>💡 Logo Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold">Main Logo:</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Use transparent background (PNG or SVG)</li>
                  <li>Recommended width: 200-400px</li>
                  <li>Keep file size under 2MB</li>
                  <li>Ensure good contrast on white background</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Favicon:</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Use square format (32x32 or 64x64 pixels)</li>
                  <li>Simple, recognizable design</li>
                  <li>ICO format preferred for compatibility</li>
                  <li>Test on different browsers</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminLogo;
