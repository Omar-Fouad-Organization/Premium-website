import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save } from "lucide-react";

interface Package {
  id: string;
  package_type: string;
  name: string;
  price: string;
  features: string[];
  is_popular: boolean;
  display_order: number;
  is_active: boolean;
}

const AdminPackages = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    const { data, error } = await supabase
      .from("packages_premium_20251225")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load packages",
        variant: "destructive",
      });
    } else {
      setPackages(data || []);
    }
    setLoading(false);
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingPackage) return;

    const { error } = await supabase
      .from("packages_premium_20251225")
      .update({
        name: editingPackage.name,
        price: editingPackage.price,
        features: editingPackage.features,
        is_popular: editingPackage.is_popular,
        display_order: editingPackage.display_order,
        is_active: editingPackage.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editingPackage.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update package",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Package updated successfully",
      });
      loadPackages();
      setIsDialogOpen(false);
      setEditingPackage(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;

    const { error } = await supabase
      .from("packages_premium_20251225")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete package",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Package deleted successfully",
      });
      loadPackages();
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    if (!editingPackage) return;
    const newFeatures = [...editingPackage.features];
    newFeatures[index] = value;
    setEditingPackage({ ...editingPackage, features: newFeatures });
  };

  const addFeature = () => {
    if (!editingPackage) return;
    setEditingPackage({
      ...editingPackage,
      features: [...editingPackage.features, ""],
    });
  };

  const removeFeature = (index: number) => {
    if (!editingPackage) return;
    const newFeatures = editingPackage.features.filter((_, i) => i !== index);
    setEditingPackage({ ...editingPackage, features: newFeatures });
  };

  const getPackagesByType = (type: string) => {
    return packages.filter((p) => p.package_type === type);
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
          <h1 className="text-3xl font-bold">Packages Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage exhibitor and sponsor packages
          </p>
        </div>

        <Tabs defaultValue="exhibitor" className="space-y-6">
          <TabsList>
            <TabsTrigger value="exhibitor">Exhibitor Packages</TabsTrigger>
            <TabsTrigger value="sponsor">Sponsor Packages</TabsTrigger>
          </TabsList>

          <TabsContent value="exhibitor" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getPackagesByType("exhibitor").map((pkg) => (
                <Card key={pkg.id} className={pkg.is_popular ? "border-2 border-primary" : ""}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{pkg.name}</span>
                      {pkg.is_popular && (
                        <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                          Popular
                        </span>
                      )}
                    </CardTitle>
                    <p className="text-2xl font-bold text-primary">{pkg.price}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2 text-sm">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx}>• {feature}</li>
                      ))}
                    </ul>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEdit(pkg)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(pkg.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sponsor" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getPackagesByType("sponsor").map((pkg) => (
                <Card key={pkg.id} className={pkg.is_popular ? "border-2 border-primary" : ""}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{pkg.name}</span>
                      {pkg.is_popular && (
                        <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                          Popular
                        </span>
                      )}
                    </CardTitle>
                    <p className="text-2xl font-bold text-primary">{pkg.price}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2 text-sm">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx}>• {feature}</li>
                      ))}
                    </ul>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEdit(pkg)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(pkg.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Package</DialogTitle>
            </DialogHeader>
            {editingPackage && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Package Name</Label>
                  <Input
                    value={editingPackage.name}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input
                    value={editingPackage.price}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, price: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Features</Label>
                  {editingPackage.features.map((feature, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => handleFeatureChange(idx, e.target.value)}
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFeature(idx)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addFeature}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Feature
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_popular"
                    checked={editingPackage.is_popular}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, is_popular: e.target.checked })
                    }
                  />
                  <Label htmlFor="is_popular">Mark as Popular</Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={editingPackage.is_active}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, is_active: e.target.checked })
                    }
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>

                <Button onClick={handleSave} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminPackages;
