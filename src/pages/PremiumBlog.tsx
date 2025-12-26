import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PremiumHeader from "@/components/PremiumHeader";
import PremiumFooter from "@/components/PremiumFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, User, Search, BookOpen, ArrowRight } from "lucide-react";

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

const PremiumBlog = () => {
  const { language, t } = useLanguage();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    loadBlogs();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [searchQuery, selectedCategory, blogs, language]);

  const loadBlogs = async () => {
    const { data, error } = await supabase
      .from("blogs_premium_20251226")
      .select("*")
      .eq("is_published", true)
      .order("published_date", { ascending: false });

    if (!error && data) {
      setBlogs(data);
      setFilteredBlogs(data);
    }
    setLoading(false);
  };

  const filterBlogs = () => {
    let filtered = [...blogs];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((blog) => {
        const title = language === "ar" ? blog.title_ar : blog.title;
        const excerpt = language === "ar" ? blog.excerpt_ar : blog.excerpt;
        const searchLower = searchQuery.toLowerCase();
        return (
          title?.toLowerCase().includes(searchLower) ||
          excerpt?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((blog) => blog.category === selectedCategory);
    }

    setFilteredBlogs(filtered);
  };

  const getCategories = () => {
    const categories = blogs.map((blog) => blog.category);
    return ["all", ...Array.from(new Set(categories))];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryName = (category: string) => {
    if (category === "all") return language === "ar" ? "الكل" : "All";
    const blog = blogs.find((b) => b.category === category);
    return language === "ar" ? blog?.category_ar : blog?.category;
  };

  return (
    <div className="min-h-screen bg-background">
      <PremiumHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <BookOpen className="h-4 w-4" />
              <span>{t("blog")}</span>
            </div>
            
            <h1 className="text-premium-heading mb-6">
              {language === "ar" ? "مدونة الحياة الخضراء" : "Green Life Blog"}
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              {language === "ar"
                ? "اكتشف أحدث الأفكار والنصائح والقصص حول الحياة المستدامة والابتكار الأخضر"
                : "Discover the latest insights, tips, and stories about sustainable living and green innovation"}
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="section-premium bg-white">
        <div className="container-premium">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-12">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={language === "ar" ? "ابحث في المدونة..." : "Search blog..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap">
                {getCategories().map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {getCategoryName(category)}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Blog Grid */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-xl text-muted-foreground">
                  {language === "ar" ? "لم يتم العثور على مقالات" : "No blog posts found"}
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBlogs.map((blog) => (
                  <Card
                    key={blog.id}
                    className="overflow-hidden hover-lift group cursor-pointer border-2"
                  >
                    <Link to={`/blog/${blog.slug}`}>
                      {/* Cover Image */}
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={blog.cover_image_url}
                          alt={language === "ar" ? blog.title_ar : blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <CardContent className="p-6">
                        {/* Category Badge */}
                        <Badge className="mb-3">
                          {language === "ar" ? blog.category_ar : blog.category}
                        </Badge>

                        {/* Title */}
                        <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {language === "ar" ? blog.title_ar : blog.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {language === "ar" ? blog.excerpt_ar : blog.excerpt}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{language === "ar" ? blog.author_ar : blog.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(blog.published_date)}</span>
                          </div>
                        </div>

                        {/* Read More */}
                        <div className="flex items-center gap-2 text-primary font-medium mt-4 group-hover:gap-3 transition-all">
                          <span>{language === "ar" ? "اقرأ المزيد" : "Read More"}</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <PremiumFooter />
    </div>
  );
};

export default PremiumBlog;
