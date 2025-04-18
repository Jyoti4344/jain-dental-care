
import { Link } from "react-router-dom";
import { Tooth, Smile, AlarmClock, Stethoscope, Baby, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const servicesData = [
  {
    icon: <Tooth className="service-icon" />,
    title: "General Dentistry",
    description: "Comprehensive care for your dental health including cleanings, fillings, and preventative care."
  },
  {
    icon: <Smile className="service-icon" />,
    title: "Cosmetic Dentistry",
    description: "Transform your smile with our advanced cosmetic procedures including whitening and veneers."
  },
  {
    icon: <AlarmClock className="service-icon" />,
    title: "Emergency Care",
    description: "Same-day emergency dental care when you need it most, providing quick relief from pain."
  },
  {
    icon: <Stethoscope className="service-icon" />,
    title: "Orthodontics",
    description: "Straighten your teeth with modern orthodontic solutions including braces and clear aligners."
  },
  {
    icon: <Baby className="service-icon" />,
    title: "Pediatric Dentistry",
    description: "Child-friendly dental care in a comfortable environment designed to put young patients at ease."
  },
  {
    icon: <Heart className="service-icon" />,
    title: "Specialized Care",
    description: "Advanced treatments including root canals, dental implants, and surgical procedures."
  }
];

const Services = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-tulip-dark-blue mb-4">Our Services</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            We provide comprehensive dental services to meet all your oral health needs in one convenient location.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
            <Card key={index} className="hover-lift">
              <CardHeader className="text-center pt-8">
                {service.icon}
                <CardTitle className="text-xl font-bold text-tulip-dark-blue">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600">{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button asChild className="bg-tulip-dark-blue hover:bg-blue-900 text-white px-8">
            <Link to="/services">View All Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
