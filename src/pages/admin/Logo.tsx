import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, Image as ImageIcon, Check } from "lucide-react";

const AdminLogo = () => {
  const [logoUrl, setLogoUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadLogos();
  }, []);

  const loadLogos = async () => {
    const { data } = await supabase
      .from("site_settings_premium_20251225")
      .select("logo_url, favicon_url")
      .limit(1)
      .single();

    if (data) {
      setLogoUrl(data.logo_url || "");
      setFaviconUrl(data.favicon_url || "");
    }
    setLoading(false);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploadingLogo(true);

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("premium_logos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("premium_logos")
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // Get the first row ID
      const { data: settingsData, error: fetchError } = await supabase
        .from("site_settings_premium_20251225")
        .select("id")
        .limit(1)
        .single();

      if (fetchError) {
        console.error("Fetch error:", fetchError);
        throw new Error("Failed to fetch settings ID");
      }

      if (!settingsData?.id) {
        throw new Error("No settings record found");
      }

      // Update database with logo URL
      const { error: updateError } = await supabase
        .from("site_settings_premium_20251225")
        .update({ logo_url: publicUrl })
        .eq("id", settingsData.id);

      if (updateError) {
        console.error("Update error:", updateError);
        throw updateError;
      }

      setLogoUrl(publicUrl);
      toast({
        title: "Success",
        description: "Logo uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload logo",
        variant: "destructive",
      });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // Validate file size (max 1MB for favicon)
    if (file.size > 1 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Favicon size must be less than 1MB",
        variant: "destructive",
      });
      return;
    }

    setUploadingFavicon(true);

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `favicon-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("premium_logos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("premium_logos")
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // Get the first row ID
      const { data: settingsData, error: fetchError } = await supabase
        .from("site_settings_premium_20251225")
        .select("id")
        .limit(1)
        .single();

      if (fetchError) {
        console.error("Fetch error:", fetchError);
        throw new Error("Failed to fetch settings ID");
      }

      if (!settingsData?.id) {
        throw new Error("No settings record found");
      }

      // Update database with favicon URL
      const { error: updateError } = await supabase
        .from("site_settings_premium_20251225")
        .update({ favicon_url: publicUrl })
        .eq("id", settingsData.id);

      if (updateError) {
        console.error("Update error:", updateError);
        throw updateError;
      }

      setFaviconUrl(publicUrl);
      
      // Update favicon in document
      updateFaviconInDocument(publicUrl);
      
      toast({
        title: "Success",
        description: "Favicon uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload favicon",
        variant: "destructive",
      });
    } finally {
      setUploadingFavicon(false);
    }
  };

  const updateFaviconInDocument = (url: string) => {
    // Update favicon link in document head
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = url;
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
        <div>
          <h1 className="text-3xl font-bold">Logo & Branding</h1>
          <p className="text-muted-foreground mt-2">
            Upload and manage your website logo and favicon
          </p>
        </div>

        {/* Main Logo Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Main Logo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Upload Logo</Label>
              <p className="text-sm text-muted-foreground">
                Upload your logo image (PNG, JPG, SVG, or WebP). Recommended size: 400x100px. Max file size: 5MB.
              </p>
              
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  id="logo-upload"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => document.getElementById("logo-upload")?.click()}
                  disabled={uploadingLogo}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploadingLogo ? "Uploading..." : "Upload Logo"}
                </Button>
                {logoUrl && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Check className="h-4 w-4" />
                    Logo uploaded
                  </div>
                )}
              </div>

              {/* Logo Preview */}
              {logoUrl && (
                <div className="space-y-2">
                  <Label>Current Logo Preview</Label>
                  <div className="p-6 bg-muted rounded-lg">
                    <img
                      src={logoUrl}
                      alt="Logo Preview"
                      className="h-16 w-auto"
                    />
                  </div>
                  <div className="p-6 bg-gray-900 rounded-lg">
                    <img
                      src={logoUrl}
                      alt="Logo Preview on Dark"
                      className="h-16 w-auto brightness-0 invert"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Favicon Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Favicon
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Upload Favicon</Label>
              <p className="text-sm text-muted-foreground">
                Upload your favicon (the small icon that appears in browser tabs). Recommended size: 32x32px or 64x64px. Max file size: 1MB.
              </p>
              
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  id="favicon-upload"
                  accept="image/*"
                  onChange={handleFaviconUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => document.getElementById("favicon-upload")?.click()}
                  disabled={uploadingFavicon}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploadingFavicon ? "Uploading..." : "Upload Favicon"}
                </Button>
                {faviconUrl && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Check className="h-4 w-4" />
                    Favicon uploaded
                  </div>
                )}
              </div>

              {/* Favicon Preview */}
              {faviconUrl && (
                <div className="space-y-2">
                  <Label>Current Favicon Preview</Label>
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <img
                        src={faviconUrl}
                        alt="Favicon Preview"
                        className="h-8 w-8"
                      />
                    </div>
                    <div className="p-4 bg-gray-900 rounded-lg">
                      <img
                        src={faviconUrl}
                        alt="Favicon Preview on Dark"
                        className="h-8 w-8"
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Preview at actual size (32x32px)</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Usage Guidelines */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3 text-blue-900">Logo Usage Guidelines</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Logo appears in the header (top navigation) and footer of all pages</li>
              <li>• Recommended logo format: PNG with transparent background or SVG</li>
              <li>• Logo should be horizontal/landscape orientation for best results</li>
              <li>• Favicon appears in browser tabs and bookmarks</li>
              <li>• Favicon should be square (1:1 ratio) for best results</li>
              <li>• Changes take effect immediately after upload</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminLogo;
