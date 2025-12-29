import { Link } from "react-router-dom";
import PremiumHeader from "@/components/PremiumHeader";
import PremiumFooter from "@/components/PremiumFooter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, TrendingUp, Building, Leaf, Heart, Home, Sparkles, Zap, Shirt } from "lucide-react";

const PremiumSectors = () => {
  const sectors = [
    {
      icon: Leaf,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
      title: "Organic Food & Beverages",
      description: "Premium organic products, healthy nutrition, and sustainable food solutions",
      whoExhibits: "Organic farms, food processors, healthy beverage brands, nutrition companies, organic retailers",
      whoVisits: "Health-conscious consumers, retailers, distributors, F&B buyers, wellness centers",
      marketValue: "$500M+ market opportunity in Egypt's organic food sector",
      image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&auto=format&fit=crop&q=80",
    },
    {
      icon: Heart,
      iconColor: "text-red-600",
      iconBg: "bg-red-50",
      title: "Health & Wellness",
      description: "Natural health products, fitness solutions, and holistic wellness services",
      whoExhibits: "Natural supplement brands, fitness equipment, wellness centers, holistic practitioners, health tech",
      whoVisits: "Wellness enthusiasts, gyms, health practitioners, lifestyle consumers, corporate wellness buyers",
      marketValue: "15M+ health and wellness market participants in Egypt",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80",
    },
    {
      icon: Home,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
      title: "Sustainable Living",
      description: "Eco-friendly products, green technologies, and sustainable lifestyle solutions",
      whoExhibits: "Eco-product manufacturers, green tech companies, sustainable brands, zero-waste solutions",
      whoVisits: "Eco-conscious consumers, green building developers, sustainability officers, retailers",
      marketValue: "$2B+ sustainable products market in Egypt",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80",
    },
    {
      icon: Sparkles,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50",
      title: "Natural Beauty & Personal Care",
      description: "Organic cosmetics, natural skincare, and eco-conscious personal care",
      whoExhibits: "Natural cosmetics brands, organic skincare, eco-beauty products, sustainable packaging",
      whoVisits: "Beauty consumers, salons, spas, retailers, beauty influencers, distributors",
      marketValue: "Fast-growing segment with 40% annual growth in natural beauty",
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&auto=format&fit=crop&q=80",
    },
    {
      icon: Zap,
      iconColor: "text-yellow-600",
      iconBg: "bg-yellow-50",
      title: "Green Technology & Energy",
      description: "Renewable energy, clean tech innovations, and environmental solutions",
      whoExhibits: "Solar companies, clean tech startups, energy efficiency solutions, environmental tech",
      whoVisits: "Government entities, corporations, investors, developers, tech adopters",
      marketValue: "$10B+ renewable energy and clean tech sector in Egypt",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&auto=format&fit=crop&q=80",
    },
    {
      icon: Shirt,
      iconColor: "text-pink-600",
      iconBg: "bg-pink-50",
      title: "Eco-Fashion & Textiles",
      description: "Sustainable fashion, organic textiles, and ethical clothing brands",
      whoExhibits: "Sustainable fashion brands, organic textile manufacturers, ethical clothing, upcycled fashion",
      whoVisits: "Fashion consumers, boutiques, retailers, fashion buyers, sustainability advocates",
      marketValue: "Growing demand for sustainable fashion in Middle East market",
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80",
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
              Curated Sectors for Maximum Impact
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Each sector is strategically designed to create meaningful connections between exhibitors and their target audiences, ensuring quality interactions and measurable business results.
            </p>
          </div>
        </div>
      </section>

      {/* Sectors Grid */}
      <section className="section-premium bg-white">
        <div className="container-premium">
          <div className="space-y-20">
            {sectors.map((sector, index) => (
              <div
                key={index}
                className={`group grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                    <img
                      src={sector.image}
                      alt={sector.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <div className={`w-16 h-16 rounded-2xl ${sector.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <sector.icon className={`h-8 w-8 ${sector.iconColor}`} />
                  </div>
                  <h2 className="text-3xl font-semibold mb-4">{sector.title}</h2>
                  <p className="text-lg text-muted-foreground mb-8">{sector.description}</p>

                  <div className="space-y-6">
                    <div className="card-premium">
                      <div className="flex items-start gap-3 mb-3">
                        <Building className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold mb-2">Who Should Exhibit</h3>
                          <p className="text-sm text-muted-foreground">{sector.whoExhibits}</p>
                        </div>
                      </div>
                    </div>

                    <div className="card-premium">
                      <div className="flex items-start gap-3 mb-3">
                        <Users className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold mb-2">Who Will Visit</h3>
                          <p className="text-sm text-muted-foreground">{sector.whoVisits}</p>
                        </div>
                      </div>
                    </div>

                    <div className="card-premium bg-primary/5">
                      <div className="flex items-start gap-3">
                        <TrendingUp className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold mb-2">Market Opportunity</h3>
                          <p className="text-sm text-muted-foreground">{sector.marketValue}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-premium bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-semibold mb-6">
              Find Your Perfect Sector
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-12 max-w-2xl mx-auto">
              Choose the sector that aligns with your business and connect with your ideal audience.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" variant="secondary" asChild className="btn-premium bg-white text-primary hover:bg-white/90">
                <Link to="/exhibitors">
                  Exhibit With Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="btn-premium border-2 border-white text-white hover:bg-white hover:text-primary">
                <Link to="/contact?scrollToForm=true">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <PremiumFooter />
    </div>
  );
};

export default PremiumSectors;
