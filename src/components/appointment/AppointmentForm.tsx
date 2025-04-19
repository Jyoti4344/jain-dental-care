import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabaseClient } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  date: z.date({
    required_error: "Please select a date for your appointment.",
  }),
  time: z.string({
    required_error: "Please select a time slot.",
  }),
  service: z.string({
    required_error: "Please select a service.",
  }),
  message: z.string().optional(),
});

const ensureDefaultServices = async () => {
  console.log("Checking for default services...");
  
  const { count } = await supabaseClient
    .from('services')
    .select('*', { count: 'exact', head: true });
  
  console.log(`Found ${count} services`);
  
  if (!count || count < 1) {
    console.log("No services found. Adding default services...");
    
    const defaultServices = [
      { 
        name: "Regular Checkup", 
        description: "Comprehensive dental examination and consultation", 
        duration: 30, 
        price: 50 
      },
      { 
        name: "Teeth Cleaning", 
        description: "Professional dental cleaning and polishing", 
        duration: 60, 
        price: 80 
      },
      { 
        name: "Root Canal", 
        description: "Treatment for infected tooth pulp", 
        duration: 90, 
        price: 200 
      },
      { 
        name: "Tooth Extraction", 
        description: "Safe removal of damaged or problematic teeth", 
        duration: 45, 
        price: 150 
      }
    ];
    
    const { error } = await supabaseClient
      .from('services')
      .insert(defaultServices);
      
    if (error) {
      console.error("Error adding default services:", error);
    } else {
      console.log("Default services added successfully");
    }
  }
};

const AppointmentForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    ensureDefaultServices();
  }, []);

  const { data: services, isLoading: loadingServices, error: servicesError } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      console.log("Fetching services...");
      
      try {
        const { data, error } = await supabaseClient
          .from("services")
          .select("id, name, duration, price, description");
        
        if (error) {
          console.error("Error fetching services:", error);
          throw error;
        }
        
        console.log("Services fetched:", data);
        
        if (!data || data.length === 0) {
          console.log("No services found. Attempting to add defaults...");
          await ensureDefaultServices();
          
          // Try fetching again
          const { data: retryData, error: retryError } = await supabaseClient
            .from("services")
            .select("id, name, duration, price, description");
            
          if (retryError) {
            console.error("Error in retry fetch:", retryError);
            throw retryError;
          }
          
          console.log("Retry services fetch result:", retryData);
          return retryData || [];
        }
        
        return data;
      } catch (err) {
        console.error("Unexpected error in service fetch:", err);
        throw err;
      }
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  useEffect(() => {
    const updateTimeSlots = async () => {
      if (!selectedDate) return;
      
      const baseTimeSlots = [
        "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", 
        "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM", 
        "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM"
      ];
      
      try {
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        
        const { data: bookedAppointments } = await supabaseClient
          .from("appointments")
          .select("appointment_time")
          .eq("appointment_date", formattedDate);
          
        const bookedTimes = (bookedAppointments || []).map(app => app.appointment_time);
        const availableTimes = baseTimeSlots.filter(time => !bookedTimes.includes(time));
        
        setAvailableTimeSlots(availableTimes);
      } catch (error) {
        console.error("Error fetching time slots:", error);
        setAvailableTimeSlots(baseTimeSlots);
      }
    };
    
    updateTimeSlots();
  }, [selectedDate]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      const { data: existingPatients, error: patientError } = await supabaseClient
        .from("patients")
        .select("id")
        .eq("email", data.email)
        .maybeSingle();
        
      if (patientError) throw patientError;
      
      let patientId;
      
      if (!existingPatients) {
        const { data: newPatient, error: createError } = await supabaseClient
          .from("patients")
          .insert({
            first_name: data.name.split(' ')[0],
            last_name: data.name.split(' ').slice(1).join(' ') || '',
            email: data.email,
            phone: data.phone
          })
          .select("id")
          .single();
          
        if (createError) throw createError;
        patientId = newPatient.id;
      } else {
        patientId = existingPatients.id;
      }
      
      const { error: appointmentError } = await supabaseClient
        .from("appointments")
        .insert({
          patient_id: patientId,
          service_id: data.service,
          appointment_date: format(data.date, "yyyy-MM-dd"),
          appointment_time: data.time,
          status: "scheduled",
          notes: data.message || null
        });
        
      if (appointmentError) throw appointmentError;
      
      toast("Appointment scheduled", {
        description: "We will contact you shortly to confirm your appointment."
      });
      
      form.reset();
      setSelectedDate(null);
    } catch (error: any) {
      console.error("Error submitting appointment:", error);
      toast("Something went wrong", {
        description: "Unable to schedule appointment. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const watchDate = form.watch("date");
  useEffect(() => {
    if (watchDate) {
      setSelectedDate(watchDate);
    }
  }, [watchDate]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-tulip-dark-blue mb-6">Request an Appointment</h2>
      
      {servicesError && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            Failed to load services. Please refresh the page or try again later.
            Error: {servicesError.message}
          </AlertDescription>
        </Alert>
      )}
      
      {loadingServices && (
        <Alert className="mb-6">
          <AlertDescription>Loading available services...</AlertDescription>
        </Alert>
      )}
      
      {!loadingServices && services && services.length === 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            No services are currently available. Please contact the clinic directly.
          </AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="(91) 88888-88888" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Preferred Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today || date > new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
                        }}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Time</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!selectedDate || availableTimeSlots.length === 0}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableTimeSlots.length > 0 ? (
                        availableTimeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          {selectedDate ? "No times available" : "Select a date first"}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="service"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {services && services.length > 0 ? (
                      services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - ${service.price} ({service.duration} min)
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        {loadingServices ? "Loading services..." : "No services available"}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Information</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Please share any specific concerns or additional information..."
                    className="min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-tulip-dark-blue hover:bg-blue-900 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Request Appointment"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AppointmentForm;
