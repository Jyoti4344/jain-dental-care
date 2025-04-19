
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="bg-gradient-to-b from-tulip-light-blue to-white py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-tulip-dark-blue mb-4 leading-tight">
              Your Smile Deserves <br />The Best Care
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-lg">
              At Jain Dental Care Clinic, we provide comprehensive dental services with a gentle touch. 
              Your comfort and dental health are our top priorities.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Button asChild size="lg" className="bg-tulip-dark-blue hover:bg-blue-900 text-white font-semibold px-8">
              <a href="https://appointment-booking-app-henna.vercel.app" target="_blank" rel="noopener noreferrer">
                Book Appointment
              </a>
            </Button>
              <Button asChild variant="outline" size="lg" className="border-tulip-dark-blue text-tulip-dark-blue hover:bg-tulip-blue/10">
                <Link to="/services">Our Services</Link>
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-40 h-40 bg-tulip-purple rounded-full opacity-50"></div>
              <img 
                src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Dental care professional" 
                className="rounded-lg shadow-xl z-10 relative w-full max-w-md object-cover"
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-tulip-blue rounded-full opacity-50"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
