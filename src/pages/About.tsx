
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/common/PageHeader";

const teamMembers = [
  {
    name: "Dr. Samarth Jain",
    title: "Lead Dentist & Founder",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    bio: "Dr. Jain graduated with honors from the MIDA and has over 13 years of experience in general and cosmetic dentistry. He founded Jain Dental Care with a vision to create a practice where patients feel valued and receive the highest quality care."
  }
];

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <PageHeader 
          title="About Jain Dental Care Centre"
          subtitle="Get to know our team and learn about our commitment to excellent dental care."
        />
        
        {/* Our Story Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
                <h2 className="text-3xl font-bold text-tulip-dark-blue mb-4">Our Story</h2>
                <p className="text-gray-700 mb-4">
                  Dr. Samarth Jain, Jain Dental Care Centre was established with one mission: to provide exceptional dental care in a comfortable, patient-centered environment.
                </p>
                <p className="text-gray-700 mb-4">
                  What started as a small practice has grown into a trusted dental clinic serving thousands of patients in our community. Our growth is a testament to our dedication to quality care and patient satisfaction.
                </p>
                <p className="text-gray-700">
                  At Jain Dental Care, we embrace technology and continuing education to stay at the forefront of modern dentistry. We're committed to making dental care accessible, comfortable, and personalized for every patient who walks through our doors.
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
                These core principles guide everything we do at Jain Dental Care Centre.
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
            
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8 w-full">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row items-center md:items-start hover:shadow-xl transition duration-300 w-full"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-40 h-40 object-cover rounded-full m-6"
                  />
                  <div className="p-6 flex-1 text-center md:text-left">
                    <h3 className="text-4xl font-bold text-tulip-dark-blue mb-2">
                      {member.name}
                    </h3>
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
