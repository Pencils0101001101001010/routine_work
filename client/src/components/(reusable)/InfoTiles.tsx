import { Link } from "react-router-dom";

interface InfoProps {
  title: string;
  description: string;
  linkUrl?: string;
  linkLabel?: string;
}

export default function InfoTiles({
  title,
  description,
  linkUrl,
  linkLabel,
}: InfoProps) {
  return (
    <div className="flex md:flex-row items-center justify-center relative">
      <span className="w-50 h-56 mx-4 my-3 rounded-md border-2 border-green-50 bg-green-950  px-3 py-2 text-white hover:border-green-400 hover:ring-green-400/40 hover:shadow-2xl">
        <h1 className="text-1xl md:text-2xl text-green-300 my-2 font-bold">
          {title}
        </h1>
        <p className="mb-4">{description}</p>
        {linkUrl ? (
          <Link
            className="bottom-6 right-1 w-full text-green-300  absolute "
            to={linkUrl}
          >
            {linkLabel}→
          </Link>
        ) : null}
      </span>
    </div>
  );
}
