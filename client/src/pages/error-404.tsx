import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Home, 
  ArrowLeft, 
  Search, 
  MapPin, 
  BookOpen, 
  Users, 
  FileText,
  ExternalLink,
  Clock
} from "lucide-react";
import { Link } from "wouter";

export default function Error404() {
  const [searchQuery, setSearchQuery] = useState("");
  const [visitedTime] = useState(new Date());

  const suggestedPages = [
    {
      title: "Academic Programs",
      description: "Explore our undergraduate and graduate programs",
      icon: BookOpen,
      href: "/programs",
      category: "Academic"
    },
    {
      title: "Faculty Directory",
      description: "Meet our distinguished faculty members",
      icon: Users,
      href: "/faculty",
      category: "People"
    },
    {
      title: "Research",
      description: "Discover our research initiatives and publications",
      icon: FileText,
      href: "/research",
      category: "Research"
    },
    {
      title: "About Us",
      description: "Learn about our institution's mission and history",
      icon: MapPin,
      href: "/about",
      category: "Information"
    }
  ];

  const popularSearches = [
    "admission requirements",
    "course catalog", 
    "faculty contact",
    "campus map",
    "student portal",
    "library resources"
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/#search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-32 h-32 mb-6">
            <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse"></div>
            <div className="relative flex items-center justify-center w-full h-full">
              <div className="text-6xl font-bold text-blue-600">404</div>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900">Page Not Found</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The page you're looking for doesn't exist or has been moved. But don't worry - 
            let's help you find what you need.
          </p>
        </div>

        {/* Search Section */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Our Site
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search for programs, faculty, or information..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(term)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suggested Pages */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center text-gray-900">
            Explore Popular Pages
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {suggestedPages.map((page, index) => (
              <Link key={index} href={page.href}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                        <page.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{page.title}</h3>
                          <ExternalLink className="h-4 w-4 text-gray-400" />
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{page.description}</p>
                        <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          {page.category}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <Link href="/" className="flex-1">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Home className="h-4 w-4 mr-2" />
              Go to Homepage
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          
          <Link href="/contact" className="flex-1">
            <Button variant="outline" className="w-full">
              <Search className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </Link>
        </div>

        {/* Help Tips */}
        <Card className="bg-blue-50 border-blue-200 max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <h3 className="font-medium text-blue-900 mb-3">Helpful Tips</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Double-check the URL for any typos or extra characters</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Use the navigation menu to browse our sections</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Try our search feature to find specific information</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Contact our support team if you continue having issues</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Technical Info */}
        <div className="text-center text-sm text-gray-500 space-y-1">
          <div className="flex items-center justify-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Error occurred at {visitedTime.toLocaleString()}</span>
          </div>
          <p>Error Code: 404 - Page Not Found</p>
        </div>
      </div>
    </div>
  );
}
