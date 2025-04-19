
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/common/PageHeader";
import AppointmentForm from "@/components/appointment/AppointmentForm";
import ContactInfo from "@/components/common/ContactInfo";
import { Phone, Mail, CalendarCheck, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import { supabaseClient, ensureDefaultServices } from "@/lib/supabase";

const Appointment = () => {
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState<string | null>(null);

  useEffect(() => {
    const initializeServices = async () => {
      try {
        const result = await ensureDefaultServices();
        if (!result.success) {
          setServicesError("Could not initialize default services. Some features may be limited.");
        }
      } catch (error: any) {
        setServicesError(error.message || "An unexpected error occurred initializing services");
      } finally {
        setServicesLoading(false);
      }
    };
    
    initializeServices();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <PageHeader 
          title="Book Your Appointment"
          subtitle="Schedule a visit with our dental professionals."
        />
        
        {servicesError && (
          <div className="container mx-auto px-4 mt-4">
            <Alert variant="destructive">
              <Info className="h-4 w-4 mr-2" />
              <AlertDescription>
                {servicesError}
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        <section className="py-16 bg-tulip-gray">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white p-6 rounded-lg shadow-sm text-center hover-lift">
                  <Phone size={36} className="mx-auto text-tulip-dark-blue mb-4" />
                  <h3 className="text-xl font-bold text-tulip-dark-blue mb-2">Call Us</h3>
                  <p className="text-gray-700">Schedule directly by calling our office during business hours.</p>
                  <p className="text-tulip-dark-blue font-bold mt-2">(+91)-9956374887</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center hover-lift">
                  <CalendarCheck size={36} className="mx-auto text-tulip-dark-blue mb-4" />
                  <h3 className="text-xl font-bold text-tulip-dark-blue mb-2">Online Booking</h3>
                  <p className="text-gray-700">Fill out our appointment request form below for convenient scheduling.</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center hover-lift">
                  <Mail size={36} className="mx-auto text-tulip-dark-blue mb-4" />
                  <h3 className="text-xl font-bold text-tulip-dark-blue mb-2">Email Us</h3>
                  <p className="text-gray-700">Send your preferred dates and we'll get back to you.</p>
                  <p className="text-tulip-dark-blue font-bold mt-2">appointments@tulipdental.com</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <AppointmentForm />
                </div>
                <div>
                  <ContactInfo />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Appointment;
