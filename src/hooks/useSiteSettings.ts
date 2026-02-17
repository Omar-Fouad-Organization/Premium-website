import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  setting_type: string;
  category: string;
  description: string;
}

export const useSiteSettings = (category?: string) => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    loadSettings();
  }, [category, language]);

  const loadSettings = async () => {
    let query = supabase
      .from("site_settings_premium_20251225")
      .select("*");

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (!error && data) {
      const settingsMap: Record<string, string> = {};
      data.forEach((item: SiteSetting) => {
        // For multilingual support, check if there's a language-specific version
        const langKey = language === "ar" ? `${item.setting_key}_ar` : item.setting_key;
        const langSetting = data.find(s => s.setting_key === langKey);
        
        settingsMap[item.setting_key] = langSetting?.setting_value || item.setting_value || '';
      });
      setSettings(settingsMap);
    }
    setLoading(false);
  };

  const get = (key: string, fallback: string = "") => {
    return settings[key] || fallback;
  };

  const refresh = () => {
    setLoading(true);
    loadSettings();
  };

  return { settings, get, loading, refresh };
};