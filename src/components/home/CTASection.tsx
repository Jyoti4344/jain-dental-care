
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-16 bg-tulip-dark-blue text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready for a Healthier Smile?</h2>
          <p className="text-lg mb-8">
            Schedule your appointment today and take the first step toward optimal dental health and a beautiful smile.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button asChild size="lg" className="bg-tulip-dark-blue hover:bg-blue-900 text-white font-semibold px-8">
            <a href="https://appointment-booking-app-henna.vercel.app" rel="noopener noreferrer">
              Book your visit
            </a>
          </Button>
            <Button asChild variant="outline" size="lg" className="bg-white hover:bg-gray-100 text-tulip-dark-blue font-semibold px-8">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
          <div className="mt-8 opacity-75">
            <Button asChild variant="link" size="sm" className="text-white hover:text-gray-200">
              <a href="https://appointment-booking-app-henna.vercel.app" rel="noopener noreferrer">
                Staff login
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
