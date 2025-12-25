import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      details: ["info@greenlifeexpo.com", "support@greenlifeexpo.com"],
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone",
      details: ["+20 123 456 7890", "+20 123 456 7891"],
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Address",
      details: ["Cairo International Convention Center", "El Nasr Road, Nasr City, Cairo, Egypt"],
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Office Hours",
      details: ["Sunday - Thursday: 9:00 AM - 5:00 PM", "Friday - Saturday: Closed"],
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you within 24 hours.",
    });
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
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
      <section className="relative bg-gradient-to-br from-primary via-secondary to-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold">Get in Touch</h1>
            <p className="text-xl text-primary-foreground/90">
              Have questions? We're here to help and answer any questions you might have
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {contactInfo.map((info, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardContent className="p-6 space-y-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-primary">
                    {info.icon}
                  </div>
                  <h3 className="font-semibold text-lg">{info.title}</h3>
                  <div className="space-y-1">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-sm text-muted-foreground">
                        {detail}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-secondary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Send Us a Message</h2>
              <p className="text-lg text-muted-foreground">
                Fill out the form below and we'll respond as soon as possible
              </p>
            </div>

            <Card className="border-2">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+20 123 456 7890"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="How can we help?"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">
                Quick answers to common questions
              </p>
            </div>

            <div className="space-y-6">
              <Card className="border-2">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">When is Green Life Expo 2025?</h3>
                  <p className="text-muted-foreground">
                    The expo will take place from March 15-17, 2025, at the Cairo International Convention Center.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Is registration required?</h3>
                  <p className="text-muted-foreground">
                    Yes, free registration is required for all visitors. You can register online in advance or on-site.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">How can I become an exhibitor?</h3>
                  <p className="text-muted-foreground">
                    Visit our Exhibitors page to view packages and submit an application. Our team will contact you within 24 hours.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Are there sponsorship opportunities?</h3>
                  <p className="text-muted-foreground">
                    Yes! We offer various sponsorship packages. Check our Sponsors page for details or contact us directly.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Is parking available?</h3>
                  <p className="text-muted-foreground">
                    Yes, free parking is available on-site at the Cairo International Convention Center.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-secondary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-center">Find Us</h2>
            <Card className="border-2 overflow-hidden">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <div className="text-center space-y-2">
                  <MapPin className="h-12 w-12 text-primary mx-auto" />
                  <p className="text-lg font-semibold">Cairo International Convention Center</p>
                  <p className="text-muted-foreground">El Nasr Road, Nasr City, Cairo, Egypt</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
