import { useEffect } from "react";
import { api } from "@/integrations/api/client";

const FaviconLoader = () => {
  useEffect(() => {
    loadFavicon();
  }, []);

  const loadFavicon = async () => {
    try {
      const { data } = await api
        .from("site_settings")
        .select("setting_value")
      .eq("setting_key", "favicon_url")
        .limit(1)
        .single();

      if (data?.setting_value) {
        updateFavicon(data.setting_value);
      }
    } catch (error) {
      console.error("Error loading favicon:", error);
    }
  };

  const updateFavicon = (url: string) => {
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = url;
  };

  return null;
};

export default FaviconLoader;
