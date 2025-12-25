import { Link } from "react-router-dom";
import PremiumHeader from "@/components/PremiumHeader";
import PremiumFooter from "@/components/PremiumFooter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Globe, TrendingUp, Users, Mic, Camera, CheckCircle, Star } from "lucide-react";

const PremiumSponsors = () => {
  const benefits = [
    {
      icon: Globe,
      title: "Strategic Brand Alignment",
      description: "Position your brand alongside sustainability leadership and demonstrate authentic commitment to environmental responsibility.",
    },
    {
      icon: Camera,
      title: "Premium Media Exposure",
      description: "Gain visibility across 50+ media partners, digital platforms, and industry publications reaching millions of stakeholders.",
    },
    {
      icon: Users,
      title: "Executive Networking",
      description: "Access exclusive C-suite networking events, VIP lounges, and private meetings with industry leaders and decision-makers.",
    },
    {
      icon: TrendingUp,
      title: "CSR & ESG Positioning",
      description: "Strengthen your corporate social responsibility profile and enhance ESG credentials with measurable sustainability impact.",
    },
    {
      icon: Mic,
      title: "Thought Leadership Platform",
      description: "Establish industry authority through keynote opportunities, panel participation, and expert content creation.",
    },
    {
      icon: Award,
      title: "Custom Brand Experiences",
      description: "Create bespoke activations, immersive brand experiences, and memorable touchpoints that resonate with your target audience.",
    },
  ];

  const sponsorshipLevels = [
    {
      tier: "Platinum Partner",
      tagline: "Ultimate Brand Dominance",
      price: "Custom",
      features: [
        "Exclusive naming rights for main stage",
        "Prime logo placement across all materials",
        "30-minute keynote speaking slot",
        "VIP hospitality suite for 50 guests",
        "Dedicated brand activation zone (100 sqm)",
        "Full-page feature in event magazine",
        "Premium digital advertising package",
        "Post-event attendee database access",
        "Custom brand integration opportunities",
        "Year-round partnership benefits",
      ],
      highlight: true,
    },
    {
      tier: "Gold Partner",
      tagline: "Premium Visibility",
      price: "Custom",
      features: [
        "Zone naming rights (your choice)",
        "Prominent logo placement",
        "20-minute speaking opportunity",
        "VIP hospitality area for 30 guests",
        "Brand activation space (50 sqm)",
        "Half-page feature in event magazine",
        "Enhanced digital presence",
        "Networking event sponsorship",
        "Media interview opportunities",
        "Quarterly partnership touchpoints",
      ],
      highlight: false,
    },
    {
      tier: "Silver Partner",
      tagline: "Strategic Presence",
      price: "Custom",
      features: [
        "Session sponsorship rights",
        "Logo placement on key materials",
        "Panel participation opportunity",
        "VIP lounge access for 15 guests",
        "Brand activation space (25 sqm)",
        "Quarter-page feature in magazine",
        "Standard digital package",
        "Networking reception sponsorship",
        "Press release distribution",
        "Bi-annual partnership updates",
      ],
      highlight: false,
    },
  ];

  const customOpportunities = [
    {
      title: "Content Hub Sponsorship",
      description: "Own the knowledge center with branded content, expert talks, and educational workshops",
      icon: "📚",
    },
    {
      title: "Sustainability Awards",
      description: "Present prestigious awards recognizing green innovation and environmental leadership",
      icon: "🏆",
    },
    {
      title: "VIP Lounge Experience",
      description: "Create an exclusive branded environment for high-value networking and hospitality",
      icon: "✨",
    },
    {
      title: "Innovation Showcase",
      description: "Highlight cutting-edge sustainable technologies in a dedicated innovation zone",
      icon: "💡",
    },
    {
      title: "Media Center Partnership",
      description: "Control the narrative with branded media facilities and press conference spaces",
      icon: "📺",
    },
    {
      title: "Digital Platform Integration",
      description: "Dominate digital touchpoints including app, website, and virtual engagement",
      icon: "📱",
    },
  ];

  const stats = [
    { number: "50M+", label: "Media Impressions", sublabel: "Across all channels" },
    { number: "10,000+", label: "Engaged Attendees", sublabel: "Quality over quantity" },
    { number: "500+", label: "Media Mentions", sublabel: "Regional & international" },
    { number: "85%", label: "C-Suite Attendance", sublabel: "Decision-maker access" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PremiumHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Star className="h-4 w-4" />
              <span>Exclusive Partnership Opportunities</span>
            </div>
            
            <h1 className="text-premium-heading mb-6">
              Partner with Egypt's Leading Sustainability Platform
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed mb-12 max-w-3xl mx-auto">
              Align your brand with the green economy movement. Demonstrate leadership, enhance ESG credentials, and connect with millions of sustainability-conscious stakeholders.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="btn-premium btn-premium-primary group">
                <Link to="/contact">
                  Explore Partnership
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

      {/* Strategic Benefits */}
      <section className="section-premium bg-white">
        <div className="container-premium">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-premium-heading mb-6">
              Strategic Partnership Benefits
            </h2>
            <p className="text-lg text-muted-foreground">
              Our sponsorship packages deliver measurable brand value, executive access, and authentic sustainability positioning.
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

      {/* Sponsorship Levels */}
      <section id="packages" className="section-premium bg-muted/30">
        <div className="container-premium">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-premium-heading mb-6">
              Partnership Levels
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose the partnership level that aligns with your strategic objectives and brand ambitions.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {sponsorshipLevels.map((level, index) => (
              <div
                key={index}
                className={`card-premium hover-lift ${
                  level.highlight ? "ring-2 ring-primary shadow-xl" : ""
                }`}
              >
                {level.highlight && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold mb-4">
                    <Star className="h-3 w-3" />
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-2xl font-bold mb-2">{level.tier}</h3>
                <p className="text-muted-foreground mb-4">{level.tagline}</p>
                <div className="text-3xl font-bold text-primary mb-6">{level.price}</div>
                
                <ul className="space-y-3 mb-8">
                  {level.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className={`w-full ${
                    level.highlight
                      ? "bg-primary hover:bg-primary/90"
                      : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                  }`}
                >
                  <Link to="/contact">Request Proposal</Link>
                </Button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              All packages are customizable to meet your specific objectives
            </p>
            <Button size="lg" variant="outline" asChild className="btn-premium btn-premium-outline">
              <Link to="/contact">
                Discuss Custom Package
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Custom Opportunities */}
      <section className="section-premium bg-white">
        <div className="container-premium">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-premium-heading mb-6">
              Custom Sponsorship Experiences
            </h2>
            <p className="text-lg text-muted-foreground">
              Create bespoke brand activations that align perfectly with your marketing objectives and target audience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customOpportunities.map((opportunity, index) => (
              <div key={index} className="card-premium hover-lift group cursor-pointer">
                <div className="text-5xl mb-4">{opportunity.icon}</div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {opportunity.title}
                </h3>
                <p className="text-muted-foreground">{opportunity.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CSR & ESG Impact */}
      <section className="section-premium bg-primary text-primary-foreground">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-semibold mb-6">
                Strengthen Your ESG & CSR Profile
              </h2>
              <p className="text-xl text-primary-foreground/90 mb-8">
                Partnership with Green Life Expo demonstrates authentic commitment to sustainability and provides measurable ESG impact for stakeholder reporting.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Environmental Leadership</h3>
                    <p className="text-primary-foreground/80">
                      Demonstrate commitment to environmental sustainability and green economy development
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Social Impact</h3>
                    <p className="text-primary-foreground/80">
                      Support community education, sustainable practices, and green innovation ecosystem
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Governance Excellence</h3>
                    <p className="text-primary-foreground/80">
                      Align with international sustainability standards and best practices
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80"
                  alt="Corporate Partnership"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Media & Visibility */}
      <section className="section-premium bg-white">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80"
                  alt="Media Coverage"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-premium-heading mb-6">
                Unparalleled Media Exposure
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Leverage our extensive media network to amplify your brand message and reach millions of stakeholders across multiple channels.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Camera className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">50+ Media Partners</h3>
                    <p className="text-sm text-muted-foreground">Regional and international press, TV, radio, and digital media</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">50M+ Impressions</h3>
                    <p className="text-sm text-muted-foreground">Across social media, digital platforms, and traditional media</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mic className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Thought Leadership</h3>
                    <p className="text-sm text-muted-foreground">Speaking opportunities, interviews, and expert content creation</p>
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
              Ready to Lead the Green Economy?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-12 max-w-2xl mx-auto">
              Join leading brands in shaping Egypt's sustainable future. Let's create a partnership that delivers measurable impact.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" variant="secondary" asChild className="btn-premium bg-white text-primary hover:bg-white/90">
                <Link to="/contact">
                  Request Partnership Proposal
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="btn-premium border-2 border-white text-white hover:bg-white hover:text-primary">
                <a href="mailto:partnerships@greenlifeexpo.com">Contact Partnership Team</a>
              </Button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-primary-foreground/80">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Custom Solutions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Flexible Terms</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Measurable ROI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PremiumFooter />
    </div>
  );
};

export default PremiumSponsors;
