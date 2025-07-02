import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ProgramsSection from "@/components/programs-section";
import FacultySection from "@/components/faculty-section";
import ResearchSection from "@/components/research-section";
import AboutSection from "@/components/about-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import PWAInstallBanner from "@/components/pwa-install-banner";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  return (
    <div className="min-h-screen bg-institute-surface">
      <Navigation />
      <HeroSection />
      <ProgramsSection />
      <FacultySection />
      <ResearchSection />
      <AboutSection />
      <ContactSection />
      <Footer />
      <PWAInstallBanner />
    </div>
  );
}
