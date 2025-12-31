import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  Users, 
  Building, 
  MapPin, 
  Tag, 
  ToggleLeft, 
  ToggleRight,
  Download,
  FileSpreadsheet,
  Eye,
  EyeOff
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  title: string | null;
  country: string | null;
  country_code: string | null;
  inquiry_type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface VisitorRegistration {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  job_title: string | null;
  country: string | null;
  interests: string[] | null;
  visit_date: string | null;
  how_heard: string | null;
  is_read: boolean;
  created_at: string;
}

const AdminSubmissions = () => {
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [visitorRegistrations, setVisitorRegistrations] = useState<VisitorRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [visitorRegEnabled, setVisitorRegEnabled] = useState(true);
  const [closedMessageEn, setClosedMessageEn] = useState("");
  const [closedMessageAr, setClosedMessageAr] = useState("");
  const [activeTab, setActiveTab] = useState("contact");
  const [submissionCounts, setSubmissionCounts] = useState({
    contact: 0,
    visitors: 0,
    exhibitors: 0,
    sponsors: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadSubmissions();
    loadVisitorSettings();
  }, []);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      // Load contact submissions
      const { data: contactData, error: contactError } = await supabase
        .from("contact_submissions_premium_20251225")
        .select("*")
        .order("created_at", { ascending: false });

      if (contactError) throw contactError;
      setContactSubmissions(contactData || []);

      // Load visitor registrations
      const { data: visitorData, error: visitorError } = await supabase
        .from("visitor_registrations_premium_20251225")
        .select("*")
        .order("created_at", { ascending: false });

      if (visitorError) throw visitorError;
      setVisitorRegistrations(visitorData || []);

      // Update counts
      setSubmissionCounts({
        contact: contactData?.length || 0,
        visitors: visitorData?.length || 0,
        exhibitors: contactData?.filter(s => s.inquiry_type === "exhibitor").length || 0,
        sponsors: contactData?.filter(s => s.inquiry_type === "sponsor").length || 0
      });

    } catch (error: any) {
      toast({
        title: "Error loading submissions",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadVisitorSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings_premium_20251225")
        .select("setting_key, setting_value")
        .in("setting_key", [
          "visitor_registration_enabled",
          "visitor_registration_closed_message",
          "visitor_registration_closed_message_ar"
        ]);

      if (error) throw error;

      const settings: any = {};
      data?.forEach((item) => {
        settings[item.setting_key] = item.setting_value;
      });

      setVisitorRegEnabled(settings.visitor_registration_enabled === "true");
      setClosedMessageEn(settings.visitor_registration_closed_message || "");
      setClosedMessageAr(settings.visitor_registration_closed_message_ar || "");
    } catch (error: any) {
      console.error("Error loading visitor settings:", error);
    }
  };

  const toggleReadStatus = async (type: "contact" | "visitor", id: string, currentStatus: boolean) => {
    try {
      const table = type === "contact" 
        ? "contact_submissions_premium_20251225" 
        : "visitor_registrations_premium_20251225";

      const { error } = await supabase
        .from(table)
        .update({ is_read: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      // Update local state
      if (type === "contact") {
        setContactSubmissions(prev =>
          prev.map(sub => sub.id === id ? { ...sub, is_read: !currentStatus } : sub)
        );
      } else {
        setVisitorRegistrations(prev =>
          prev.map(sub => sub.id === id ? { ...sub, is_read: !currentStatus } : sub)
        );
      }

      toast({
        title: "Success",
        description: `Submission marked as ${!currentStatus ? "read" : "unread"}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const downloadExcel = (type: "contact" | "visitors" | "exhibitors" | "sponsors") => {
    let data: any[] = [];
    let filename = "";

    switch (type) {
      case "contact":
        data = contactSubmissions.map(sub => ({
          "Name": sub.name || "",
          "Email": sub.email || "",
          "Phone": sub.phone || "",
          "Company": sub.company || "",
          "Title": sub.title || "",
          "Country": sub.country || "",
          "Country Code": sub.country_code || "",
          "Inquiry Type": sub.inquiry_type || "",
          "Message": sub.message || "",
          "Read Status": sub.is_read ? "Read" : "Unread",
          "Submitted Date": new Date(sub.created_at).toLocaleDateString(),
          "Submitted Time": new Date(sub.created_at).toLocaleTimeString()
        }));
        filename = "contact_submissions.csv";
        break;

      case "visitors":
        data = visitorRegistrations.map(sub => ({
          "Name": sub.name || "",
          "Email": sub.email || "",
          "Phone": sub.phone || "",
          "Company": sub.company || "",
          "Job Title": sub.job_title || "",
          "Country": sub.country || "",
          "Interests": Array.isArray(sub.interests) ? sub.interests.join("; ") : "",
          "Visit Date": sub.visit_date || "",
          "How Heard": sub.how_heard || "",
          "Read Status": sub.is_read ? "Read" : "Unread",
          "Registration Date": new Date(sub.created_at).toLocaleDateString(),
          "Registration Time": new Date(sub.created_at).toLocaleTimeString()
        }));
        filename = "visitor_registrations.csv";
        break;

      case "exhibitors":
        data = contactSubmissions
          .filter(sub => sub.inquiry_type === "exhibitor")
          .map(sub => ({
            "Name": sub.name || "",
            "Email": sub.email || "",
            "Phone": sub.phone || "",
            "Company": sub.company || "",
            "Title": sub.title || "",
            "Country": sub.country || "",
            "Country Code": sub.country_code || "",
            "Message": sub.message || "",
            "Read Status": sub.is_read ? "Read" : "Unread",
            "Inquiry Date": new Date(sub.created_at).toLocaleDateString(),
            "Inquiry Time": new Date(sub.created_at).toLocaleTimeString()
          }));
        filename = "exhibitor_inquiries.csv";
        break;

      case "sponsors":
        data = contactSubmissions
          .filter(sub => sub.inquiry_type === "sponsor")
          .map(sub => ({
            "Name": sub.name || "",
            "Email": sub.email || "",
            "Phone": sub.phone || "",
            "Company": sub.company || "",
            "Title": sub.title || "",
            "Country": sub.country || "",
            "Country Code": sub.country_code || "",
            "Message": sub.message || "",
            "Read Status": sub.is_read ? "Read" : "Unread",
            "Inquiry Date": new Date(sub.created_at).toLocaleDateString(),
            "Inquiry Time": new Date(sub.created_at).toLocaleTimeString()
          }));
        filename = "sponsor_inquiries.csv";
        break;
    }

    if (data.length === 0) {
      toast({
        title: "No data",
        description: "No submissions found for this category",
        variant: "destructive",
      });
      return;
    }

    // Create Excel-compatible CSV with proper formatting
    const headers = Object.keys(data[0]);
    
    // Create CSV content with BOM for proper Excel encoding
    const BOM = "\uFEFF";
    const csvRows = [];
    
    // Add headers
    csvRows.push(headers.join(","));
    
    // Add data rows
    data.forEach(row => {
      const values = headers.map(header => {
        let value = row[header] || "";
        
        // Clean and format the value
        value = value.toString().trim();
        
        // Handle special characters and ensure proper CSV formatting
        if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
          // Escape quotes by doubling them
          value = value.replace(/"/g, '""');
          // Wrap in quotes
          value = `"${value}"`;
        } else if (value === "") {
          // Empty values should be empty, not quoted
          value = "";
        } else {
          // For clean values, still wrap in quotes for Excel compatibility
          value = `"${value}"`;
        }
        
        return value;
      });
      csvRows.push(values.join(","));
    });
    
    const csvContent = BOM + csvRows.join("\n");

    // Download file with proper MIME type for Excel
    const blob = new Blob([csvContent], { 
      type: "text/csv;charset=utf-8;" 
    });
    
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: `${filename} downloaded successfully`,
    });
  };

  const updateVisitorSettings = async () => {
    try {
      const updates = [
        {
          setting_key: "visitor_registration_enabled",
          setting_value: visitorRegEnabled.toString(),
          setting_type: "boolean",
          category: "visitor",
          description: "Enable/disable visitor registration"
        },
        {
          setting_key: "visitor_registration_closed_message",
          setting_value: closedMessageEn,
          setting_type: "text",
          category: "visitor",
          description: "Closed message in English"
        },
        {
          setting_key: "visitor_registration_closed_message_ar",
          setting_value: closedMessageAr,
          setting_type: "text",
          category: "visitor",
          description: "Closed message in Arabic"
        }
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from("site_settings_premium_20251225")
          .upsert(update, { onConflict: "setting_key" });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Visitor registration settings updated",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
          <h1 className="text-3xl font-bold">Submissions Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage all website submissions and registrations
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Contact ({submissionCounts.contact})
            </TabsTrigger>
            <TabsTrigger value="visitors" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Visitors ({submissionCounts.visitors})
            </TabsTrigger>
            <TabsTrigger value="exhibitors" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Exhibitors ({submissionCounts.exhibitors})
            </TabsTrigger>
            <TabsTrigger value="sponsors" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Sponsors ({submissionCounts.sponsors})
            </TabsTrigger>
          </TabsList>

          {/* Contact Submissions Tab */}
          <TabsContent value="contact">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Form Submissions ({submissionCounts.contact})
                </CardTitle>
                <Button onClick={() => downloadExcel("contact")} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Excel
                </Button>
              </CardHeader>
              <CardContent>
                {contactSubmissions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No contact submissions yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contactSubmissions.map((submission) => (
                      <div
                        key={submission.id}
                        className={`p-4 border rounded-lg ${
                          submission.is_read ? "bg-muted/30" : "bg-background"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div>
                              <h3 className="font-semibold">{submission.name}</h3>
                              <p className="text-sm text-muted-foreground">{submission.email}</p>
                            </div>
                            <Badge variant={submission.is_read ? "secondary" : "default"}>
                              {submission.inquiry_type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleReadStatus("contact", submission.id, submission.is_read)}
                            >
                              {submission.is_read ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(submission.created_at)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          {submission.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span>{submission.country_code} {submission.phone}</span>
                            </div>
                          )}
                          {submission.company && (
                            <div className="flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              <span>{submission.company}</span>
                            </div>
                          )}
                          {submission.title && (
                            <div className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              <span>{submission.title}</span>
                            </div>
                          )}
                          {submission.country && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{submission.country}</span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                          {submission.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Visitor Registrations Tab */}
          <TabsContent value="visitors">
            <div className="space-y-6">
              {/* Visitor Registration Control */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ToggleLeft className="h-5 w-5" />
                    Visitor Registration Control
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="visitor-registration"
                      checked={visitorRegEnabled}
                      onCheckedChange={setVisitorRegEnabled}
                    />
                    <Label htmlFor="visitor-registration">
                      Enable Visitor Registration
                    </Label>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="closed-message-en">Closed Message (English)</Label>
                      <Textarea
                        id="closed-message-en"
                        value={closedMessageEn}
                        onChange={(e) => setClosedMessageEn(e.target.value)}
                        placeholder="Registration is currently closed..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="closed-message-ar">Closed Message (Arabic)</Label>
                      <Textarea
                        id="closed-message-ar"
                        value={closedMessageAr}
                        onChange={(e) => setClosedMessageAr(e.target.value)}
                        placeholder="التسجيل مغلق حالياً..."
                      />
                    </div>
                  </div>

                  <Button onClick={updateVisitorSettings}>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Update Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Visitor Submissions */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Visitor Registrations ({submissionCounts.visitors})
                  </CardTitle>
                  <Button onClick={() => downloadExcel("visitors")} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Excel
                  </Button>
                </CardHeader>
                <CardContent>
                  {visitorRegistrations.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No visitor registrations yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {visitorRegistrations.map((registration) => (
                        <div
                          key={registration.id}
                          className={`p-4 border rounded-lg ${
                            registration.is_read ? "bg-muted/30" : "bg-background"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold">{registration.name}</h3>
                              <p className="text-sm text-muted-foreground">{registration.email}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleReadStatus("visitor", registration.id, registration.is_read)}
                              >
                                {registration.is_read ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(registration.created_at)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            {registration.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                <span>{registration.phone}</span>
                              </div>
                            )}
                            {registration.company && (
                              <div className="flex items-center gap-1">
                                <Building className="h-3 w-3" />
                                <span>{registration.company}</span>
                              </div>
                            )}
                            {registration.job_title && (
                              <div className="flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                <span>{registration.job_title}</span>
                              </div>
                            )}
                            {registration.country && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{registration.country}</span>
                              </div>
                            )}
                            {registration.visit_date && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{registration.visit_date}</span>
                              </div>
                            )}
                            {registration.interests && registration.interests.length > 0 && (
                              <div className="col-span-2">
                                <span className="text-xs font-medium">Interests: </span>
                                <span className="text-xs">{registration.interests.join(", ")}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Exhibitor Inquiries Tab */}
          <TabsContent value="exhibitors">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Exhibitor Inquiries ({submissionCounts.exhibitors})
                </CardTitle>
                <Button onClick={() => downloadExcel("exhibitors")} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Excel
                </Button>
              </CardHeader>
              <CardContent>
                {contactSubmissions.filter(s => s.inquiry_type === "exhibitor").length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No exhibitor inquiries yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contactSubmissions
                      .filter(submission => submission.inquiry_type === "exhibitor")
                      .map((submission) => (
                        <div
                          key={submission.id}
                          className={`p-4 border rounded-lg ${
                            submission.is_read ? "bg-muted/30" : "bg-background"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold">{submission.name}</h3>
                              <p className="text-sm text-muted-foreground">{submission.email}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleReadStatus("contact", submission.id, submission.is_read)}
                              >
                                {submission.is_read ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(submission.created_at)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                            {submission.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                <span>{submission.country_code} {submission.phone}</span>
                              </div>
                            )}
                            {submission.company && (
                              <div className="flex items-center gap-1">
                                <Building className="h-3 w-3" />
                                <span>{submission.company}</span>
                              </div>
                            )}
                            {submission.title && (
                              <div className="flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                <span>{submission.title}</span>
                              </div>
                            )}
                            {submission.country && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{submission.country}</span>
                              </div>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                            {submission.message}
                          </p>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sponsor Inquiries Tab */}
          <TabsContent value="sponsors">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Sponsor Inquiries ({submissionCounts.sponsors})
                </CardTitle>
                <Button onClick={() => downloadExcel("sponsors")} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Excel
                </Button>
              </CardHeader>
              <CardContent>
                {contactSubmissions.filter(s => s.inquiry_type === "sponsor").length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No sponsor inquiries yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contactSubmissions
                      .filter(submission => submission.inquiry_type === "sponsor")
                      .map((submission) => (
                        <div
                          key={submission.id}
                          className={`p-4 border rounded-lg ${
                            submission.is_read ? "bg-muted/30" : "bg-background"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold">{submission.name}</h3>
                              <p className="text-sm text-muted-foreground">{submission.email}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleReadStatus("contact", submission.id, submission.is_read)}
                              >
                                {submission.is_read ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(submission.created_at)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                            {submission.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                <span>{submission.country_code} {submission.phone}</span>
                              </div>
                            )}
                            {submission.company && (
                              <div className="flex items-center gap-1">
                                <Building className="h-3 w-3" />
                                <span>{submission.company}</span>
                              </div>
                            )}
                            {submission.title && (
                              <div className="flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                <span>{submission.title}</span>
                              </div>
                            )}
                            {submission.country && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{submission.country}</span>
                              </div>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                            {submission.message}
                          </p>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSubmissions;