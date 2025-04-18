
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/common/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppointmentsTab from "@/components/admin/AppointmentsTab";
import PatientsTab from "@/components/admin/PatientsTab";
import StaffTab from "@/components/admin/StaffTab";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import { supabaseClient } from "@/lib/supabase";
import { Loader } from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("appointments");
  
  const { data: session, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await supabaseClient.auth.getSession();
      return data.session;
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-tulip-dark-blue" />
          <span className="ml-2">Loading dashboard...</span>
        </main>
        <Footer />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <PageHeader 
            title="Admin Access Required"
            subtitle="Please login to access the admin dashboard."
          />
          <div className="container mx-auto px-4 py-16">
            <Alert>
              <AlertDescription>
                You must be logged in as an administrator to access this page.
                Please contact your system administrator if you need access.
              </AlertDescription>
            </Alert>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <PageHeader 
          title="Admin Dashboard"
          subtitle="Manage appointments, patients, and staff."
        />
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="appointments" onValueChange={setActiveTab}>
              <TabsList className="mb-8 w-full justify-start">
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="patients">Patients</TabsTrigger>
                <TabsTrigger value="staff">Staff</TabsTrigger>
              </TabsList>
              <TabsContent value="appointments">
                <AppointmentsTab />
              </TabsContent>
              <TabsContent value="patients">
                <PatientsTab />
              </TabsContent>
              <TabsContent value="staff">
                <StaffTab />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
