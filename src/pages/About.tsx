
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/common/PageHeader";

const teamMembers = [
  {
    name: "Dr. Sophia Kim",
    title: "Lead Dentist & Founder",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    bio: "Dr. Kim graduated with honors from the University of Dental Medicine and has over 15 years of experience in general and cosmetic dentistry. She founded Tulip Dental with a vision to create a practice where patients feel valued and receive the highest quality care."
  },
  {
    name: "Dr. James Wilson",
    title: "Orthodontist",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    bio: "Dr. Wilson specializes in orthodontics and is passionate about creating beautiful smiles. He is certified in various orthodontic techniques including traditional braces and clear aligners, helping patients achieve their ideal smile."
  },
  {
    name: "Dr. Emily Rodriguez",
    title: "Pediatric Dentist",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    bio: "Dr. Rodriguez has a special way with young patients, making dental visits fun and stress-free for children. She completed her pediatric dentistry residency at Children's National Hospital and is dedicated to promoting good oral health habits from an early age."
  },
  {
    name: "Sarah Johnson",
    title: "Dental Hygienist",
    image: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    bio: "Sarah has been a dental hygienist for over 8 years and is known for her gentle touch and thorough cleanings. She is passionate about preventative care and educating patients on maintaining optimal oral health between visits."
  }
];

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <PageHeader 
          title="About Tulip Dental Clinic"
          subtitle="Get to know our team and learn about our commitment to excellent dental care."
        />
        
        {/* Our Story Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
                <h2 className="text-3xl font-bold text-tulip-dark-blue mb-4">Our Story</h2>
                <p className="text-gray-700 mb-4">
                  Founded in 2010 by Dr. Sophia Kim, Tulip Dental Clinic was established with one mission: to provide exceptional dental care in a comfortable, patient-centered environment.
                </p>
                <p className="text-gray-700 mb-4">
                  What started as a small practice has grown into a trusted dental clinic serving thousands of patients in our community. Our growth is a testament to our dedication to quality care and patient satisfaction.
                </p>
                <p className="text-gray-700">
                  At Tulip Dental, we embrace technology and continuing education to stay at the forefront of modern dentistry. We're committed to making dental care accessible, comfortable, and personalized for every patient who walks through our doors.
                </p>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Dental clinic reception" 
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Values Section */}
        <section className="py-16 bg-tulip-light-blue">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-tulip-dark-blue mb-4">Our Values</h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                These core principles guide everything we do at Tulip Dental Clinic.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm hover-lift">
                <h3 className="text-xl font-bold text-tulip-dark-blue mb-3">Excellence</h3>
                <p className="text-gray-700">
                  We are committed to delivering the highest quality dental care using the latest techniques and technologies.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm hover-lift">
                <h3 className="text-xl font-bold text-tulip-dark-blue mb-3">Compassion</h3>
                <p className="text-gray-700">
                  We understand dental anxiety and strive to create a gentle, supportive environment for every patient.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm hover-lift">
                <h3 className="text-xl font-bold text-tulip-dark-blue mb-3">Education</h3>
                <p className="text-gray-700">
                  We empower our patients with knowledge about their oral health to make informed decisions about their care.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Meet Our Team Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-tulip-dark-blue mb-4">Meet Our Team</h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Our highly skilled professionals are dedicated to providing you with the best dental care experience.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover-lift">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-tulip-dark-blue">{member.name}</h3>
                    <p className="text-tulip-blue font-medium mb-3">{member.title}</p>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
