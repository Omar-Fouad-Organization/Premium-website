import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, MapPin, Clock, Ticket, Info, Utensils, Accessibility, Wifi } from "lucide-react";
import { Link } from "react-router-dom";

const Visitors = () => {
  const eventInfo = [
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Date",
      description: "March 15-17, 2025",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Hours",
      description: "10:00 AM - 8:00 PM Daily",
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Location",
      description: "Cairo International Convention Center",
    },
    {
      icon: <Ticket className="h-8 w-8" />,
      title: "Entry",
      description: "Free Registration Required",
    },
  ];

  const facilities = [
    {
      icon: <Utensils className="h-6 w-6" />,
      title: "Food Court",
      description: "Organic and healthy food options",
    },
    {
      icon: <Wifi className="h-6 w-6" />,
      title: "Free WiFi",
      description: "High-speed internet throughout",
    },
    {
      icon: <Accessibility className="h-6 w-6" />,
      title: "Accessibility",
      description: "Wheelchair accessible venue",
    },
    {
      icon: <Info className="h-6 w-6" />,
      title: "Information Desk",
      description: "Helpful staff on-site",
    },
  ];

  const highlights = [
    {
      title: "Product Exhibitions",
      description: "Explore 500+ booths featuring organic food, natural beauty products, sustainable fashion, and eco-friendly home goods.",
      image: "https://images.unsplash.com/photo-1648501909236-6d15a74c5cfb?w=600&auto=format&fit=crop&q=80",
    },
    {
      title: "Expert Workshops",
      description: "Attend 50+ workshops and seminars led by sustainability experts, nutritionists, and wellness coaches.",
      image: "https://images.unsplash.com/photo-1599048961640-3dcd9ee60d72?w=600&auto=format&fit=crop&q=80",
    },
    {
      title: "Live Demonstrations",
      description: "Watch cooking demos, DIY sustainable crafts, and learn practical tips for green living.",
      image: "https://images.unsplash.com/photo-1582016609297-053772cc6649?w=600&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary to-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold">Plan Your Visit</h1>
            <p className="text-xl text-primary-foreground/90">
              Everything you need to know for an amazing Green Life Expo experience
            </p>
          </div>
        </div>
      </section>

      {/* Event Info */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Event Information</h2>
            <p className="text-lg text-muted-foreground">
              Mark your calendar and join us for three days of green living
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {eventInfo.map((info, index) => (
              <Card key={index} className="border-2 hover:border-secondary transition-colors">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-secondary">
                    {info.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{info.title}</h3>
                  <p className="text-muted-foreground">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90">
              Register for Free
            </Button>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-20 bg-secondary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">What to Expect</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the exciting experiences waiting for you at Green Life Expo
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => (
              <Card key={index} className="overflow-hidden border-2 hover:shadow-xl transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={highlight.image}
                    alt={highlight.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-2xl font-bold">{highlight.title}</h3>
                  <p className="text-muted-foreground">{highlight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Venue Facilities</h2>
            <p className="text-lg text-muted-foreground">
              Enjoy a comfortable and convenient experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {facilities.map((facility, index) => (
              <Card key={index} className="border-2">
                <CardContent className="p-6 space-y-3">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-primary">
                    {facility.icon}
                  </div>
                  <h3 className="font-semibold">{facility.title}</h3>
                  <p className="text-sm text-muted-foreground">{facility.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Getting There */}
      <section className="py-20 bg-secondary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-center">Getting There</h2>
            
            <Card className="border-2">
              <CardContent className="p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Cairo International Convention Center</h3>
                  <p className="text-muted-foreground mb-4">
                    Located in the heart of Cairo, easily accessible by public transportation and car.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">By Metro</h4>
                    <p className="text-sm text-muted-foreground">
                      Take Line 3 to El Nozha Station, then a 10-minute walk or taxi ride.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">By Car</h4>
                    <p className="text-sm text-muted-foreground">
                      Free parking available on-site. Follow signs to visitor parking.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">By Taxi/Uber</h4>
                    <p className="text-sm text-muted-foreground">
                      Drop-off point at the main entrance. Estimated fare from downtown: 50-80 EGP.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">By Bus</h4>
                    <p className="text-sm text-muted-foreground">
                      Multiple bus routes stop nearby. Check local schedules for details.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Address</h4>
                  <p className="text-muted-foreground">
                    Cairo International Convention & Exhibition Centre<br />
                    El Nasr Road, Nasr City, Cairo, Egypt
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-center">Visitor Tips</h2>
            
            <div className="space-y-4">
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Register in Advance</h3>
                  <p className="text-muted-foreground">
                    Pre-register online to skip the queues and get instant entry.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Arrive Early</h3>
                  <p className="text-muted-foreground">
                    Come early to explore all booths and attend popular workshops.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Bring Reusable Bags</h3>
                  <p className="text-muted-foreground">
                    Carry eco-friendly bags for samples and purchases from exhibitors.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Download the Event App</h3>
                  <p className="text-muted-foreground">
                    Get the mobile app for interactive maps, schedules, and exhibitor information.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl lg:text-5xl font-bold">
              Ready to Experience Green Life Expo?
            </h2>
            <p className="text-lg text-primary-foreground/90">
              Register now for free and be part of Egypt's premier green living event
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Register Now
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/contact">Have Questions?</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Visitors;
