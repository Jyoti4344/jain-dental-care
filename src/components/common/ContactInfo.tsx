
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const ContactInfo = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-tulip-dark-blue mb-6">Contact Information</h3>
      
      <div className="space-y-6">
        <div className="flex items-start">
          <MapPin size={24} className="text-tulip-dark-blue mr-4 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold mb-1">Address</h4>
            <p className="text-gray-700">3236, 31, Vishnu Garden, Ward-30, Block-B, Sector-105</p>
            <p className="text-gray-700">Gurugram, Haryana, 122006</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Phone size={24} className="text-tulip-dark-blue mr-4 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold mb-1">Phone</h4>
            <p className="text-gray-700">(91)-8447945913</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Mail size={24} className="text-tulip-dark-blue mr-4 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold mb-1">Email</h4>
            <p className="text-gray-700">samarth.jain459@gmail.com</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Clock size={24} className="text-tulip-dark-blue mr-4 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold mb-1">Hours</h4>
            <p className="text-gray-700">Morning: 10:00 AM - 2:00 PM</p>
            <p className="text-gray-700">Evening: 5:00 AM - 8:00 PM</p>
            <p className="text-gray-700">Sunday: Closed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
