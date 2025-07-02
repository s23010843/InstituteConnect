
import ProgramsSection from "@/components/programs-section";
import Navigation from "@/components/navigation";
import Footer from "@/components/Footer";

export default function Programs() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="pt-16">
        <ProgramsSection />
      </main>
      <Footer />
    </div>
  );
}
