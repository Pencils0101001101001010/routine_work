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
      <span className="w-55 h-62 mx-4 my-3 rounded-2xl shadow-2xl border-l border-r border-[#ecc999] bg-[#65564488] backdrop-blur-md px-3 py-2 text-white hover:border-[#826946] hover:ring-[#9d825b] hover:shadow-2xl">
        <h1 className="text-1xl md:text-2xl text-[#ecc999] my-2 font-bold">
          {title}
        </h1>
        <p className="mb-4">{description}</p>
        {linkUrl ? (
          <Link
            className="bottom-6 right-1 w-full text-[#ecc999] hover:text-[#826946]  absolute "
            to={linkUrl}
          >
            {linkLabel}
          </Link>
        ) : null}
      </span>
    </div>
  );
}
