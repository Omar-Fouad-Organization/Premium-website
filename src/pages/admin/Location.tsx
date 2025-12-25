import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Save, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AdminLocation = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [settings, setSettings] = useState({
    event_location: "",
    contact_address: "",
    map_latitude: "",
    map_longitude: "",
    map_zoom: "",
    map_marker_title: "",
    map_embed_url: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("site_settings_premium_20251225")
      .select("setting_key, setting_value")
      .in("setting_key", [
        "event_location",
        "contact_address",
        "map_latitude",
        "map_longitude",
        "map_zoom",
        "map_marker_title",
        "map_embed_url",
      ]);

    if (error) {
      toast({
        title: "Error loading settings",
        description: error.message,
        variant: "destructive",
      });
    } else {
      const settingsObj: any = {};
      data?.forEach((item) => {
        settingsObj[item.setting_key] = item.setting_value;
      });
      setSettings(settingsObj);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);

    const updates = Object.entries(settings).map(([key, value]) => ({
      setting_key: key,
      setting_value: value,
    }));

    for (const update of updates) {
      const { error } = await supabase
        .from("site_settings_premium_20251225")
        .update({ setting_value: update.setting_value })
        .eq("setting_key", update.setting_key);

      if (error) {
        toast({
          title: "Error saving settings",
          description: error.message,
          variant: "destructive",
        });
        setSaving(false);
        return;
      }
    }

    toast({
      title: "Success",
      description: "Location and map settings saved successfully",
    });
    setSaving(false);
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
          <h1 className="text-3xl font-bold">Location & Map Settings</h1>
          <p className="text-muted-foreground mt-2">
            Control the event location, address, and map display
          </p>
        </div>

        {/* Location Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Event Location & Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Event Location Name</Label>
              <Input
                value={settings.event_location}
                onChange={(e) =>
                  setSettings({ ...settings, event_location: e.target.value })
                }
                placeholder="e.g., Cairo International Exhibition Center"
              />
              <p className="text-sm text-muted-foreground">
                This is the venue name displayed on the website
              </p>
            </div>

            <div className="space-y-2">
              <Label>Full Physical Address</Label>
              <Textarea
                value={settings.contact_address}
                onChange={(e) =>
                  setSettings({ ...settings, contact_address: e.target.value })
                }
                placeholder="e.g., Cairo International Exhibition Center, El Nasr Road, Nasr City, Cairo, Egypt"
                rows={3}
              />
              <p className="text-sm text-muted-foreground">
                Full address displayed on contact page and in map marker
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Map Coordinates */}
        <Card>
          <CardHeader>
            <CardTitle>Map Pin Location (Coordinates)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>How to get coordinates:</strong> Go to Google Maps, right-click on your location, 
                and click the coordinates to copy them. The first number is latitude, the second is longitude.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Latitude</Label>
                <Input
                  value={settings.map_latitude}
                  onChange={(e) =>
                    setSettings({ ...settings, map_latitude: e.target.value })
                  }
                  placeholder="e.g., 30.0444"
                />
                <p className="text-xs text-muted-foreground">
                  North/South position
                </p>
              </div>

              <div className="space-y-2">
                <Label>Longitude</Label>
                <Input
                  value={settings.map_longitude}
                  onChange={(e) =>
                    setSettings({ ...settings, map_longitude: e.target.value })
                  }
                  placeholder="e.g., 31.2357"
                />
                <p className="text-xs text-muted-foreground">
                  East/West position
                </p>
              </div>

              <div className="space-y-2">
                <Label>Zoom Level</Label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={settings.map_zoom}
                  onChange={(e) =>
                    setSettings({ ...settings, map_zoom: e.target.value })
                  }
                  placeholder="e.g., 15"
                />
                <p className="text-xs text-muted-foreground">
                  1 (far) to 20 (close)
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Map Marker Title</Label>
              <Input
                value={settings.map_marker_title}
                onChange={(e) =>
                  setSettings({ ...settings, map_marker_title: e.target.value })
                }
                placeholder="e.g., Cairo International Exhibition Center"
              />
              <p className="text-sm text-muted-foreground">
                Text shown when hovering over the map pin
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Google Maps Embed */}
        <Card>
          <CardHeader>
            <CardTitle>Google Maps Embed URL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>How to get embed URL:</strong>
                <ol className="list-decimal ml-4 mt-2 space-y-1">
                  <li>Go to Google Maps and search for your location</li>
                  <li>Click "Share" button</li>
                  <li>Click "Embed a map" tab</li>
                  <li>Copy the URL from the iframe src attribute</li>
                  <li>Paste it below</li>
                </ol>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label>Google Maps Embed URL</Label>
              <Textarea
                value={settings.map_embed_url}
                onChange={(e) =>
                  setSettings({ ...settings, map_embed_url: e.target.value })
                }
                placeholder="https://www.google.com/maps/embed?pb=..."
                rows={4}
              />
              <p className="text-sm text-muted-foreground">
                Paste the full embed URL from Google Maps
              </p>
            </div>

            {settings.map_embed_url && (
              <div className="space-y-2">
                <Label>Map Preview</Label>
                <div className="border rounded-lg overflow-hidden">
                  <iframe
                    src={settings.map_embed_url}
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} size="lg">
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save All Changes"}
          </Button>
        </div>

        {/* Help Section */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Info className="h-5 w-5" />
              Quick Tips
            </h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>• <strong>Event Location:</strong> Short venue name (e.g., "Cairo International Exhibition Center")</li>
              <li>• <strong>Address:</strong> Full address with street, city, country</li>
              <li>• <strong>Coordinates:</strong> Get from Google Maps by right-clicking on location</li>
              <li>• <strong>Zoom Level:</strong> 15 is good for buildings, 12 for neighborhoods, 10 for cities</li>
              <li>• <strong>Embed URL:</strong> Use Google Maps Share → Embed a map feature</li>
              <li>• Changes appear immediately on the website after saving</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminLocation;
