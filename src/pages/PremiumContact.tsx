import { useState } from "react";
import PremiumHeader from "@/components/PremiumHeader";
import PremiumFooter from "@/components/PremiumFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";
import { useLanguage } from "@/contexts/LanguageContext";

const countries = [
  { name: "Egypt", code: "+20", nameAr: "مصر" },
  { name: "Saudi Arabia", code: "+966", nameAr: "السعودية" },
  { name: "United Arab Emirates", code: "+971", nameAr: "الإمارات" },
  { name: "Kuwait", code: "+965", nameAr: "الكويت" },
  { name: "Qatar", code: "+974", nameAr: "قطر" },
  { name: "Bahrain", code: "+973", nameAr: "البحرين" },
  { name: "Oman", code: "+968", nameAr: "عمان" },
  { name: "Jordan", code: "+962", nameAr: "الأردن" },
  { name: "Lebanon", code: "+961", nameAr: "لبنان" },
  { name: "Palestine", code: "+970", nameAr: "فلسطين" },
  { name: "Iraq", code: "+964", nameAr: "العراق" },
  { name: "Syria", code: "+963", nameAr: "سوريا" },
  { name: "Morocco", code: "+212", nameAr: "المغرب" },
  { name: "Algeria", code: "+213", nameAr: "الجزائر" },
  { name: "Tunisia", code: "+216", nameAr: "تونس" },
  { name: "Libya", code: "+218", nameAr: "ليبيا" },
  { name: "Sudan", code: "+249", nameAr: "السودان" },
  { name: "Yemen", code: "+967", nameAr: "اليمن" },
  { name: "United States", code: "+1", nameAr: "الولايات المتحدة" },
  { name: "United Kingdom", code: "+44", nameAr: "المملكة المتحدة" },
  { name: "Germany", code: "+49", nameAr: "ألمانيا" },
  { name: "France", code: "+33", nameAr: "فرنسا" },
  { name: "Italy", code: "+39", nameAr: "إيطاليا" },
  { name: "Spain", code: "+34", nameAr: "إسبانيا" },
  { name: "Turkey", code: "+90", nameAr: "تركيا" },
  { name: "China", code: "+86", nameAr: "الصين" },
  { name: "India", code: "+91", nameAr: "الهند" },
  { name: "Pakistan", code: "+92", nameAr: "باكستان" },
  { name: "Bangladesh", code: "+880", nameAr: "بنغلاديش" },
  { name: "Other", code: "+", nameAr: "أخرى" },
];

const PremiumContact = () => {
  const { get, loading } = usePageContent("contact");
  const { t, isRTL } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    title: "",
    country: "",
    country_code: "+20",
    inquiry_type: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase.from("contact_submissions_premium_20251225").insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          title: formData.title,
          country: formData.country,
          country_code: formData.country_code,
          inquiry_type: formData.inquiry_type,
          message: formData.message,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Message Sent Successfully",
        description: "We'll get back to you within 24 hours.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        inquiry_type: "",
        message: "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: ["info@greenlifeexpo.com", "exhibitors@greenlifeexpo.com"],
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+20 123 456 7890", "+20 123 456 7891"],
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["Cairo International Convention Center", "El Nasr Road, Nasr City, Cairo, Egypt"],
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
              Let's Start a Conversation
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Whether you're interested in exhibiting, sponsoring, or visiting, our team is here to help you make the most of Green Life Expo.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section-premium bg-white">
        <div className="container-premium">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="card-premium">
                <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  {/* Company Name */}
                  <div className="space-y-2">
                    <Label htmlFor="company">{get("form_company_label", "Company Name")}</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder={get("form_company_placeholder", "Your Company")}
                    />
                  </div>

                  {/* Title Field */}
                  <div className="space-y-2">
                    <Label htmlFor="title">{get("form_title_label", "Title")}</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder={get("form_title_placeholder", "e.g., CEO, Manager, Director")}
                    />
                  </div>

                  {/* Country Field */}
                  <div className="space-y-2">
                    <Label htmlFor="country">{get("form_country_label", "Country")}</Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) => {
                        const selectedCountry = countries.find(c => c.name === value);
                        setFormData({ 
                          ...formData, 
                          country: value,
                          country_code: selectedCountry?.code || "+20"
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={get("form_country_placeholder", "Select your country")} />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.name}>
                            {isRTL ? country.nameAr : country.name} ({country.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Phone with Country Code */}
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country_code">{get("form_country_code_label", "Code")}</Label>
                      <Input
                        id="country_code"
                        value={formData.country_code}
                        onChange={(e) => setFormData({ ...formData, country_code: e.target.value })}
                        placeholder="+20"
                        className="text-center"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-3">
                      <Label htmlFor="phone_number">{get("form_phone_label", "Phone Number")}</Label>
                      <Input
                        id="phone_number"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder={get("form_phone_placeholder", "123 456 7890")}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inquiry_type">I'm Interested In *</Label>
                    <Select
                      value={formData.inquiry_type}
                      onValueChange={(value) => setFormData({ ...formData, inquiry_type: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="exhibitor">Exhibiting at the Expo</SelectItem>
                        <SelectItem value="sponsor">Sponsorship Opportunities</SelectItem>
                        <SelectItem value="visitor">Visiting the Expo</SelectItem>
                        <SelectItem value="speaker">Speaking Opportunities</SelectItem>
                        <SelectItem value="media">Media Partnership</SelectItem>
                        <SelectItem value="other">Other Inquiry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={6}
                      placeholder="Tell us about your inquiry..."
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitting}
                    className="w-full btn-premium btn-premium-primary"
                  >
                    {submitting ? "Sending..." : "Send Message"}
                    <Send className="ml-2 h-5 w-5" />
                  </Button>
                </form>
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
              Cairo International Convention Center, El Nasr Road, Nasr City, Cairo, Egypt
            </p>
          </div>

          <div className="aspect-video rounded-2xl overflow-hidden shadow-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452.6789!2d31.3!3d30.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAwJzAwLjAiTiAzMcKwMTgnMDAuMCJF!5e0!3m2!1sen!2seg!4v1234567890"
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
