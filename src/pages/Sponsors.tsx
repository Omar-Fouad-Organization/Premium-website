import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle2, Megaphone, Users2, Award, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Sponsors = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    sponsorshipLevel: "",
    message: "",
  });

  const benefits = [
    {
      icon: <Megaphone className="h-8 w-8" />,
      title: "Brand Exposure",
      description: "Prominent logo placement across all marketing materials",
    },
    {
      icon: <Users2 className="h-8 w-8" />,
      title: "Networking Access",
      description: "VIP access to exclusive networking events",
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Recognition",
      description: "Public acknowledgment during opening ceremonies",
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Market Reach",
      description: "Connect with 10,000+ engaged attendees",
    },
  ];

  const packages = [
    {
      name: "Bronze Sponsor",
      price: "$5,000",
      features: [
        "Logo on website",
        "Logo in event catalog",
        "Social media mentions",
        "2 VIP passes",
        "Booth space discount",
      ],
    },
    {
      name: "Silver Sponsor",
      price: "$10,000",
      features: [
        "All Bronze benefits",
        "Logo on event banners",
        "Speaking opportunity",
        "4 VIP passes",
        "Premium booth location",
        "Press release mention",
      ],
    },
    {
      name: "Gold Sponsor",
      price: "$20,000",
      features: [
        "All Silver benefits",
        "Main stage branding",
        "Keynote speaking slot",
        "8 VIP passes",
        "Exclusive networking event",
        "Full page ad in catalog",
        "Dedicated social campaign",
      ],
      popular: true,
    },
    {
      name: "Platinum Sponsor",
      price: "$50,000",
      features: [
        "All Gold benefits",
        "Title sponsor recognition",
        "Opening ceremony speech",
        "15 VIP passes",
        "Custom activation space",
        "Year-round partnership",
        "Exclusive media coverage",
        "Co-branding opportunities",
      ],
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Sponsorship Inquiry Submitted!",
      description: "Our partnerships team will contact you within 24 hours.",
    });
    setFormData({
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      sponsorshipLevel: "",
      message: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-accent to-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold">Become a Sponsor</h1>
            <p className="text-xl text-primary-foreground/90">
              Partner with Egypt's leading green living expo and amplify your brand's impact
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Sponsorship Benefits</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Align your brand with sustainability and reach a highly engaged audience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-2 hover:border-accent transition-colors">
                <CardContent className="p-6 space-y-4">
                  <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center text-accent">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-secondary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Reach</h2>
            <p className="text-lg text-muted-foreground">
              Connect with a diverse and engaged audience
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">Attendees</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Exhibitors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Media Partners</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">100K+</div>
              <div className="text-muted-foreground">Social Reach</div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Sponsorship Packages</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the sponsorship level that aligns with your marketing goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {packages.map((pkg, index) => (
              <Card
                key={index}
                className={`relative ${
                  pkg.popular ? "border-2 border-accent shadow-xl" : "border-2"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                    <p className="text-2xl font-bold text-primary">{pkg.price}</p>
                  </div>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={pkg.popular ? "default" : "outline"} size="sm">
                    Select Package
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-secondary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Get in Touch</h2>
              <p className="text-lg text-muted-foreground">
                Let's discuss how we can create a customized sponsorship package for your brand
              </p>
            </div>

            <Card className="border-2">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      placeholder="Your company name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input
                      id="contactPerson"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      required
                      placeholder="Full name"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+20 123 456 7890"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sponsorshipLevel">Interested Sponsorship Level</Label>
                    <Input
                      id="sponsorshipLevel"
                      name="sponsorshipLevel"
                      value={formData.sponsorshipLevel}
                      onChange={handleChange}
                      placeholder="e.g., Gold Sponsor"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your sponsorship goals and interests"
                      rows={5}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Submit Inquiry
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sponsors;
