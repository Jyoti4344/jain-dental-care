
import { Shield, Award, Clock, Users } from "lucide-react";

const features = [
  {
    icon: <Shield size={40} className="text-tulip-dark-blue mb-4" />,
    title: "Modern Technology",
    description: "We use the latest dental technology and techniques to provide safe, effective treatments with optimal outcomes."
  },
  {
    icon: <Award size={40} className="text-tulip-dark-blue mb-4" />,
    title: "Expert Team",
    description: "Our dentists and staff are highly trained professionals committed to continuing education and excellence."
  },
  {
    icon: <Clock size={40} className="text-tulip-dark-blue mb-4" />,
    title: "Convenient Hours",
    description: "We offer flexible scheduling with early morning and evening appointments to accommodate your busy life."
  },
  {
    icon: <Users size={40} className="text-tulip-dark-blue mb-4" />,
    title: "Family Friendly",
    description: "We welcome patients of all ages and create a comfortable, relaxing environment for everyone."
  }
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-tulip-light-blue">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-tulip-dark-blue mb-4">Why Choose Jain Dental Care Centre</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            We combine modern dental technology with personalized care to deliver an exceptional experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm hover-lift">
              <div className="flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-tulip-dark-blue">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
