import { useEffect, useState } from "react";
import Carousel from "./(reusable)/Carousel";
import LandingMessage from "./(reusable)/LandingMessage";
import api from "../../api/client";

export default function HeroSection() {
  const [currentSentJobs, setCurrentSentJobs] = useState(0);

  const getCurrentCount = async () => {
    try {
      const result = await api.get("/active/currentCount");
      setCurrentSentJobs(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCurrentCount();
  }, []);

  return (
    <section>
      <Carousel />
      <LandingMessage />
      <div className="flex flex-col text-center justify-center mb-12 text-3xl p-2">
        <p>Total matches we've sent </p>
        <div className="text-green-300 font-extrabold"> {currentSentJobs}</div>
      </div>
    </section>
  );
}
