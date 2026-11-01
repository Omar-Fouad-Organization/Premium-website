import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/integrations/api/client";

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
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("en");
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeLanguage();
  }, []);

  const initializeLanguage = async () => {
    // Check localStorage first for user preference
    const savedLang = localStorage.getItem("preferred_language") as Language;

    if (savedLang && (savedLang === "en" || savedLang === "ar")) {
      setLanguageState(savedLang);
      applyLanguage(savedLang);
    } else {
      // Load default from database
      const { data } = await api
        .from("site_settings")
        .select("setting_value")
        .eq("setting_key", "site_language")
        .single();

      if (data?.setting_value) {
        const dbLang = data.setting_value as Language;
        setLanguageState(dbLang);
        applyLanguage(dbLang);
      }
    }

    // Load translations
    await loadTranslations();
    setLoading(false);
  };

  const loadTranslations = async () => {
    const { data } = await api
      .from("translations")
      .select("*");

    if (data) {
      setTranslations(data);
    }
  };

  const applyLanguage = (lang: Language) => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    applyLanguage(lang);
    localStorage.setItem("preferred_language", lang);
  };

  const t = (key: string, fallback?: string): string => {
    const translation = translations.find((t) => t.translation_key === key);
    if (!translation) return fallback || key;
    return language === "ar" ? translation.arabic_text : translation.english_text;
  };

  const isRTL = language === "ar";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL, translations, loading }}>
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
