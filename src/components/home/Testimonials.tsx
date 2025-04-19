
import { Card, CardContent } from "@/components/ui/card";
import { QuoteIcon } from "lucide-react";

const testimonialsData = [
  {
    quote: "After years of dental anxiety, the team at Jain Dental made me feel completely at ease. Their gentle approach and modern pain management techniques made my root canal surprisingly comfortable!",
    name: "Rishabh Sharma",
    title: "Patient for 2 years"
  },
  {
    quote: "My entire family sees Dr. Samarth at Jain Dental. Her ability to connect with our kids is amazing - they actually look forward to their dental checkups now, which I never thought possible!",
    name: "Tripti Pathi",
    title: "Patient for 3 years"
  },
  {
    quote: "The cosmetic work I had done at Jain Dental exceeded my expectations. My smile transformation has given me so much confidence, and the results look completely natural.",
    name: "Tushar Gupta",
    title: "Patient for 1 year"
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-tulip-light-purple">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-tulip-dark-blue mb-4">What Our Patients Say</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            We pride ourselves on providing exceptional dental care and creating positive experiences for our patients.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <Card key={index} className="bg-white hover-lift">
              <CardContent className="pt-8">
                <QuoteIcon size={36} className="text-tulip-blue mb-4" />
                <p className="mb-6 text-gray-700 italic">{testimonial.quote}</p>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
