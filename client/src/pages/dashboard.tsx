import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  GraduationCap, 
  BookOpen, 
  Trophy, 
  Calendar,
  Computer,
  Building2,
  Brain,
  Bell,
  LogOut
} from "lucide-react";

export default function Dashboard() {
  const { user, signOut } = useAuth();

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  const stats = [
    { label: "Current GPA", value: "3.85", icon: Trophy, color: "bg-institute-green" },
    { label: "Credits Earned", value: "87", icon: GraduationCap, color: "bg-institute-blue" },
    { label: "Current Courses", value: "5", icon: BookOpen, color: "bg-institute-orange" },
    { label: "Graduation", value: "73%", icon: Calendar, color: "bg-purple-600" },
  ];

  const courses = [
    { name: "Advanced Machine Learning", instructor: "Prof. Sarah Chen", grade: "A-", credits: 3, icon: Computer, color: "bg-institute-blue" },
    { name: "Strategic Management", instructor: "Prof. Michael Rodriguez", grade: "B+", credits: 3, icon: Building2, color: "bg-institute-green" },
    { name: "Cognitive Psychology", instructor: "Dr. Emily Watson", grade: "A", credits: 4, icon: Brain, color: "bg-institute-orange" },
  ];

  const assignments = [
    { title: "ML Project Report", course: "Advanced Machine Learning", dueDate: "Tomorrow", urgency: "high" },
    { title: "Case Study Analysis", course: "Strategic Management", dueDate: "In 3 days", urgency: "medium" },
    { title: "Research Proposal", course: "Cognitive Psychology", dueDate: "Next week", urgency: "low" },
  ];

  return (
    <div className="min-h-screen bg-institute-surface">
      {/* Header */}
      <div className="bg-white material-shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <div className="flex items-center space-x-4 hover:opacity-80 transition-opacity cursor-pointer">
                  <div className="w-10 h-10 bg-institute-blue rounded-lg flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="font-roboto-slab text-lg font-bold text-institute-gray">Student Portal</h1>
                  </div>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar || undefined} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden md:block">{user.name}</span>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-roboto-slab text-3xl font-bold text-institute-gray mb-2">
            Welcome back, {user.name.split(' ')[0]}!
          </h1>
          <p className="text-gray-600">Here's what's happening with your academic journey.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="material-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-institute-gray">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Courses */}
          <div className="lg:col-span-2">
            <Card className="material-shadow">
              <CardHeader>
                <CardTitle className="font-roboto-slab text-xl font-bold text-institute-gray">
                  Current Courses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {courses.map((course) => (
                  <div key={course.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-institute-blue transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 ${course.color} rounded-lg flex items-center justify-center`}>
                        <course.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-institute-gray">{course.name}</h3>
                        <p className="text-gray-600 text-sm">{course.instructor}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-institute-blue font-medium">
                        {course.grade}
                      </Badge>
                      <p className="text-gray-600 text-sm mt-1">{course.credits} Credits</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Assignments */}
          <div>
            <Card className="material-shadow">
              <CardHeader>
                <CardTitle className="font-roboto-slab text-xl font-bold text-institute-gray">
                  Upcoming Assignments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {assignments.map((assignment) => (
                  <div 
                    key={assignment.title}
                    className={`border-l-4 p-4 rounded-r-lg ${
                      assignment.urgency === 'high' 
                        ? 'border-institute-red bg-red-50' 
                        : assignment.urgency === 'medium'
                        ? 'border-institute-amber bg-yellow-50'
                        : 'border-institute-blue bg-blue-50'
                    }`}
                  >
                    <h3 className="font-medium text-institute-gray mb-2">{assignment.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{assignment.course}</p>
                    <p className={`text-sm font-medium ${
                      assignment.urgency === 'high' 
                        ? 'text-institute-red' 
                        : assignment.urgency === 'medium'
                        ? 'text-institute-amber'
                        : 'text-institute-blue'
                    }`}>
                      Due: {assignment.dueDate}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
