import Footer from "./Footer";
import HeroSection from "./HeroSection";
import Navbar from "./Navbar";

export default function LandingPage() {
  return (
    <div className="h-full">
      <Navbar />
      <HeroSection />
      <Footer />
    </div>
  );
}
