import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, ExternalLink } from "lucide-react";
import type { Faculty } from "@shared/schema";

export default function FacultySection() {
  const { data: faculty, isLoading } = useQuery<Faculty[]>({
    queryKey: ["/api/faculty"],
  });

  // Default faculty if API fails
  const defaultFaculty = [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      department: "Computer Science",
      specialization: "AI & Machine Learning Research",
      email: "s.chen@excellence.edu",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=200&h=200&fit=crop&crop=face",
      bio: "Leading researcher in artificial intelligence and machine learning.",
      isActive: true,
    },
    {
      id: 2,
      name: "Prof. Michael Rodriguez",
      department: "Business",
      specialization: "Strategic Management",
      email: "m.rodriguez@excellence.edu",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=200&h=200&fit=crop&crop=face",
      bio: "Expert in strategic management and organizational leadership.",
      isActive: true,
    },
    {
      id: 3,
      name: "Dr. Emily Watson",
      department: "Psychology",
      specialization: "Cognitive Neuroscience",
      email: "e.watson@excellence.edu",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b547?ixlib=rb-4.0.3&w=200&h=200&fit=crop&crop=face",
      bio: "Specialist in cognitive neuroscience and behavioral psychology.",
      isActive: true,
    },
    {
      id: 4,
      name: "Dr. James Park",
      department: "Engineering",
      specialization: "Biomedical Engineering",
      email: "j.park@excellence.edu",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&w=200&h=200&fit=crop&crop=face",
      bio: "Biomedical engineer focusing on medical device innovation.",
      isActive: true,
    },
  ];

  const displayFaculty = faculty || defaultFaculty;

  return (
    <section id="faculty" className="py-20 bg-institute-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-roboto-slab text-4xl font-bold text-institute-gray mb-4">Distinguished Faculty</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn from world-renowned experts and thought leaders who are shaping the future of their respective fields.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="material-shadow p-6 text-center">
                  <CardContent className="p-0">
                    <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
                    <Skeleton className="h-5 mb-1" />
                    <Skeleton className="h-4 mb-2" />
                    <Skeleton className="h-3 mb-4" />
                    <div className="flex justify-center space-x-3">
                      <Skeleton className="w-8 h-8" />
                      <Skeleton className="w-8 h-8" />
                    </div>
                  </CardContent>
                </Card>
              ))
            : displayFaculty.map((member) => (
                <Card key={member.id} className="bg-white material-shadow hover:material-shadow-lg transition-all p-6 text-center">
                  <CardContent className="p-0">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarImage src={member.avatar || undefined} alt={member.name} />
                      <AvatarFallback className="text-lg">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-roboto-slab text-lg font-bold text-institute-gray mb-1">{member.name}</h3>
                    <p className="text-institute-blue font-medium mb-2">{member.department}</p>
                    <p className="text-gray-600 text-sm mb-4">{member.specialization}</p>
                    <div className="flex justify-center space-x-3">
                      <Button variant="ghost" size="sm" className="p-2 text-gray-500 hover:text-institute-blue">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-2 text-gray-500 hover:text-institute-blue">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>
        
        <div className="text-center mt-12">
          <Button className="bg-institute-blue hover:bg-institute-blue-dark text-white px-8 py-3 rounded-lg font-medium text-lg material-shadow transition-all">
            Meet All Faculty
          </Button>
        </div>
      </div>
    </section>
  );
}
