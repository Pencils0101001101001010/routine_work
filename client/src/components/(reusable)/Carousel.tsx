import { useEffect, useReducer, useState } from "react";
import jobImage from "../../assets/job1.jpg";
import embrace from "../../assets/embrace.jpg";
import positive from "../../assets/positive.jpg";

const IMAGE = [
  { id: 1, imgUrl: jobImage, alt: "type writer" },
  { id: 2, imgUrl: embrace, alt: "embrace routine message" },
  { id: 3, imgUrl: positive, alt: "positive discipline" },
];

type Action = {
  type: "NEXT" | "PREV";
};

const rollOver = (index: number, action: Action): number => {
  switch (action.type) {
    case "NEXT":
      return (index + 1) % IMAGE.length;
    case "PREV":
      if (index === 0) {
        return IMAGE.length - 1;
      }
      return index - 1;
    default:
      return index;
  }
};

export default function Carousel() {
  const [currentImage, imageDispatch] = useReducer(rollOver, 0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        imageDispatch({ type: "NEXT" });
        setFade(true);
      }, 800);
    }, 9000);
    return () => clearInterval(id);
  }, []);

  const handlePrev = () => {
    imageDispatch({ type: "PREV" });
  };

  const handleSkip = () => {
    imageDispatch({ type: "NEXT" });
  };

  const current = IMAGE[currentImage];

  return (
    <div className="flex flex-col relative  ">
      <img
        src={current.imgUrl}
        alt={current.alt}
        className={`w-full object-contain h-full  md:object-cover md:h-[clamp(400px,60vh,700px)] object-left md:object-center transition-opacity duration-500 ${fade ? "opacity-80" : "opacity-0"}`}
      />

      <button
        className="absolute text-xs md:text-1xl top-1/2 left-4 text-green-50 p-2 bg-stone-500/50 rounded-2xl hover:bg-stone-500 hover:text-green-500"
        onClick={handlePrev}
      >
        Prev
      </button>
      <button
        className="absolute text-xs md:text-1xl top-1/2 right-4 text-green-50 p-2 bg-stone-500/50 rounded-2xl hover:bg-stone-500 hover:text-green-500"
        onClick={handleSkip}
      >
        Skip
      </button>
    </div>
  );
}
