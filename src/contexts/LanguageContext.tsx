import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

type Language = "en" | "ar";

interface Translation {
  translation_key: string;
  english_text: string;
  arabic_text: string;
  category: string;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  isRTL: boolean;
  translations: Translation[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("en");
  const [translations, setTranslations] = useState<Translation[]>([]);

  useEffect(() => {
    loadLanguageSettings();
    loadTranslations();
  }, []);

  const loadLanguageSettings = async () => {
    const { data } = await supabase
      .from("site_settings_premium_20251225")
      .select("setting_value")
      .eq("setting_key", "site_language")
      .single();

    if (data?.setting_value) {
      setLanguageState(data.setting_value as Language);
      // Set HTML dir attribute
      document.documentElement.dir = data.setting_value === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = data.setting_value;
    }
  };

  const loadTranslations = async () => {
    const { data } = await supabase
      .from("translations_premium_20251225")
      .select("*");

    if (data) {
      setTranslations(data);
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    localStorage.setItem("preferred_language", lang);
  };

  const t = (key: string, fallback?: string): string => {
    const translation = translations.find((t) => t.translation_key === key);
    if (!translation) return fallback || key;
    return language === "ar" ? translation.arabic_text : translation.english_text;
  };

  const isRTL = language === "ar";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
