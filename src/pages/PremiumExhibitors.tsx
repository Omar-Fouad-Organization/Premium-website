import { Link } from "react-router-dom";
import PremiumHeader from "@/components/PremiumHeader";
import PremiumFooter from "@/components/PremiumFooter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, TrendingUp, Users, Award, Globe, Zap, CheckCircle, BarChart } from "lucide-react";

const PremiumExhibitors = () => {
  const benefits = [
    {
      icon: Target,
      title: "Qualified Lead Generation",
      description: "Connect with pre-qualified buyers, distributors, and decision-makers actively seeking sustainable solutions for their businesses.",
    },
    {
      icon: TrendingUp,
      title: "Market Expansion",
      description: "Access Egypt's fastest-growing green economy market and establish strategic partnerships across the Middle East region.",
    },
    {
      icon: Users,
      title: "High-Value Networking",
      description: "Engage with industry leaders, investors, and key stakeholders in curated networking sessions and business matchmaking.",
    },
    {
      icon: Award,
      title: "Premium Brand Positioning",
      description: "Establish your brand as a sustainability leader through strategic visibility and thought leadership opportunities.",
    },
    {
      icon: Globe,
      title: "Regional Platform Access",
      description: "Leverage our platform to reach international buyers and expand your distribution network across emerging markets.",
    },
    {
      icon: Zap,
      title: "First-Mover Advantage",
      description: "Position your brand early in Egypt's green revolution and capture market share in high-growth sustainable sectors.",
    },
  ];

  const zones = [
    {
      title: "Organic Food & Nutrition Zone",
      description: "Premium positioning for organic food brands, healthy beverages, and nutrition solutions",
      audience: "Health-conscious consumers, retailers, distributors, F&B buyers",
      value: "Direct access to Egypt's growing organic food market valued at $500M+",
    },
    {
      title: "Health & Wellness Zone",
      description: "Dedicated space for natural health products, fitness solutions, and wellness services",
      audience: "Wellness centers, gyms, health practitioners, lifestyle consumers",
      value: "Connect with Egypt's 15M+ health and wellness market participants",
    },
    {
      title: "Sustainable Living Zone",
      description: "Showcase eco-friendly products, green technologies, and sustainable lifestyle solutions",
      audience: "Eco-conscious consumers, green building developers, sustainability officers",
      value: "Tap into the $2B+ sustainable products market in Egypt",
    },
    {
      title: "Green Technology Zone",
      description: "Platform for renewable energy, clean tech innovations, and environmental solutions",
      audience: "Government entities, corporations, investors, tech adopters",
      value: "Access Egypt's $10B+ renewable energy and clean tech sector",
    },
  ];

  const earlyBenefits = [
    "Premium booth location selection",
    "Featured listing in all marketing materials",
    "Complimentary speaking slot at expert panels",
    "Priority access to pre-event buyer meetings",
    "Enhanced digital visibility on event platforms",
    "Exclusive early-bird pricing (save up to 25%)",
  ];

  const stats = [
    { number: "10,000+", label: "Qualified Visitors", sublabel: "Decision-makers & buyers" },
    { number: "85%", label: "Purchase Intent", sublabel: "Visitors ready to buy" },
    { number: "500+", label: "Business Meetings", sublabel: "Pre-scheduled connections" },
    { number: "50+", label: "Media Partners", sublabel: "Regional & international" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PremiumHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Award className="h-4 w-4" />
              <span>Limited Exhibition Spaces Available</span>
            </div>
            
            <h1 className="text-premium-heading mb-6">
              Exhibit at Egypt's Premier Green Living Platform
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed mb-12 max-w-3xl mx-auto">
              Position your brand at the forefront of Egypt's green economy. Connect with qualified buyers, generate high-value leads, and establish your market leadership.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="btn-premium btn-premium-primary group">
                <Link to="/contact?scrollToForm=true">
                  Reserve Your Space
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="btn-premium btn-premium-outline">
                <a href="#packages">View Packages</a>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-20 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-base font-semibold text-foreground mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Exhibit */}
      <section className="section-premium bg-white">
        <div className="container-premium">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-premium-heading mb-6">
              Why Leading Brands Exhibit With Us
            </h2>
            <p className="text-lg text-muted-foreground">
              Green Life Expo delivers measurable ROI through qualified leads, strategic partnerships, and premium brand positioning in Egypt's fastest-growing market.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="card-premium hover-lift">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <benefit.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zone-Based Participation */}
      <section className="section-premium bg-muted/30">
        <div className="container-premium">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-premium-heading mb-6">
              Strategic Zone-Based Participation
            </h2>
            <p className="text-lg text-muted-foreground">
              Each zone is designed to maximize your visibility and connect you with your exact target audience.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {zones.map((zone, index) => (
              <div key={index} className="card-premium hover-lift">
                <h3 className="text-2xl font-semibold mb-4 text-primary">{zone.title}</h3>
                <p className="text-foreground mb-6">{zone.description}</p>
                
                <div className="space-y-4 pt-4 border-t border-border">
                  <div>
                    <div className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      Target Audience
                    </div>
                    <p className="text-sm text-muted-foreground">{zone.audience}</p>
                  </div>
                  
                  <div>
                    <div className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                      <BarChart className="h-4 w-4 text-primary" />
                      Market Value
                    </div>
                    <p className="text-sm text-muted-foreground">{zone.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Early Participation Benefits */}
      <section className="section-premium bg-primary text-primary-foreground">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-semibold mb-6">
                Early Participation Benefits
              </h2>
              <p className="text-xl text-primary-foreground/90 mb-8">
                Secure your space now and unlock exclusive advantages that maximize your exhibition ROI.
              </p>

              <div className="space-y-4">
                {earlyBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-sm font-semibold mb-2">Limited Time Offer</div>
                <div className="text-2xl font-bold mb-1">Save up to 25%</div>
                <div className="text-primary-foreground/80">Book before January 31, 2025</div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80"
                  alt="Exhibition Space"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audience Quality */}
      <section className="section-premium bg-white">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80"
                  alt="Business Networking"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-premium-heading mb-6">
                Connect with Decision-Makers, Not Just Visitors
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our rigorous visitor qualification process ensures you meet with serious buyers, distributors, and business partners who have the authority and budget to make purchasing decisions.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-primary">65%</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">C-Level & Senior Management</h3>
                    <p className="text-sm text-muted-foreground">Decision-makers with purchasing authority</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-primary">85%</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Active Purchase Intent</h3>
                    <p className="text-sm text-muted-foreground">Visitors planning to make purchases within 6 months</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-primary">40%</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">International Buyers</h3>
                    <p className="text-sm text-muted-foreground">Regional and international business delegations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-premium bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-semibold mb-6">
              Secure Your Exhibition Space Today
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-12 max-w-2xl mx-auto">
              Join 500+ leading brands showcasing sustainable solutions at Egypt's premier green living platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" variant="secondary" asChild className="btn-premium bg-white text-primary hover:bg-white/90">
                <Link to="/contact?scrollToForm=true">
                  Reserve Your Space
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="btn-premium border-2 border-white text-white hover:bg-white hover:text-primary">
                <a href="mailto:exhibitors@greenlifeexpo.com">Contact Exhibition Team</a>
              </Button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-primary-foreground/80">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Flexible Packages</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Custom Solutions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>ROI Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PremiumFooter />
    </div>
  );
};

export default PremiumExhibitors;
