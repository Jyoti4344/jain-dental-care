
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/common/PageHeader";
import AdminHeader from "@/components/admin/AdminHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppointmentsTab from "@/components/admin/AppointmentsTab";
import PatientsTab from "@/components/admin/PatientsTab";
import StaffTab from "@/components/admin/StaffTab";
import ServicesTab from "@/components/admin/ServicesTab";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getSession, checkStaffRole } from "@/lib/supabase";
import { Loader } from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("appointments");
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [staffInfo, setStaffInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // Get session from localStorage
        const { session, error } = await getSession();
        setSession(session);
        
        if (!session) {
          // Redirect to login if no session
          navigate('/admin/login');
          return;
        }
        
        // Check if user is admin
        const { role, staffRecord } = await checkStaffRole(session.user.id);
        
        if (role !== 'admin') {
          // Sign out and redirect if not admin
          localStorage.removeItem('tulip_dental_auth_session');
          navigate('/admin/login');
          return;
        }
        
        setStaffInfo(staffRecord);
      } catch (error) {
        console.error("Error checking authentication:", error);
        navigate('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

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

  if (!session || !staffInfo) {
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
            <AdminHeader 
              userName={`${staffInfo.first_name} ${staffInfo.last_name}`} 
              userRole={staffInfo.role} 
            />
            
            <Tabs defaultValue="appointments" onValueChange={setActiveTab}>
              <TabsList className="mb-8 w-full justify-start">
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="patients">Patients</TabsTrigger>
                <TabsTrigger value="staff">Staff</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
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
              <TabsContent value="services">
                <ServicesTab />
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
