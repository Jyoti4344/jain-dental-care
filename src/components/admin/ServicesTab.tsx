
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { getAllServices } from "@/lib/supabase";

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
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Clock, DollarSign, Trash2 } from "lucide-react";

const serviceFormSchema = z.object({
  name: z.string().min(2, { message: "Service name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  duration: z.coerce.number().min(15, { message: "Duration must be at least 15 minutes" }),
  price: z.coerce.number().min(0, { message: "Price cannot be negative" }),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

const SERVICES_KEY = 'tulip_dental_services';

const ServicesTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: "",
      description: "",
      duration: 30,
      price: 0,
    },
  });

  // Load services from localStorage
  useEffect(() => {
    const loadServices = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await getAllServices();
        
        if (error) {
          throw error;
        }
        
        setServices(data || []);
      } catch (error) {
        console.error("Error loading services:", error);
        toast.error("Failed to load services");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadServices();
  }, []);

  // Filter services based on search query
  const filteredServices = services?.filter((service) => {
    const name = service.name.toLowerCase();
    const description = service.description.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return name.includes(query) || description.includes(query);
  });

  const onSubmit = async (data: ServiceFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Add service to localStorage
      const services = JSON.parse(localStorage.getItem(SERVICES_KEY) || '[]');
      
      const newService = {
        id: `service_${Date.now()}`,
        name: data.name,
        description: data.description,
        duration: data.duration,
        price: data.price,
      };
      
      services.push(newService);
      localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
      
      // Update local state
      setServices(services);
      
      toast.success("Service added successfully");
      form.reset();
      setIsAddServiceOpen(false);
    } catch (error: any) {
      toast.error("Failed to add service", {
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    
    try {
      // Remove service from localStorage
      const services = JSON.parse(localStorage.getItem(SERVICES_KEY) || '[]');
      const updatedServices = services.filter((service: any) => service.id !== id);
      
      localStorage.setItem(SERVICES_KEY, JSON.stringify(updatedServices));
      
      // Update local state
      setServices(updatedServices);
      
      toast.success("Service deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete service", {
        description: error.message,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search services..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsAddServiceOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Loading services...</div>
      ) : filteredServices && filteredServices.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.map((service) => (
              <TableRow key={service.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm text-gray-500 line-clamp-1">{service.description}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1.5 text-gray-500" />
                    {service.duration} min
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                    {service.price.toFixed(2)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-2 text-red-500 hover:text-red-600" 
                    onClick={() => handleDeleteService(service.id)}
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
          <p className="text-gray-500">No services found.</p>
        </div>
      )}
      
      <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>
              Create a new dental service that will be available for appointment booking.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Teeth Cleaning" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="A thorough cleaning to remove plaque and tartar..." 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" min={15} step={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} step={0.01} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddServiceOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Service"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicesTab;
