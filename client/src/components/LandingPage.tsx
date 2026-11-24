import HoverBlocks from "./(reusable)/HoverBlocks";
import HeroSection from "./HeroSection";

export default function LandingPage() {
  return (
    <div className="h-full">
      <HeroSection />
      <HoverBlocks landingPage={true} />
    </div>
  );
}
