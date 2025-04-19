
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
import { Search, Plus, User } from "lucide-react";
import StaffForm from "./StaffForm";

const StaffTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);

  const { data: staff, isLoading, refetch } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const { data, error } = await supabaseClient
        .from("staff")
        .select("*")
        .order("last_name", { ascending: true });

      if (error) {
        throw error;
      }

      return data || [];
    },
  });

  // Filter staff based on search query
  const filteredStaff = staff?.filter((member) => {
    const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
    const role = member.role.toLowerCase();
    const specialization = member.specialization?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    
    return fullName.includes(query) || role.includes(query) || specialization.includes(query);
  });

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'dentist':
        return 'bg-blue-100 text-blue-800';
      case 'hygienist':
        return 'bg-green-100 text-green-800';
      case 'receptionist':
        return 'bg-yellow-100 text-yellow-800';
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleAddStaffSuccess = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search staff..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsAddStaffOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Staff Member
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Loading staff...</div>
      ) : filteredStaff && filteredStaff.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Staff Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaff.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center">
                    {member.profile_image_url ? (
                      <img
                        src={member.profile_image_url}
                        alt={`${member.first_name} ${member.last_name}`}
                        className="h-10 w-10 rounded-full object-cover mr-3"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-tulip-gray flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{`${member.first_name} ${member.last_name}`}</div>
                      {member.specialization && (
                        <div className="text-sm text-gray-500">{member.specialization}</div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </span>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="text-sm">{member.email}</div>
                    <div className="text-sm text-gray-500">{member.phone}</div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm" className="ml-2">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-10 border rounded-md bg-gray-50">
          <p className="text-gray-500">No staff members found.</p>
        </div>
      )}
      
      <StaffForm 
        isOpen={isAddStaffOpen}
        onClose={() => setIsAddStaffOpen(false)}
        onSuccess={handleAddStaffSuccess}
      />
    </div>
  );
};

export default StaffTab;
