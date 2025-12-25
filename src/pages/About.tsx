import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Target, Eye, Heart, Globe, Lightbulb, Users2 } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const values = [
    {
      icon: <Leaf className="h-8 w-8" />,
      title: "Sustainability",
      description: "Promoting eco-friendly practices and sustainable solutions",
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Health & Wellness",
      description: "Encouraging healthy lifestyles and natural products",
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Community",
      description: "Building a network of green-minded individuals and businesses",
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Innovation",
      description: "Showcasing cutting-edge green technologies and solutions",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-secondary text-primary-foreground py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold">About Green Life Expo</h1>
            <p className="text-xl text-primary-foreground/90">
              Egypt's premier platform for sustainable living and green innovation
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="border-2 border-primary/20">
              <CardContent className="p-8 space-y-4">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold">Our Mission</h2>
                <p className="text-lg text-muted-foreground">
                  To create a comprehensive platform that connects sustainable businesses, 
                  eco-conscious consumers, and green innovators, fostering a healthier and 
                  more sustainable future for Egypt and the region.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-secondary/20">
              <CardContent className="p-8 space-y-4">
                <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center">
                  <Eye className="h-8 w-8 text-secondary" />
                </div>
                <h2 className="text-3xl font-bold">Our Vision</h2>
                <p className="text-lg text-muted-foreground">
                  To be the leading exhibition in the Middle East for green living, 
                  inspiring positive change and driving the adoption of sustainable 
                  practices across all sectors of society.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-secondary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold">Our Story</h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  Green Life Expo was founded with a simple yet powerful vision: to create 
                  a space where sustainability meets innovation, and where businesses and 
                  consumers can come together to shape a greener future.
                </p>
                <p>
                  Since our inception, we've grown to become Egypt's most comprehensive 
                  exhibition for organic products, healthy lifestyles, and sustainable 
                  solutions. Each year, we bring together hundreds of exhibitors and 
                  thousands of visitors who share our passion for green living.
                </p>
                <p>
                  Our expo features everything from organic food and natural beauty products 
                  to renewable energy solutions and eco-friendly home goods. We're proud to 
                  be at the forefront of Egypt's green movement, helping to drive positive 
                  change one exhibition at a time.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1523755292440-3a72acfa3c24?w=400&auto=format&fit=crop&q=80"
                  alt="Organic vegetables"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1624377225030-f0bb343eaa4d?w=400&auto=format&fit=crop&q=80"
                  alt="Sustainable products"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1582016609297-053772cc6649?w=400&auto=format&fit=crop&q=80"
                  alt="Community"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1720156351990-67afa28e4aca?w=400&auto=format&fit=crop&q=80"
                  alt="Green living"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center border-2 hover:border-primary transition-colors">
                <CardContent className="p-6 space-y-4">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-primary">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-secondary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <Users2 className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A dedicated group of professionals passionate about sustainability and green living
            </p>
          </div>

          <div className="max-w-3xl mx-auto text-center space-y-6">
            <p className="text-lg text-muted-foreground">
              Our team consists of experienced event organizers, sustainability experts, 
              and industry professionals who work tirelessly to create an exceptional 
              experience for exhibitors and visitors alike.
            </p>
            <p className="text-lg text-muted-foreground">
              With years of experience in organizing large-scale exhibitions and a deep 
              commitment to environmental sustainability, we ensure that every aspect of 
              Green Life Expo reflects our values and meets the highest standards.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl lg:text-5xl font-bold">
              Join Our Green Movement
            </h2>
            <p className="text-lg text-primary-foreground/90">
              Be part of Egypt's most impactful green living exhibition
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/exhibitors">Become an Exhibitor</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/visitors">Plan Your Visit</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Import Leaf component
import { Leaf } from "lucide-react";

export default About;
