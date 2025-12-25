import PremiumHeader from "@/components/PremiumHeader";
import PremiumFooter from "@/components/PremiumFooter";
import { Target, Eye, TrendingUp, Globe, Users, Award } from "lucide-react";

const PremiumAbout = () => {
  const values = [
    {
      icon: Target,
      title: "Purpose-Driven",
      description: "Accelerating Egypt's transition to a sustainable, green economy through meaningful connections and knowledge sharing.",
    },
    {
      icon: TrendingUp,
      title: "Innovation-Focused",
      description: "Showcasing cutting-edge sustainable solutions and green technologies that drive real environmental impact.",
    },
    {
      icon: Users,
      title: "Community-Centric",
      description: "Building a thriving ecosystem of businesses, consumers, and advocates committed to sustainable living.",
    },
    {
      icon: Globe,
      title: "Regionally Ambitious",
      description: "Positioning Egypt as the Middle East's leading hub for green innovation and sustainable business.",
    },
  ];

  const milestones = [
    { year: "2024", title: "Platform Launch", description: "Established as Egypt's premier green living exhibition" },
    { year: "2025", title: "Regional Expansion", description: "Expanding reach across Middle East and North Africa" },
    { year: "2026", title: "International Recognition", description: "Becoming a globally recognized sustainability platform" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PremiumHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-premium-heading mb-6">
              Building Egypt's Green Economy Platform
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Green Life Expo exists to bridge the gap between sustainable innovation and market adoption, creating a thriving ecosystem where green businesses flourish and conscious consumers discover solutions for healthier, more sustainable living.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-premium bg-white">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="card-premium">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Eye className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl font-semibold mb-6">Our Vision</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To establish Egypt as the Middle East's leading platform for sustainable living, where green innovation meets market opportunity, and where businesses and consumers unite to create a healthier, more sustainable future for generations to come.
              </p>
            </div>

            <div className="card-premium">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl font-semibold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To create a comprehensive platform that connects sustainable businesses with conscious consumers, facilitates knowledge exchange, drives green innovation, and accelerates the adoption of sustainable practices across all sectors of Egyptian society.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Market Gap */}
      <section className="section-premium bg-muted/30">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-premium-heading mb-6">
                Addressing a Critical Market Gap
              </h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p className="text-lg">
                  Egypt's green economy is experiencing unprecedented growth, yet sustainable businesses face significant challenges in reaching their target markets, while conscious consumers struggle to discover authentic green products and services.
                </p>
                <p className="text-lg">
                  Green Life Expo was created to solve this fundamental disconnect—providing a trusted, professional platform where quality meets demand, where innovation finds investment, and where sustainability becomes accessible to all.
                </p>
                <p className="text-lg">
                  We're not just organizing an event; we're building the infrastructure for Egypt's green economy transformation.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format&fit=crop&q=80"
                  alt="Green Innovation"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-premium bg-white">
        <div className="container-premium">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-premium-heading mb-6">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground">
              The principles that guide every decision we make and every partnership we build.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card-premium hover-lift text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regional Ambition */}
      <section className="section-premium bg-primary text-primary-foreground">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-8">
              <Globe className="h-10 w-10" />
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-semibold mb-6">
              Regional Leadership, Global Impact
            </h2>
            
            <p className="text-xl text-primary-foreground/90 leading-relaxed mb-12">
              Our ambition extends beyond Egypt. We're building a platform that positions the Middle East as a global leader in sustainable innovation, attracting international businesses, investors, and thought leaders to our region.
            </p>

            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">15+</div>
                <div className="text-primary-foreground/80">Countries Represented</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">$2B+</div>
                <div className="text-primary-foreground/80">Market Opportunity</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">100M+</div>
                <div className="text-primary-foreground/80">Regional Consumers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey & Milestones */}
      <section className="section-premium bg-white">
        <div className="container-premium">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-premium-heading mb-6">
              Our Journey Forward
            </h2>
            <p className="text-lg text-muted-foreground">
              Building a sustainable future, one milestone at a time.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-8 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">{milestone.year}</span>
                    </div>
                  </div>
                  <div className="flex-1 pt-4">
                    <h3 className="text-2xl font-semibold mb-2">{milestone.title}</h3>
                    <p className="text-lg text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="section-premium bg-muted/30">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8">
              <Award className="h-10 w-10 text-primary" />
            </div>
            
            <h2 className="text-premium-heading mb-6">
              Our Commitment to Excellence
            </h2>
            
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              We are committed to maintaining the highest standards of professionalism, integrity, and quality in everything we do. Every exhibitor, sponsor, and visitor deserves an exceptional experience that delivers real value and lasting impact.
            </p>

            <p className="text-lg text-muted-foreground">
              Green Life Expo is more than an event—it's a movement, a platform, and a promise to build a more sustainable future together.
            </p>
          </div>
        </div>
      </section>

      <PremiumFooter />
    </div>
  );
};

export default PremiumAbout;
