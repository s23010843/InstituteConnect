
import FacultySection from "@/components/faculty-section";
import Navigation from "@/components/navigation";
import Footer from "@/components/Footer";

export default function Faculty() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="pt-16">
        <FacultySection />
      </main>
      <Footer />
    </div>
  );
}
