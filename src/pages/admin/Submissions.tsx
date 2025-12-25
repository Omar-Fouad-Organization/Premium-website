import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, Calendar, CheckCircle2 } from "lucide-react";

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  submission_type: string;
  status: string;
  created_at: string;
}

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    const { data, error } = await supabase
      .from("contact_submissions_premium_20251225")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load submissions",
        variant: "destructive",
      });
    } else {
      setSubmissions(data || []);
    }
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from("contact_submissions_premium_20251225")
      .update({ status: "read" })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Marked as read",
      });
      loadSubmissions();
    }
  };

  const getSubmissionsByType = (type: string) => {
    return submissions.filter((s) => s.submission_type === type);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const SubmissionCard = ({ submission }: { submission: Submission }) => (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{submission.name}</h3>
              {submission.subject && (
                <p className="text-sm text-muted-foreground">{submission.subject}</p>
              )}
            </div>
            <Badge variant={submission.status === "new" ? "default" : "secondary"}>
              {submission.status}
            </Badge>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <a href={`mailto:${submission.email}`} className="hover:underline">
                {submission.email}
              </a>
            </div>
            {submission.phone && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <a href={`tel:${submission.phone}`} className="hover:underline">
                  {submission.phone}
                </a>
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {formatDate(submission.created_at)}
            </div>
          </div>

          <div className="pt-3 border-t">
            <p className="text-sm whitespace-pre-wrap">{submission.message}</p>
          </div>

          {submission.status === "new" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAsRead(submission.id)}
              className="w-full"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark as Read
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

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
          <h1 className="text-3xl font-bold">Form Submissions</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all form submissions from your website
          </p>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">
              All ({submissions.length})
            </TabsTrigger>
            <TabsTrigger value="contact">
              Contact ({getSubmissionsByType("contact").length})
            </TabsTrigger>
            <TabsTrigger value="exhibitor">
              Exhibitors ({getSubmissionsByType("exhibitor").length})
            </TabsTrigger>
            <TabsTrigger value="sponsor">
              Sponsors ({getSubmissionsByType("sponsor").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {submissions.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No submissions yet</p>
                </CardContent>
              </Card>
            ) : (
              submissions.map((submission) => (
                <SubmissionCard key={submission.id} submission={submission} />
              ))
            )}
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            {getSubmissionsByType("contact").length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No contact submissions yet</p>
                </CardContent>
              </Card>
            ) : (
              getSubmissionsByType("contact").map((submission) => (
                <SubmissionCard key={submission.id} submission={submission} />
              ))
            )}
          </TabsContent>

          <TabsContent value="exhibitor" className="space-y-4">
            {getSubmissionsByType("exhibitor").length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No exhibitor applications yet</p>
                </CardContent>
              </Card>
            ) : (
              getSubmissionsByType("exhibitor").map((submission) => (
                <SubmissionCard key={submission.id} submission={submission} />
              ))
            )}
          </TabsContent>

          <TabsContent value="sponsor" className="space-y-4">
            {getSubmissionsByType("sponsor").length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No sponsor inquiries yet</p>
                </CardContent>
              </Card>
            ) : (
              getSubmissionsByType("sponsor").map((submission) => (
                <SubmissionCard key={submission.id} submission={submission} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSubmissions;
