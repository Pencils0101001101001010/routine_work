import { Link } from "react-router-dom";
import heroImage from "../../assets/positive.jpg";
import { useAuth } from "../../../context/auth-context";

export default function Hero() {
  const { user } = useAuth();
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 md:min-h-[clamp(420px,50vh,600px)]">
      {/* Image: on top for mobile, right side on md+ */}
      <div className="relative order-1 md:order-2 h-64 sm:h-80 md:h-auto">
        <img
          src={heroImage}
          alt="Embrace routine"
          className="absolute inset-0 h-full w-full object-cover object-left"
        />
      </div>

      {/* Text: below image on mobile, left side on md+ */}
      <div className="order-2 md:order-1 flex flex-col justify-center px-6 py-10 md:px-12 lg:px-20 bg-[#65564488] backdrop-blur-md ">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#ecc999]">
          Build better days
        </p>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900">
          Routine Works
        </h1>

        <p className="max-w-md text-lg md:text-xl mb-5 italic text-[#ecc999]">
          “Small steps, repeated daily, become the life you want.”
        </p>

        <div>
          {user ? (
            <Link
              to="/preferences"
              className="rounded-2xl shadow-2xl border-t border-b border-[#ecc999] bg-[#00000068] backdrop-blur-md my-5 px-3 py-2 text-white hover:border-[#d3ae7b] hover:ring-[#f8eddd] hover:shadow-2xl"
            >
              Get Started
            </Link>
          ) : (
            <Link
              to="/login"
              className="rounded-2xl shadow-2xl border-t border-b border-[#ecc999] bg-[#00000068] backdrop-blur-md my-5 px-3 py-2 text-white hover:border-[#d3ae7b] hover:ring-[#f8eddd] hover:shadow-2xl"
            >
              Get started
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
