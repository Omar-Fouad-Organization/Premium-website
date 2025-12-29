import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PremiumHeader from "@/components/PremiumHeader";
import PremiumFooter from "@/components/PremiumFooter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, User, ArrowLeft, Share2, BookOpen } from "lucide-react";

interface Blog {
  id: string;
  title: string;
  title_ar: string;
  slug: string;
  excerpt: string;
  excerpt_ar: string;
  content: string;
  content_ar: string;
  cover_image_url: string;
  author: string;
  author_ar: string;
  category: string;
  category_ar: string;
  published_date: string;
}

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language, t, isRTL } = useLanguage();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadBlog();
    }
  }, [slug]);

  const loadBlog = async () => {
    setLoading(true);
    
    // Load the main blog
    const { data: blogData, error: blogError } = await supabase
      .from("blogs_premium_20251226")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (blogError) {
      console.error("Error loading blog:", blogError);
      setLoading(false);
      return;
    }

    setBlog(blogData);

    // Load related blogs (same category, excluding current blog)
    if (blogData) {
      const { data: relatedData } = await supabase
        .from("blogs_premium_20251226")
        .select("*")
        .eq("category", blogData.category)
        .eq("is_published", true)
        .neq("id", blogData.id)
        .limit(3)
        .order("published_date", { ascending: false });

      setRelatedBlogs(relatedData || []);
    }

    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return language === "ar" 
      ? date.toLocaleDateString("ar-EG", { 
          year: "numeric", 
          month: "long", 
          day: "numeric" 
        })
      : date.toLocaleDateString("en-US", { 
          year: "numeric", 
          month: "long", 
          day: "numeric" 
        });
  };

  const handleShare = async () => {
    if (navigator.share && blog) {
      try {
        await navigator.share({
          title: language === "ar" ? blog.title_ar : blog.title,
          text: language === "ar" ? blog.excerpt_ar : blog.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <PremiumHeader />
        <div className="flex items-center justify-center h-64 pt-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <PremiumFooter />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background">
        <PremiumHeader />
        <div className="pt-32 pb-20 text-center">
          <div className="container-premium">
            <h1 className="text-4xl font-bold mb-4">Blog Not Found</h1>
            <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </div>
        <PremiumFooter />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}>
      <PremiumHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Button variant="ghost" asChild className="mb-6">
              <Link to="/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {language === "ar" ? "العودة إلى المدونة" : "Back to Blog"}
              </Link>
            </Button>

            {/* Category Badge */}
            <Badge className="mb-4">
              {language === "ar" ? blog.category_ar : blog.category}
            </Badge>

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {language === "ar" ? blog.title_ar : blog.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{language === "ar" ? blog.author_ar : blog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(blog.published_date)}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                {language === "ar" ? "مشاركة" : "Share"}
              </Button>
            </div>

            {/* Excerpt */}
            <p className="text-xl text-muted-foreground leading-relaxed">
              {language === "ar" ? blog.excerpt_ar : blog.excerpt}
            </p>
          </div>
        </div>
      </section>

      {/* Cover Image */}
      <section className="pb-12">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-xl">
              <img
                src={blog.cover_image_url}
                alt={language === "ar" ? blog.title_ar : blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="pb-20">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: language === "ar" ? blog.content_ar : blog.content 
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <section className="pb-20 bg-muted/30">
          <div className="container-premium">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                {language === "ar" ? "مقالات ذات صلة" : "Related Articles"}
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedBlogs.map((relatedBlog) => (
                  <Link
                    key={relatedBlog.id}
                    to={`/blog/${relatedBlog.slug}`}
                    className="group"
                  >
                    <div className="card-premium hover-lift group">
                      {/* Cover Image */}
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={relatedBlog.cover_image_url}
                          alt={language === "ar" ? relatedBlog.title_ar : relatedBlog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="p-6">
                        {/* Category Badge */}
                        <Badge className="mb-3">
                          {language === "ar" ? relatedBlog.category_ar : relatedBlog.category}
                        </Badge>

                        {/* Title */}
                        <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {language === "ar" ? relatedBlog.title_ar : relatedBlog.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {language === "ar" ? relatedBlog.excerpt_ar : relatedBlog.excerpt}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{language === "ar" ? relatedBlog.author_ar : relatedBlog.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(relatedBlog.published_date)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-12">
                <Button asChild variant="outline" size="lg">
                  <Link to="/blog">
                    <BookOpen className="h-4 w-4 mr-2" />
                    {language === "ar" ? "عرض جميع المقالات" : "View All Articles"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      <PremiumFooter />
    </div>
  );
};

export default BlogDetail;