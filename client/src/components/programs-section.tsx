import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Computer, 
  Building2, 
  Microscope, 
  Brain, 
  TrendingUp, 
  Leaf,
  ArrowRight 
} from "lucide-react";
import type { Program } from "@shared/schema";

const programIcons = {
  computer: Computer,
  business: Building2,
  science: Microscope,
  psychology: Brain,
  economics: TrendingUp,
  environmental: Leaf,
};

const programColors = {
  computer: "bg-institute-blue",
  business: "bg-institute-green",
  science: "bg-institute-orange",
  psychology: "bg-purple-600",
  economics: "bg-red-600",
  environmental: "bg-teal-600",
};

export default function ProgramsSection() {
  const { data: programs, isLoading } = useQuery<Program[]>({
    queryKey: ["/api/programs"],
  });

  // Default programs if API fails
  const defaultPrograms = [
    {
      id: 1,
      name: "Computer Science",
      description: "Cutting-edge curriculum covering AI, machine learning, cybersecurity, and software engineering.",
      duration: "4 Years",
      degree: "Bachelor's",
      icon: "computer",
      color: "computer",
      isActive: true,
    },
    {
      id: 2,
      name: "Business Administration",
      description: "Comprehensive business education with focus on leadership, strategy, and innovation.",
      duration: "2 Years",
      degree: "Master's",
      icon: "business",
      color: "business",
      isActive: true,
    },
    {
      id: 3,
      name: "Biomedical Engineering",
      description: "Interdisciplinary program combining engineering principles with medical sciences.",
      duration: "4 Years",
      degree: "Bachelor's",
      icon: "science",
      color: "science",
      isActive: true,
    },
    {
      id: 4,
      name: "Psychology",
      description: "Evidence-based approach to understanding human behavior and mental processes.",
      duration: "4 Years",
      degree: "Bachelor's",
      icon: "psychology",
      color: "psychology",
      isActive: true,
    },
    {
      id: 5,
      name: "Economics",
      description: "Comprehensive study of economic theory, policy analysis, and quantitative methods.",
      duration: "3 Years",
      degree: "Bachelor's",
      icon: "economics",
      color: "economics",
      isActive: true,
    },
    {
      id: 6,
      name: "Environmental Science",
      description: "Interdisciplinary approach to understanding and solving environmental challenges.",
      duration: "4 Years",
      degree: "Bachelor's",
      icon: "environmental",
      color: "environmental",
      isActive: true,
    },
  ];

  const displayPrograms = programs || defaultPrograms;

  return (
    <section id="programs" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-roboto-slab text-4xl font-bold text-institute-gray mb-4">Academic Programs</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our comprehensive range of undergraduate, graduate, and professional programs designed to meet the evolving needs of today's global economy.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="material-shadow p-6">
                  <CardContent className="p-0">
                    <Skeleton className="w-12 h-12 rounded-lg mb-4" />
                    <Skeleton className="h-6 mb-3" />
                    <Skeleton className="h-4 mb-4" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-6" />
                    </div>
                  </CardContent>
                </Card>
              ))
            : displayPrograms.map((program) => {
                const IconComponent = programIcons[program.icon as keyof typeof programIcons] || Computer;
                const colorClass = programColors[program.color as keyof typeof programColors] || "bg-institute-blue";
                
                return (
                  <Card key={program.id} className="material-shadow hover:material-shadow-lg transition-all p-6 border border-gray-100">
                    <CardContent className="p-0">
                      <div className={`w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center mb-4`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-roboto-slab text-xl font-bold text-institute-gray mb-3">{program.name}</h3>
                      <p className="text-gray-600 mb-4">{program.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-institute-blue font-medium">{program.duration} • {program.degree}</span>
                        <Button variant="ghost" size="sm" className="text-institute-blue hover:text-institute-blue-dark p-0">
                          <ArrowRight className="h-5 w-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
        </div>
        
        <div className="text-center mt-12">
          <Button className="bg-institute-blue hover:bg-institute-blue-dark text-white px-8 py-3 rounded-lg font-medium text-lg material-shadow transition-all">
            View All Programs
          </Button>
        </div>
      </div>
    </section>
  );
}
