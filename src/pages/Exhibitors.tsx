import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle2, Store, TrendingUp, Users, Award, Calendar, MapPin } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Exhibitors = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    category: "",
    message: "",
  });

  const benefits = [
    {
      icon: <Store className="h-8 w-8" />,
      title: "Premium Booth Space",
      description: "Showcase your products in prime exhibition locations",
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Brand Visibility",
      description: "Reach thousands of potential customers and partners",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Networking Opportunities",
      description: "Connect with industry leaders and decision-makers",
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Marketing Support",
      description: "Benefit from our comprehensive promotional campaigns",
    },
  ];

  const packages = [
    {
      name: "Standard Booth",
      price: "Starting from $2,500",
      features: [
        "9 sqm booth space",
        "Basic booth setup",
        "Company listing in catalog",
        "2 exhibitor passes",
        "WiFi access",
      ],
    },
    {
      name: "Premium Booth",
      price: "Starting from $5,000",
      features: [
        "18 sqm booth space",
        "Premium booth design",
        "Featured listing in catalog",
        "4 exhibitor passes",
        "WiFi access",
        "Marketing materials",
        "Social media promotion",
      ],
      popular: true,
    },
    {
      name: "VIP Booth",
      price: "Starting from $10,000",
      features: [
        "36 sqm booth space",
        "Custom booth design",
        "Premium catalog placement",
        "8 exhibitor passes",
        "WiFi access",
        "Full marketing package",
        "Dedicated account manager",
        "Speaking opportunity",
      ],
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Application Submitted!",
      description: "We'll contact you within 24 hours to discuss your exhibition needs.",
    });
    setFormData({
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      category: "",
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
      <section className="relative bg-gradient-to-br from-primary to-secondary text-primary-foreground py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold">Exhibit With Us</h1>
            <p className="text-xl text-primary-foreground/90">
              Showcase your sustainable products and services to thousands of engaged visitors
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Exhibit at Green Life Expo?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join Egypt's premier green living exhibition and grow your business
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardContent className="p-6 space-y-4">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center text-primary">
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

      {/* Packages Section */}
      <section className="py-20 bg-secondary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Exhibition Packages</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the package that best fits your business needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <Card
                key={index}
                className={`relative ${
                  pkg.popular ? "border-2 border-primary shadow-xl scale-105" : "border-2"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-8 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                    <p className="text-3xl font-bold text-primary">{pkg.price}</p>
                  </div>
                  <ul className="space-y-3">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={pkg.popular ? "default" : "outline"}>
                    Select Package
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-center">Event Details</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold text-lg">Date</h3>
                      <p className="text-muted-foreground">March 15-17, 2025</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold text-lg">Location</h3>
                      <p className="text-muted-foreground">Cairo International Convention Center</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 bg-secondary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Apply to Exhibit</h2>
              <p className="text-lg text-muted-foreground">
                Fill out the form below and we'll get back to you within 24 hours
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
                    <Label htmlFor="category">Product Category *</Label>
                    <Input
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Organic Food, Sustainable Fashion"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Additional Information</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your products and exhibition requirements"
                      rows={5}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Submit Application
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

export default Exhibitors;
