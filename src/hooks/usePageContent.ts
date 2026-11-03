import { useEffect, useState } from "react";
import { api } from "@/integrations/api/client";
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
    const { data, error } = await api
      .from("page_content")
      .select("*")
      .eq("page_name", pageName);

    if (!error && data) {
      const contentMap: Record<string, string> = {};
      data.forEach((item: PageContent) => {
        const value = language === "ar" && item.content_value_ar
          ? item.content_value_ar
          : item.content_value;
        contentMap[item.section_name + '.' + item.content_key] = value;
        contentMap[item.section_name + '_' + item.content_key] = value;
        // Bare keys are available only when unambiguous within this page.
        if (data.filter((other: PageContent) => other.content_key === item.content_key).length === 1) {
          contentMap[item.content_key] = value;
        }
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
