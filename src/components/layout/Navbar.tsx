
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white py-4 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="text-tulip-dark-blue font-nunito font-bold text-2xl">Tulip Dental</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-tulip-dark-blue font-medium">Home</Link>
          <Link to="/about" className="text-gray-700 hover:text-tulip-dark-blue font-medium">About</Link>
          <Link to="/services" className="text-gray-700 hover:text-tulip-dark-blue font-medium">Services</Link>
          <Link to="/blog" className="text-gray-700 hover:text-tulip-dark-blue font-medium">Blog</Link>
          <Link to="/contact" className="text-gray-700 hover:text-tulip-dark-blue font-medium">Contact</Link>
          <Button asChild className="bg-tulip-dark-blue hover:bg-blue-900 text-white">
            <Link to="/appointment">Book Appointment</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 shadow-lg">
          <div className="flex flex-col space-y-4">
            <Link to="/" className="text-gray-700 hover:text-tulip-dark-blue font-medium" onClick={toggleMenu}>Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-tulip-dark-blue font-medium" onClick={toggleMenu}>About</Link>
            <Link to="/services" className="text-gray-700 hover:text-tulip-dark-blue font-medium" onClick={toggleMenu}>Services</Link>
            <Link to="/blog" className="text-gray-700 hover:text-tulip-dark-blue font-medium" onClick={toggleMenu}>Blog</Link>
            <Link to="/contact" className="text-gray-700 hover:text-tulip-dark-blue font-medium" onClick={toggleMenu}>Contact</Link>
            <Button asChild className="bg-tulip-dark-blue hover:bg-blue-900 text-white w-full">
              <Link to="/appointment" onClick={toggleMenu}>Book Appointment</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
