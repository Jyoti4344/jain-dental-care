
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "The Importance of Regular Dental Check-ups",
    excerpt: "Regular dental check-ups are crucial for maintaining good oral health. Learn why you shouldn't skip your bi-annual visits.",
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    author: "Dr. Sophia Kim",
    date: "April 15, 2025",
    category: "Preventive Care"
  },
  {
    id: 2,
    title: "Tips for Maintaining Your Child's Dental Health",
    excerpt: "Help your child develop good oral hygiene habits early with these practical tips for parents.",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    author: "Dr. Emily Rodriguez",
    date: "April 8, 2025",
    category: "Pediatric Dentistry"
  },
  {
    id: 3,
    title: "Understanding Different Types of Dental Fillings",
    excerpt: "Learn about the different materials used for dental fillings and which might be best for your specific needs.",
    image: "https://images.unsplash.com/photo-1581585375236-9566fdbc756f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    author: "Dr. James Wilson",
    date: "April 1, 2025",
    category: "Restorative Dentistry"
  },
  {
    id: 4,
    title: "The Link Between Oral Health and Overall Wellness",
    excerpt: "Discover how taking care of your teeth and gums can positively impact your overall health and well-being.",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    author: "Dr. Sophia Kim",
    date: "March 25, 2025",
    category: "Health"
  },
  {
    id: 5,
    title: "Modern Orthodontic Options for Adults",
    excerpt: "It's never too late to straighten your teeth. Explore the modern orthodontic options available for adults.",
    image: "https://images.unsplash.com/photo-1625155011596-5a5e74dcf689?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    author: "Dr. James Wilson",
    date: "March 18, 2025",
    category: "Orthodontics"
  },
  {
    id: 6,
    title: "How to Handle Common Dental Emergencies",
    excerpt: "Be prepared for dental emergencies with this guide on how to handle common urgent dental situations.",
    image: "https://images.unsplash.com/photo-1590424593671-1ce7a9c4dc1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    author: "Dr. Emily Rodriguez",
    date: "March 10, 2025",
    category: "Emergency Care"
  }
];

const categories = [
  "All",
  "Preventive Care",
  "Cosmetic Dentistry",
  "Orthodontics",
  "Pediatric Dentistry",
  "Emergency Care",
  "Health",
  "Restorative Dentistry"
];

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  
  // Filter posts based on search term and category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <PageHeader 
          title="Dental Health Blog"
          subtitle="Stay informed with the latest dental tips, news, and insights from our experts."
        />
        
        <section className="py-16 bg-tulip-gray">
          <div className="container mx-auto px-4">
            {/* Search and Filter */}
            <div className="mb-12">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search articles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
                <div className="w-full md:w-2/3 flex flex-wrap gap-2">
                  {categories.map((category, index) => (
                    <Button
                      key={index}
                      variant={activeCategory === category ? "default" : "outline"}
                      className={activeCategory === category 
                        ? "bg-tulip-dark-blue hover:bg-blue-900" 
                        : "text-gray-700 hover:text-tulip-dark-blue"
                      }
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Blog Posts */}
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md hover-lift">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <span className="text-sm font-medium px-3 py-1 rounded-full bg-tulip-light-purple text-tulip-dark-blue">
                          {post.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-tulip-dark-blue mb-3">{post.title}</h3>
                      <p className="text-gray-600 mb-5">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{post.date}</span>
                        <span className="text-sm font-medium text-tulip-dark-blue">{post.author}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-bold text-tulip-dark-blue mb-2">No articles found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
