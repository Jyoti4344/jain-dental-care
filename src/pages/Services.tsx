
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/common/PageHeader";
import CTASection from "@/components/home/CTASection";
import { Tooth, Smile, AlarmClock, Stethoscope, Baby, Heart, PenTool, Droplet, UserPlus } from "lucide-react";

const servicesData = [
  {
    icon: <Tooth className="w-12 h-12 text-tulip-dark-blue mb-4" />,
    title: "General Dentistry",
    description: "Our comprehensive general dentistry services focus on prevention, diagnosis, and treatment of various dental issues to maintain your oral health.",
    treatments: [
      "Dental Exams & Cleanings",
      "Digital X-rays",
      "Fillings",
      "Root Canal Therapy",
      "Extractions",
      "Oral Cancer Screenings"
    ]
  },
  {
    icon: <Smile className="w-12 h-12 text-tulip-dark-blue mb-4" />,
    title: "Cosmetic Dentistry",
    description: "Enhance your smile with our range of cosmetic dentistry treatments designed to improve the appearance of your teeth and overall smile.",
    treatments: [
      "Teeth Whitening",
      "Porcelain Veneers",
      "Cosmetic Bonding",
      "Smile Makeovers",
      "Gum Recontouring",
      "Tooth-Colored Fillings"
    ]
  },
  {
    icon: <Stethoscope className="w-12 h-12 text-tulip-dark-blue mb-4" />,
    title: "Orthodontics",
    description: "Straighten your teeth and correct your bite with our modern orthodontic solutions for patients of all ages.",
    treatments: [
      "Traditional Braces",
      "Clear Aligners",
      "Retainers",
      "Early Orthodontic Treatment",
      "Adult Orthodontics",
      "Post-Treatment Care"
    ]
  },
  {
    icon: <UserPlus className="w-12 h-12 text-tulip-dark-blue mb-4" />,
    title: "Restorative Dentistry",
    description: "Restore damaged or missing teeth with our comprehensive restorative treatments to bring back your healthy, functional smile.",
    treatments: [
      "Dental Implants",
      "Crowns & Bridges",
      "Dentures",
      "Inlays & Onlays",
      "Full Mouth Reconstruction",
      "Implant-Supported Prosthetics"
    ]
  },
  {
    icon: <Baby className="w-12 h-12 text-tulip-dark-blue mb-4" />,
    title: "Pediatric Dentistry",
    description: "Special dental care for children in a friendly, comfortable environment designed to make dental visits a positive experience.",
    treatments: [
      "Child Dental Exams",
      "Gentle Cleanings",
      "Fluoride Treatments",
      "Dental Sealants",
      "Space Maintainers",
      "Early Dental Education"
    ]
  },
  {
    icon: <AlarmClock className="w-12 h-12 text-tulip-dark-blue mb-4" />,
    title: "Emergency Dental Care",
    description: "Quick relief for dental emergencies with same-day appointments for patients in pain or with urgent dental issues.",
    treatments: [
      "Toothache Relief",
      "Broken/Chipped Tooth Repair",
      "Lost Filling/Crown Replacement",
      "Abscess Treatment",
      "Emergency Extractions",
      "Trauma Care"
    ]
  },
  {
    icon: <Droplet className="w-12 h-12 text-tulip-dark-blue mb-4" />,
    title: "Periodontal Therapy",
    description: "Treatment and management of gum disease to maintain healthy gums and protect your teeth from damage.",
    treatments: [
      "Scaling & Root Planing",
      "Gum Disease Treatment",
      "Periodontal Maintenance",
      "Antibiotic Therapy",
      "Gum Grafting",
      "Laser Gum Therapy"
    ]
  },
  {
    icon: <PenTool className="w-12 h-12 text-tulip-dark-blue mb-4" />,
    title: "Specialized Care",
    description: "Advanced dental treatments and specialized services to address complex dental issues and enhance your oral health.",
    treatments: [
      "Sleep Apnea Treatment",
      "TMJ Therapy",
      "Custom Mouthguards",
      "Oral Surgery",
      "Sedation Dentistry",
      "Dental Implants"
    ]
  },
  {
    icon: <Heart className="w-12 h-12 text-tulip-dark-blue mb-4" />,
    title: "Preventive Care",
    description: "Focus on preventing dental issues before they start with regular check-ups and proactive dental health measures.",
    treatments: [
      "Regular Dental Check-ups",
      "Professional Cleanings",
      "Dental Sealants",
      "Fluoride Treatments",
      "Oral Hygiene Education",
      "Nutrition Counseling"
    ]
  }
];

const Services = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <PageHeader 
          title="Our Dental Services"
          subtitle="Comprehensive dental care for the whole family with a focus on comfort and quality."
        />
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-tulip-dark-blue mb-4">Comprehensive Dental Care</h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                At Tulip Dental Clinic, we offer a wide range of dental services to meet the needs of your entire family,
                all delivered with expertise and compassion.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-12">
              {servicesData.map((service, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 flex justify-center md:justify-start mb-6 md:mb-0">
                      <div className="flex items-center justify-center">
                        {service.icon}
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <h3 className="text-2xl font-bold text-tulip-dark-blue mb-4">{service.title}</h3>
                      <p className="text-gray-700 mb-6">{service.description}</p>
                      <div>
                        <h4 className="font-semibold text-lg mb-3">Treatments Include:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {service.treatments.map((treatment, i) => (
                            <div key={i} className="flex items-center">
                              <div className="w-2 h-2 bg-tulip-blue rounded-full mr-2"></div>
                              <span className="text-gray-700">{treatment}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Services;
