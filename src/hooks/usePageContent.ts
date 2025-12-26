import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface PageContent {
  page_name: string;
  section_name: string;
  content_key: string;
  content_value: string;
  content_value_ar: string;
  content_type: string;
}

export const usePageContent = (pageName: string) => {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    loadContent();
  }, [pageName, language]);

  const loadContent = async () => {
    const { data, error } = await supabase
      .from("page_content_premium_20251225")
      .select("*")
      .eq("page_name", pageName);

    if (!error && data) {
      const contentMap: Record<string, string> = {};
      data.forEach((item: PageContent) => {
        const value = language === "ar" && item.content_value_ar 
          ? item.content_value_ar 
          : item.content_value;
        contentMap[item.content_key] = value;
      });
      setContent(contentMap);
    }
    setLoading(false);
  };

  const get = (key: string, fallback: string = "") => {
    return content[key] || fallback;
  };

  return { content, get, loading };
};
