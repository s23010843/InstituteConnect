import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HeroSection() {
  const scrollToPrograms = () => {
    const element = document.getElementById('programs');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative institute-gradient text-white">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="font-roboto-slab text-4xl lg:text-6xl font-bold leading-tight">
                Excellence in <span className="text-institute-orange">Education</span> & Research
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed">
                Empowering minds, advancing knowledge, and shaping tomorrow's leaders through innovative programs and cutting-edge research.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button 
                  className="bg-institute-orange hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-medium text-lg material-shadow transition-all transform hover:scale-105"
                  size="lg"
                >
                  Get Started
                </Button>
              </Link>
              <Button 
                onClick={scrollToPrograms}
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-institute-blue px-8 py-4 rounded-lg font-medium text-lg transition-all"
                size="lg"
              >
                Explore Programs
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-institute-orange">15K+</div>
                <div className="text-blue-200">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-institute-orange">500+</div>
                <div className="text-blue-200">Faculty</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-institute-orange">50+</div>
                <div className="text-blue-200">Programs</div>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="hidden lg:block">
            <img 
              src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Modern university campus" 
              className="rounded-2xl material-shadow-lg w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
