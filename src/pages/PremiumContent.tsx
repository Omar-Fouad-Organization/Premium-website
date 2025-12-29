import { Link } from "react-router-dom";
import PremiumHeader from "@/components/PremiumHeader";
import PremiumFooter from "@/components/PremiumFooter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mic, Users, BookOpen, Award, Calendar, Clock } from "lucide-react";

const PremiumContent = () => {
  const contentTypes = [
    {
      icon: Mic,
      title: "Expert Keynotes",
      description: "Industry leaders share insights on sustainability trends, market opportunities, and green innovation",
      duration: "45-60 minutes",
    },
    {
      icon: Users,
      title: "Panel Discussions",
      description: "Multi-stakeholder conversations addressing critical challenges in the green economy",
      duration: "60-90 minutes",
    },
    {
      icon: BookOpen,
      title: "Workshops & Masterclasses",
      description: "Hands-on learning sessions for practical business applications and skill development",
      duration: "90-120 minutes",
    },
    {
      icon: Award,
      title: "Innovation Showcases",
      description: "Startups and innovators present breakthrough sustainable solutions and technologies",
      duration: "30-45 minutes",
    },
  ];

  const topics = [
    "Sustainable Business Models & Green Economy Opportunities",
    "Organic Agriculture & Food Security in Egypt",
    "Renewable Energy & Clean Technology Adoption",
    "Circular Economy & Zero Waste Solutions",
    "Green Finance & ESG Investment Strategies",
    "Sustainable Fashion & Ethical Supply Chains",
    "Health & Wellness Trends in the Middle East",
    "Climate Action & Environmental Policy",
  ];

  const speakers = [
    {
      name: "Industry Pioneers",
      description: "CEOs and founders of leading sustainable businesses",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Policy Makers",
      description: "Government officials and regulatory authorities",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Academic Experts",
      description: "Researchers and professors in sustainability fields",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Innovation Leaders",
      description: "Entrepreneurs and tech innovators driving green solutions",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PremiumHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Calendar className="h-4 w-4" />
              <span>50+ Sessions • 100+ Expert Speakers</span>
            </div>
            
            <h1 className="text-premium-heading mb-6">
              Learn from Industry Leaders & Innovators
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Access exclusive content, expert insights, and practical knowledge designed to drive innovation and accelerate your success in the green economy.
            </p>
          </div>
        </div>
      </section>

      {/* Content Types */}
      <section className="section-premium bg-white">
        <div className="container-premium">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-premium-heading mb-6">
              Diverse Learning Formats
            </h2>
            <p className="text-lg text-muted-foreground">
              From keynotes to workshops, we offer multiple formats to suit different learning styles and business needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contentTypes.map((type, index) => (
              <div key={index} className="card-premium hover-lift text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <type.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{type.title}</h3>
                <p className="text-muted-foreground mb-4">{type.description}</p>
                <div className="flex items-center justify-center gap-2 text-sm text-primary">
                  <Clock className="h-4 w-4" />
                  <span>{type.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="section-premium bg-muted/30">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-premium-heading mb-6">
                Critical Topics for Green Business Success
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our content program addresses the most pressing challenges and opportunities in Egypt's green economy, providing actionable insights you can implement immediately.
              </p>

              <div className="space-y-3">
                {topics.map((topic, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-foreground">{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop&q=80"
                  alt="Expert Panel"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Speakers */}
      <section className="section-premium bg-white">
        <div className="container-premium">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-premium-heading mb-6">
              World-Class Speakers & Thought Leaders
            </h2>
            <p className="text-lg text-muted-foreground">
              Learn from the best minds in sustainability, innovation, and green business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {speakers.map((speaker, index) => (
              <div key={index} className="card-premium hover-lift text-center group">
                <div className="aspect-square rounded-xl overflow-hidden mb-6">
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">{speaker.name}</h3>
                <p className="text-muted-foreground">{speaker.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Mission */}
      <section className="section-premium bg-primary text-primary-foreground">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-semibold mb-6">
              Knowledge is the Foundation of Change
            </h2>
            <p className="text-xl text-primary-foreground/90 leading-relaxed mb-12">
              We believe that informed businesses make better decisions, drive innovation, and create lasting positive impact. Our content program is designed to equip you with the knowledge, tools, and connections needed to succeed in the green economy.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">50+</div>
                <div className="text-primary-foreground/80">Expert Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">100+</div>
                <div className="text-primary-foreground/80">Industry Speakers</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">20+</div>
                <div className="text-primary-foreground/80">Hours of Content</div>
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
              Join the Conversation
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Register now to access our full content program and connect with the brightest minds in sustainability.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" asChild className="btn-premium btn-premium-primary group">
                <Link to="/visitors">
                  Register as Visitor
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="btn-premium btn-premium-outline">
                <Link to="/contact?scrollToForm=true">Become a Speaker</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <PremiumFooter />
    </div>
  );
};

export default PremiumContent;
