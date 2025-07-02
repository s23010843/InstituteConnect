import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { AuthModal } from "./auth-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GraduationCap, Menu, LogIn } from "lucide-react";
import { useLocation, Link } from "wouter";

export default function Navigation() {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [, setLocation] = useLocation();

  const handleSignOut = async () => {
    await logout();
  };

  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setLocation(`/${sectionId}`);
  };

  return (
    <>
      <nav className="bg-white material-shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <Link href="/">
              <div className="flex items-center space-x-4 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 bg-institute-blue rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="font-roboto-slab text-xl font-bold text-institute-gray">Excellence Institute</h1>
                  <p className="text-xs text-gray-500 hidden sm:block">Premier Education & Research</p>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-institute-gray hover:text-institute-blue transition-colors">
                Home
              </Link>
              <Link 
                href="/programs"
                className="text-institute-gray hover:text-institute-blue transition-colors"
              >
                Programs
              </Link>
              <Link 
                href="/faculty"
                className="text-institute-gray hover:text-institute-blue transition-colors"
              >
                Faculty
              </Link>
              <Link 
                href="/research"
                className="text-institute-gray hover:text-institute-blue transition-colors"
              >
                Research
              </Link>
              <Link href="/about" className="text-institute-gray hover:text-institute-blue transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-institute-gray hover:text-institute-blue transition-colors">
                Contact
              </Link>
            </div>

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="outline"
                    onClick={() => setLocation("/dashboard")}
                    className="hidden md:inline-flex"
                  >
                    Dashboard
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || undefined} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block text-sm font-medium">{user.name.split(' ')[0]}</span>
                    <Button variant="ghost" size="sm" onClick={handleSignOut}>
                      Sign Out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Link href="/login">
                    <Button variant="outline" className="border-institute-blue text-institute-blue hover:bg-institute-blue hover:text-white">
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-institute-blue hover:bg-blue-700 text-white">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md absolute top-16 left-0 w-full z-50">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block px-3 py-2 text-institute-gray hover:text-institute-blue" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </Link>
            <Link 
              href="/programs"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-institute-gray hover:text-institute-blue"
            >
              Programs
            </Link>
            <Link 
              href="/faculty"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-institute-gray hover:text-institute-blue"
            >
              Faculty
            </Link>
            <Link 
              href="/research"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-institute-gray hover:text-institute-blue"
            >
              Research
            </Link>
            <Link href="/about" className="block px-3 py-2 text-institute-gray hover:text-institute-blue" onClick={() => setIsMobileMenuOpen(false)}>
              About
            </Link>
            <Link href="/contact" className="block px-3 py-2 text-institute-gray hover:text-institute-blue" onClick={() => setIsMobileMenuOpen(false)}>
              Contact
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="block px-3 py-2 text-institute-gray hover:text-institute-blue" onClick={() => setIsMobileMenuOpen(false)}>
                  Dashboard
                </Link>
                <button onClick={handleSignOut} className="block px-3 py-2 text-left text-institute-gray hover:text-institute-blue">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2 text-institute-gray hover:text-institute-blue" onClick={() => setIsMobileMenuOpen(false)}>
                  Sign In
                </Link>
                <Link href="/signup" className="block px-3 py-2 text-institute-gray hover:text-institute-blue" onClick={() => setIsMobileMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
}