import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PremiumHeader from "@/components/PremiumHeader";
import PremiumFooter from "@/components/PremiumFooter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MapPin, Clock, Ticket, Users, Mic, ShoppingBag, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";

const PremiumVisitors = () => {
  const { language } = useLanguage();
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [closedMessage, setClosedMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRegistrationSettings();
  }, [language]);

  const loadRegistrationSettings = async () => {
    const { data, error } = await supabase
      .from("site_settings_premium_20251225")
      .select("visitor_registration_enabled, visitor_registration_closed_message, visitor_registration_closed_message_ar")
      .limit(1)
      .single();

    if (data) {
      setRegistrationEnabled(data.visitor_registration_enabled ?? true);
      const message = language === "ar" 
        ? data.visitor_registration_closed_message_ar 
        : data.visitor_registration_closed_message;
      setClosedMessage(message || "Visitor registration is currently closed. Please check back later.");
    }
    setLoading(false);
  };

  const highlights = [
    {
      icon: ShoppingBag,
      title: "500+ Exhibitors",
      description: "Discover sustainable products and services from leading green businesses",
    },
    {
      icon: Mic,
      title: "50+ Expert Sessions",
      description: "Learn from industry leaders through keynotes, panels, and workshops",
    },
    {
      icon: Users,
      title: "Networking Opportunities",
      description: "Connect with like-minded individuals and business professionals",
    },
    {
      icon: Ticket,
      title: "Exclusive Offers",
      description: "Access special discounts and promotions from exhibitors",
    },
  ];

  const schedule = [
    {
      day: "Day 1",
      date: "March 15, 2025",
      highlights: [
        "Opening Ceremony & Keynote",
        "Exhibition Floor Opens",
        "Sustainability Panel Discussions",
        "Networking Reception",
      ],
    },
    {
      day: "Day 2",
      date: "March 16, 2025",
      highlights: [
        "Expert Workshops",
        "Innovation Showcases",
        "Business Matchmaking Sessions",
        "Evening Networking Event",
      ],
    },
    {
      day: "Day 3",
      date: "March 17, 2025",
      highlights: [
        "Final Day Exhibitions",
        "Closing Keynote",
        "Awards Ceremony",
        "Farewell Networking",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PremiumHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-premium-heading mb-6">
              Plan Your Visit to Green Life Expo
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed mb-12 max-w-3xl mx-auto">
              Join thousands of sustainability enthusiasts, business professionals, and conscious consumers for three days of discovery, learning, and connection.
            </p>

            {/* Registration Status */}
            {!loading && (
              <div className="mb-12">
                {registrationEnabled ? (
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Button size="lg" asChild className="btn-premium btn-premium-primary group">
                      <Link to="/contact?scrollToForm=true">
                        Register Now
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="btn-premium btn-premium-outline">
                      <a href="#schedule">View Schedule</a>
                    </Button>
                  </div>
                ) : (
                  <Card className="max-w-2xl mx-auto border-red-200 bg-red-50">
                    <CardContent className="p-8 text-center">
                      <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
                      <h3 className="text-2xl font-semibold text-red-900 mb-3">
                        {language === "ar" ? "التسجيل مغلق" : "Registration Closed"}
                      </h3>
                      <p className="text-lg text-red-800">
                        {closedMessage}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Event Info Cards */}
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="card-premium text-center">
                <Calendar className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="font-semibold mb-1">Dates</div>
                <div className="text-sm text-muted-foreground">March 15-17, 2025</div>
              </div>
              <div className="card-premium text-center">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="font-semibold mb-1">Location</div>
                <div className="text-sm text-muted-foreground">Cairo International Convention Center</div>
              </div>
              <div className="card-premium text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="font-semibold mb-1">Hours</div>
                <div className="text-sm text-muted-foreground">10:00 AM - 8:00 PM</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="section-premium bg-white">
        <div className="container-premium">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-premium-heading mb-6">
              What to Expect
            </h2>
            <p className="text-lg text-muted-foreground">
              An immersive experience designed to inspire, educate, and connect you with the green economy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((highlight, index) => (
              <div key={index} className="card-premium hover-lift text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <highlight.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{highlight.title}</h3>
                <p className="text-muted-foreground">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section id="schedule" className="section-premium bg-muted/30">
        <div className="container-premium">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-premium-heading mb-6">
              Three Days of Green Innovation
            </h2>
            <p className="text-lg text-muted-foreground">
              Each day offers unique experiences, learning opportunities, and networking events.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {schedule.map((day, index) => (
              <div key={index} className="card-premium hover-lift">
                <div className="text-primary font-bold text-sm mb-2">{day.day}</div>
                <h3 className="text-2xl font-semibold mb-6">{day.date}</h3>
                <ul className="space-y-3">
                  {day.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visitor Benefits */}
      <section className="section-premium bg-primary text-primary-foreground">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-semibold mb-6">
                Why Visit Green Life Expo?
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Discover Sustainable Solutions</h3>
                    <p className="text-primary-foreground/80">
                      Explore 500+ exhibitors showcasing the latest in organic products, green technologies, and sustainable living solutions.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Learn from Experts</h3>
                    <p className="text-primary-foreground/80">
                      Attend 50+ sessions led by industry leaders, sustainability experts, and green innovators.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Network & Connect</h3>
                    <p className="text-primary-foreground/80">
                      Meet like-minded individuals, business professionals, and sustainability advocates.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Exclusive Offers</h3>
                    <p className="text-primary-foreground/80">
                      Access special discounts, promotions, and product launches available only at the expo.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80"
                  alt="Expo Visitors"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-premium bg-white">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-premium-heading mb-6">
              Ready to Experience Green Life Expo?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Register now and be part of Egypt's premier green living event. Entry is free for all visitors.
            </p>
            
            <Button size="lg" asChild className="btn-premium btn-premium-primary group">
              <Link to="/contact?scrollToForm=true">
                Register for Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Free Entry</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>All Ages Welcome</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Family Friendly</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PremiumFooter />
    </div>
  );
};

export default PremiumVisitors;
