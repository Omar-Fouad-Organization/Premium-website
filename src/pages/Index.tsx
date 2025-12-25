import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Leaf, Users, Award, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";

const Index = () => {
  const benefits = [
    {
      icon: <Leaf className="h-8 w-8 text-primary" />,
      title: "Sustainable Products",
      description: "Discover eco-friendly and organic products from leading brands",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Network & Connect",
      description: "Meet industry leaders and like-minded professionals",
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Expert Insights",
      description: "Attend workshops and seminars by industry experts",
    },
    {
      icon: <Calendar className="h-8 w-8 text-primary" />,
      title: "Annual Event",
      description: "Join Egypt's premier green living exhibition",
    },
  ];

  const stats = [
    { number: "500+", label: "Exhibitors" },
    { number: "10,000+", label: "Visitors" },
    { number: "50+", label: "Workshops" },
    { number: "3", label: "Days" },
  ];

  const categories = [
    "Organic Food & Beverages",
    "Natural Beauty & Wellness",
    "Sustainable Fashion",
    "Eco-Friendly Home Products",
    "Renewable Energy Solutions",
    "Green Technology",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-background to-secondary/10 py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Egypt's Leading Go Green & Healthy Living Expo
                </h1>
                <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl">
                  A curated exhibition bringing together organic products, healthy lifestyles, 
                  and sustainable solutions under one platform.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-lg px-8">
                  <Link to="/exhibitors">
                    Exhibit With Us
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg px-8">
                  <Link to="/sponsors">Become a Sponsor</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-primary">{stat.number}</div>
                    <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1568687180832-046582693aa4?w=800&auto=format&fit=crop&q=80"
                  alt="Green Life Expo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground p-6 rounded-xl shadow-lg">
                <div className="text-2xl font-bold">March 2025</div>
                <div className="text-sm">Cairo, Egypt</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
              Where Green Living Meets a Healthier Future
            </h2>
            <p className="text-lg text-muted-foreground">
              Green Life Expo is Egypt's premier platform for sustainable living, bringing together 
              innovators, businesses, and consumers passionate about creating a healthier, greener future.
            </p>
            <Button asChild variant="outline" size="lg">
              <Link to="/about">
                Learn More About Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-secondary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Attend Green Life Expo?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of visitors and exhibitors in Egypt's most comprehensive green living event
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardContent className="p-6 space-y-4">
                  <div className="bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center">
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

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Exhibition Categories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore diverse sectors of sustainable living and green innovation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {categories.map((category, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 bg-secondary/10 rounded-lg hover:bg-secondary/20 transition-colors"
              >
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                <span className="font-medium">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-20 bg-secondary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Experience Green Life Expo
            </h2>
            <p className="text-lg text-muted-foreground">
              A glimpse into our vibrant exhibition
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="aspect-[4/3] rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1575843401197-5fbec2bccf0f?w=600&auto=format&fit=crop&q=80"
                alt="Organic products"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="aspect-[4/3] rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1582615908486-aa0a3958e60e?w=600&auto=format&fit=crop&q=80"
                alt="Sustainable products"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="aspect-[4/3] rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1594388125083-a7032be30fa2?w=600&auto=format&fit=crop&q=80"
                alt="Healthy lifestyle"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl lg:text-5xl font-bold">
              Ready to Join Us?
            </h2>
            <p className="text-lg text-primary-foreground/90">
              Whether you're an exhibitor, sponsor, or visitor, Green Life Expo offers 
              unique opportunities to connect, learn, and grow in the green economy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="text-lg px-8">
                <Link to="/exhibitors">Exhibit With Us</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
