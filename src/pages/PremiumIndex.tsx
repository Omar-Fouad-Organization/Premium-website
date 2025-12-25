import { Link } from "react-router-dom";
import PremiumHeader from "@/components/PremiumHeader";
import PremiumFooter from "@/components/PremiumFooter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, TrendingUp, Award, Globe, CheckCircle, Calendar, MapPin } from "lucide-react";

const PremiumIndex = () => {
  const sectors = [
    {
      title: "Organic Food & Beverages",
      description: "Premium organic products, healthy nutrition, and sustainable food solutions",
      icon: "🌾",
    },
    {
      title: "Health & Wellness",
      description: "Natural health products, fitness solutions, and holistic wellness services",
      icon: "💚",
    },
    {
      title: "Sustainable Living",
      description: "Eco-friendly products, green technologies, and sustainable lifestyle solutions",
      icon: "🌱",
    },
    {
      title: "Natural Beauty & Personal Care",
      description: "Organic cosmetics, natural skincare, and eco-conscious personal care",
      icon: "✨",
    },
    {
      title: "Green Technology",
      description: "Renewable energy, clean tech innovations, and environmental solutions",
      icon: "⚡",
    },
    {
      title: "Eco-Fashion & Textiles",
      description: "Sustainable fashion, organic textiles, and ethical clothing brands",
      icon: "👕",
    },
  ];

  const benefits = [
    {
      icon: Users,
      title: "10,000+ Qualified Visitors",
      description: "Connect with decision-makers, buyers, and sustainability advocates",
    },
    {
      icon: TrendingUp,
      title: "High-Quality Leads",
      description: "Generate valuable business connections and partnership opportunities",
    },
    {
      icon: Award,
      title: "Premium Brand Positioning",
      description: "Establish your brand as a leader in the green economy",
    },
    {
      icon: Globe,
      title: "Regional Platform",
      description: "Access Egypt's fastest-growing sustainable living market",
    },
  ];

  const stats = [
    { number: "500+", label: "Exhibitors" },
    { number: "10,000+", label: "Visitors" },
    { number: "50+", label: "Expert Speakers" },
    { number: "3", label: "Days of Innovation" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PremiumHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 bg-gradient-to-b from-muted/30 to-background">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Calendar className="h-4 w-4" />
                <span>March 15-17, 2025 • Cairo, Egypt</span>
              </div>
              
              <h1 className="text-premium-heading">
                Egypt's Leading Go Green & Healthy Living Expo
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                The premier platform connecting sustainable businesses, eco-conscious consumers, and green innovators across the Middle East.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="btn-premium btn-premium-primary group">
                  <Link to="/exhibitors">
                    Exhibit With Us
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="btn-premium btn-premium-outline">
                  <Link to="/sponsors">Become a Sponsor</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-border">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center sm:text-left">
                    <div className="text-3xl font-bold text-primary">{stat.number}</div>
                    <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80"
                  alt="Green Life Expo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6 max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Certified Platform</div>
                    <div className="text-sm text-muted-foreground">ISO Certified Event</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="section-premium bg-white">
        <div className="container-premium">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-premium-heading mb-6">
              Where Green Living Meets Business Growth
            </h2>
            <p className="text-lg text-muted-foreground">
              Green Life Expo is not just an event—it's the definitive platform for sustainable businesses to connect, grow, and lead the green economy transformation in Egypt and beyond.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="card-premium hover-lift text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors Overview */}
      <section className="section-premium bg-muted/30">
        <div className="container-premium">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-premium-heading mb-6">
              Curated Sectors for Maximum Impact
            </h2>
            <p className="text-lg text-muted-foreground">
              Each sector is carefully designed to create meaningful connections between exhibitors and their target audiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectors.map((sector, index) => (
              <div key={index} className="card-premium hover-lift group cursor-pointer">
                <div className="text-5xl mb-4">{sector.icon}</div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {sector.title}
                </h3>
                <p className="text-muted-foreground">{sector.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild className="btn-premium btn-premium-outline">
              <Link to="/sectors">
                Explore All Sectors
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Participate */}
      <section className="section-premium bg-primary text-primary-foreground">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-semibold mb-6">
                Why Leading Brands Choose Green Life Expo
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Qualified Audience</h3>
                    <p className="text-primary-foreground/80">
                      Connect with serious buyers, distributors, and decision-makers actively seeking sustainable solutions.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Media Exposure</h3>
                    <p className="text-primary-foreground/80">
                      Gain visibility through extensive media coverage, PR opportunities, and digital marketing campaigns.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Thought Leadership</h3>
                    <p className="text-primary-foreground/80">
                      Position your brand as an industry leader through speaking opportunities and expert panels.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">ROI-Focused</h3>
                    <p className="text-primary-foreground/80">
                      Designed for measurable results: lead generation, partnerships, and business growth.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80"
                  alt="Exhibition Floor"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content & Talks Preview */}
      <section className="section-premium bg-white">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80"
                  alt="Expert Talks"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-premium-heading mb-6">
                Learn from Industry Leaders
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Access exclusive content, expert panels, and workshops designed to drive innovation and knowledge sharing in the green economy.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <p className="text-muted-foreground">Expert-led panels on sustainability trends and market opportunities</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <p className="text-muted-foreground">Hands-on workshops for practical business applications</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <p className="text-muted-foreground">Networking sessions with industry pioneers and innovators</p>
                </div>
              </div>

              <Button size="lg" variant="outline" asChild className="btn-premium btn-premium-outline">
                <Link to="/content">
                  View Full Program
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-premium bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-semibold mb-6">
              Ready to Join Egypt's Premier Green Platform?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-12 max-w-2xl mx-auto">
              Whether you're an exhibitor, sponsor, or visitor, Green Life Expo offers unparalleled opportunities to connect, learn, and grow in the green economy.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" variant="secondary" asChild className="btn-premium bg-white text-primary hover:bg-white/90">
                <Link to="/exhibitors">
                  Exhibit With Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="btn-premium border-2 border-white text-white hover:bg-white hover:text-primary">
                <Link to="/sponsors">Become a Sponsor</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="btn-premium border-2 border-white text-white hover:bg-white hover:text-primary">
                <Link to="/visitors">Plan Your Visit</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <PremiumFooter />
    </div>
  );
};

export default PremiumIndex;
