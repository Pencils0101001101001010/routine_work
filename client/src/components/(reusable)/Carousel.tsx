import { useEffect, useReducer } from "react";
import jobImage from "../../assets/job1.jpg";
import embrace from "../../assets/embrace.jpg";
import positive from "../../assets/positive.jpg";

const IMAGE = [
  { id: 1, imgUrl: jobImage, alt: "type writer" },
  { id: 2, imgUrl: embrace, alt: "embrace routine message" },
  { id: 3, imgUrl: positive, alt: "positive discipline" },
];

type Action = { type: "NEXT" | "PREV" };

const rollOver = (index: number, action: Action): number => {
  switch (action.type) {
    case "NEXT":
      return (index + 1) % IMAGE.length;
    case "PREV":
      return index === 0 ? IMAGE.length - 1 : index - 1;
    default:
      return index;
  }
};

export default function Carousel() {
  const [currentImage, imageDispatch] = useReducer(rollOver, 0);

  useEffect(() => {
    const id = setInterval(() => {
      imageDispatch({ type: "NEXT" });
    }, 9000);
    return () => clearInterval(id);
  }, []);

  const handlePrev = () => imageDispatch({ type: "PREV" });
  const handleSkip = () => imageDispatch({ type: "NEXT" });

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentImage * 100}%)` }}
      >
        {IMAGE.map((img) => (
          <img
            key={img.id}
            src={img.imgUrl}
            alt={img.alt}
            className="w-full shrink-0 object-contain h-full md:object-cover md:h-[clamp(400px,60vh,700px)] object-left md:object-center"
          />
        ))}
      </div>

      <button
        className="absolute text-xs md:text-1xl top-1/2 left-4 text-green-50 p-2 bg-stone-500/50 rounded-full hover:bg-stone-500 hover:text-green-500"
        onClick={handlePrev}
      >
        ←
      </button>
      <button
        className="absolute text-xs md:text-1xl top-1/2 right-4 text-green-50 p-2 bg-stone-500/50 rounded-full hover:bg-stone-500 hover:text-green-500"
        onClick={handleSkip}
      >
        →
      </button>
    </div>
  );
}
