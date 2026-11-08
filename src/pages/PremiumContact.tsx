import RegistrationForm from "@/components/RegistrationForm";
import { useState, useEffect } from "react";
import PremiumHeader from "@/components/PremiumHeader";
import PremiumFooter from "@/components/PremiumFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/integrations/api/client";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";
import { useLanguage } from "@/contexts/LanguageContext";

const PremiumContact = () => {
  const { get, loading } = usePageContent("contact");
  const { t, isRTL } = useLanguage();

  // Scroll to top of page on load if coming from a redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('scrollToForm') === 'true') {
      // Scroll to the very top of the page
      const scrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      };

      // Try immediately
      scrollToTop();

      // Clear the URL parameter after scrolling
      setTimeout(() => {
        const newUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, newUrl);
      }, 1000);
    }
  }, []);

  const [contactSettings, setContactSettings] = useState({
    contact_email: "info@greenlifeexpo.com",
    contact_phone: "+20 123 456 7890",
    contact_address: "Cairo International Convention Center, El Nasr Road, Nasr City, Cairo, Egypt",
  });

  const [mapSettings, setMapSettings] = useState({
    map_embed_url: "",
    event_location: "Cairo International Convention Center",
    map_latitude: "30.0444",
    map_longitude: "31.2357",
    map_zoom: "15",
  });

useEffect(() => {
    loadContactSettings();
  }, []);

  const loadContactSettings = async () => {
    try {
      // Load contact settings
      const { data, error } = await api
        .from("site_settings")
        .select("setting_key, setting_value")
        .in("setting_key", ["contact_email", "contact_phone", "contact_address"]);

      if (error) {
        console.error("Error loading contact settings:", error);
      } else if (data) {
        const settingsObj: any = {};
        data.forEach((item) => {
          settingsObj[item.setting_key] = item.setting_value || "";
        });
        setContactSettings((prev) => ({ ...prev, ...settingsObj }));
      }

      // Load map settings
      const { data: mapData, error: mapError } = await api
        .from("site_settings")
        .select("setting_key, setting_value")
        .in("setting_key", ["map_embed_url", "event_location", "map_latitude", "map_longitude", "map_zoom"]);

      if (mapError) {
        console.error("Error loading map settings:", mapError);
      } else if (mapData) {
        const mapSettingsObj: any = {};
        mapData.forEach((item) => {
          mapSettingsObj[item.setting_key] = item.setting_value || "";
        });
        setMapSettings((prev) => ({ ...prev, ...mapSettingsObj }));
      }
    } catch (err) {
      console.error("Error in loadContactSettings:", err);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: contactSettings.contact_email ? [contactSettings.contact_email] : ["info@greenlifeexpo.com"],
    },
    {
      icon: Phone,
      title: "Call Us",
      details: contactSettings.contact_phone ? [contactSettings.contact_phone] : ["+20 123 456 7890"],
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: contactSettings.contact_address ? contactSettings.contact_address.split(",").map((s: string) => s.trim()) : ["Cairo International Convention Center", "El Nasr Road, Nasr City, Cairo, Egypt"],
    },
  ];

  const trustSignals = [
    "Response within 24 hours",
    "Dedicated account manager",
    "Custom solutions available",
    "Flexible partnership terms",
  ];

  return (
    <div className="min-h-screen bg-background">
      <PremiumHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-premium-heading mb-6">
              {get("contact_page_title", "Let's Start a Conversation")}
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              {get("contact_page_subtitle", "Whether you're interested in exhibiting, sponsoring, or visiting, our team is here to help you make the most of Green Life Expo.")}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section id="contact-form" className="section-premium bg-white" style={{ scrollMarginTop: '2rem' }}>
        <div className="container-premium">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="card-premium">
                <h2 className="text-2xl font-semibold mb-6">{get("form_title", "Send Us a Message")}</h2>

                <RegistrationForm kind="contact"/>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="card-premium">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <info.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-3">{info.title}</h3>
                  <div className="space-y-2">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-sm text-muted-foreground">
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              {/* Trust Signals */}
              <div className="card-premium bg-primary/5">
                <h3 className="font-semibold mb-4">Why Contact Us?</h3>
                <ul className="space-y-3">
                  {trustSignals.map((signal, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{signal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section-premium bg-muted/30">
        <div className="container-premium">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-premium-heading mb-6">
              Find Us
            </h2>
            <p className="text-lg text-muted-foreground">
              {mapSettings.event_location || contactSettings.contact_address}
            </p>
          </div>

          <div className="aspect-video rounded-2xl overflow-hidden shadow-xl">
            <iframe
              src={mapSettings.map_embed_url || `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452.6789!2d${mapSettings.map_longitude}!3d${mapSettings.map_latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${btoa(mapSettings.map_latitude + ',' + mapSettings.map_longitude)}!5e0!3m2!1sen!2seg!4v${Date.now()}&zoom=${mapSettings.map_zoom || 15}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <PremiumFooter />
    </div>
  );
};

export default PremiumContact;
