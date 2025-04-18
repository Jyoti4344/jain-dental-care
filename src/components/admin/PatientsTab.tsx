
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
import { Loader, Search, Plus, User, Calendar, Phone, Mail } from "lucide-react";
import { format, parseISO } from "date-fns";

const PatientsTab = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: patients, isLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const { data, error } = await supabaseClient
        .from("patients")
        .select("*")
        .order("last_name", { ascending: true });

      if (error) {
        throw error;
      }

      return data || [];
    },
  });

  // Filter patients based on search query
  const filteredPatients = patients?.filter((patient) => {
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
    const email = patient.email.toLowerCase();
    const phone = patient.phone;
    const query = searchQuery.toLowerCase();
    
    return fullName.includes(query) || email.includes(query) || phone.includes(query);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search patients..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Patient
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
              <DialogDescription>
                Add a new patient to the system.
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
              <Button type="submit">Save Patient</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader className="h-8 w-8 animate-spin text-tulip-dark-blue" />
          <span className="ml-2">Loading patients...</span>
        </div>
      ) : filteredPatients && filteredPatients.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-tulip-gray flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <span className="font-medium">{`${patient.first_name} ${patient.last_name}`}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <Mail className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                      <span>{patient.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                      <span>{patient.phone}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {patient.date_of_birth ? (
                    <div className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                      {format(parseISO(patient.date_of_birth), "MMM dd, yyyy")}
                    </div>
                  ) : (
                    <span className="text-gray-400">Not provided</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">View Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-10 border rounded-md bg-gray-50">
          <p className="text-gray-500">No patients found.</p>
        </div>
      )}
    </div>
  );
};

export default PatientsTab;
