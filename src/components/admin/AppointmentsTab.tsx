
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabaseClient } from "@/lib/supabase";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Loader, Search, Plus, Calendar, Clock, Edit, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const AppointmentsTab = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  const { data: appointments, isLoading, refetch } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const { data, error } = await supabaseClient
        .from("appointments")
        .select(`
          id,
          appointment_date,
          appointment_time,
          status,
          notes,
          patients(first_name, last_name, email, phone),
          services(name, duration)
        `)
        .order("appointment_date", { ascending: true });

      if (error) {
        throw error;
      }

      return data || [];
    },
  });

  const handleDeleteAppointment = async () => {
    if (!selectedAppointmentId) return;

    try {
      const { error } = await supabaseClient
        .from("appointments")
        .delete()
        .eq("id", selectedAppointmentId);

      if (error) throw error;

      toast({
        title: "Appointment deleted",
        description: "The appointment has been successfully removed.",
      });

      refetch();
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast({
        title: "Error",
        description: "Failed to delete the appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedAppointmentId(null);
    }
  };

  const confirmDelete = (id: string) => {
    setSelectedAppointmentId(id);
    setIsDeleteDialogOpen(true);
  };

  // Filter appointments based on search query
  const filteredAppointments = appointments?.filter((appointment) => {
    const patientName = `${appointment.patients?.first_name} ${appointment.patients?.last_name}`.toLowerCase();
    const serviceName = appointment.services?.name.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    
    return patientName.includes(query) || serviceName.includes(query);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search appointments..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Appointment</DialogTitle>
              <DialogDescription>
                Create a new appointment for a patient.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-center text-gray-500">
                This feature will be implemented in the next phase.
              </p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {}}>
                Cancel
              </Button>
              <Button type="submit">Save Appointment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader className="h-8 w-8 animate-spin text-tulip-dark-blue mb-4" />
          <p>Loading appointments...</p>
          <Progress value={45} className="w-64 mt-4" />
        </div>
      ) : filteredAppointments && filteredAppointments.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                      {format(parseISO(appointment.appointment_date), "MMM dd, yyyy")}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1.5 text-gray-400" />
                      {appointment.appointment_time}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{`${appointment.patients?.first_name} ${appointment.patients?.last_name}`}</p>
                    <p className="text-sm text-gray-500">{appointment.patients?.phone}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p>{appointment.services?.name}</p>
                    <p className="text-sm text-gray-500">{appointment.services?.duration} min</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 
                      appointment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      'bg-red-100 text-red-800'}`
                  }>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => confirmDelete(appointment.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-10 border rounded-md bg-gray-50">
          <p className="text-gray-500">No appointments found.</p>
        </div>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this appointment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAppointment} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AppointmentsTab;
