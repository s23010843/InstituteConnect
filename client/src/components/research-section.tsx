
import { Button } from "@/components/ui/button";
import { 
  Microscope, 
  Bot, 
  Leaf 
} from "lucide-react";

export default function ResearchSection() {
  const researchAreas = [
    {
      icon: Microscope,
      title: "Biotechnology & Healthcare",
      description: "Advanced research in gene therapy, personalized medicine, and medical devices.",
      color: "bg-institute-blue",
    },
    {
      icon: Bot,
      title: "Artificial Intelligence",
      description: "Cutting-edge AI research in machine learning, robotics, and neural networks.",
      color: "bg-institute-green",
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "Environmental solutions, renewable energy, and sustainable technologies.",
      color: "bg-institute-orange",
    },
  ];

  const researchImages = [
    "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
    "https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
  ];

  return (
    <section id="research" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="font-roboto-slab text-4xl font-bold text-institute-gray mb-4">Groundbreaking Research</h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Our research initiatives address some of the world's most pressing challenges, from climate change to artificial intelligence, healthcare innovation to sustainable development.
              </p>
            </div>
            
            {/* Research Areas */}
            <div className="space-y-4">
              {researchAreas.map((area) => (
                <div key={area.title} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-12 h-12 ${area.color} rounded-lg flex items-center justify-center`}>
                    <area.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-institute-gray">{area.title}</h3>
                    <p className="text-gray-600 text-sm">{area.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Button className="bg-institute-blue hover:bg-institute-blue-dark text-white px-8 py-3 rounded-lg font-medium material-shadow transition-all">
              Explore Research Centers
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <img 
              src={researchImages[0]} 
              alt="Research laboratory" 
              className="rounded-xl material-shadow w-full h-auto object-cover"
            />
            <img 
              src={researchImages[1]} 
              alt="Students in robotics lab" 
              className="rounded-xl material-shadow mt-8 w-full h-auto object-cover"
            />
            <img 
              src={researchImages[2]} 
              alt="Microscope research" 
              className="rounded-xl material-shadow -mt-8 w-full h-auto object-cover"
            />
            <img 
              src={researchImages[3]} 
              alt="Research facility" 
              className="rounded-xl material-shadow w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
