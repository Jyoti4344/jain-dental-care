
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-tulip-light-blue py-16">
        <div className="text-center px-4">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-tulip-dark-blue">404</h1>
            <p className="text-2xl text-gray-700 mt-4">Oops! Page not found</p>
            <p className="text-gray-600 mt-2 mb-8 max-w-md mx-auto">
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
          </div>
          <Button asChild className="bg-tulip-dark-blue hover:bg-blue-900 text-white">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
