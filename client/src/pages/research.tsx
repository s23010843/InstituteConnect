
import ResearchSection from "@/components/research-section";
import Navigation from "@/components/navigation";
import Footer from "@/components/Footer";

export default function Research() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="pt-16">
        <ResearchSection />
      </main>
      <Footer />
    </div>
  );
}
