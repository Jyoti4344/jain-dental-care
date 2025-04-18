
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-tulip-dark-blue text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Tulip Dental Clinic</h3>
            <p className="mb-4">
              Providing professional and compassionate dental care for the whole family.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-tulip-blue transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-tulip-blue transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-tulip-blue transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin size={20} className="mr-2 mt-1 flex-shrink-0" />
                <p>123 Dental Avenue, Faridabad, Haryana, India 121004</p>
              </div>
              <div className="flex items-center">
                <Phone size={20} className="mr-2 flex-shrink-0" />
                <p>(91)-9956374887</p>
              </div>
              <div className="flex items-center">
                <Mail size={20} className="mr-2 flex-shrink-0" />
                <p>info@tulipdental.com</p>
              </div>
              <div className="flex items-start">
                <Clock size={20} className="mr-2 mt-1 flex-shrink-0" />
                <div>
                  <p>Mon-Fri: 8:00 AM - 6:00 PM</p>
                  <p>Saturday: 9:00 AM - 3:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-tulip-blue transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-tulip-blue transition-colors">About Us</Link></li>
              <li><Link to="/services" className="hover:text-tulip-blue transition-colors">Services</Link></li>
              <li><Link to="/blog" className="hover:text-tulip-blue transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-tulip-blue transition-colors">Contact</Link></li>
              <li><Link to="/appointment" className="hover:text-tulip-blue transition-colors">Book Appointment</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8">
          <p className="text-center text-sm">
            &copy; {new Date().getFullYear()} Tulip Dental Clinic. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
