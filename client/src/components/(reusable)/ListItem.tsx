import { Link } from "react-router-dom";

interface ListProps {
  title: string;
  linkUrl?: string;
  imgLink?: string;
  altTitle?: string;
}

export default function ListItem({
  title,
  linkUrl,
  imgLink,
  altTitle,
}: ListProps) {
  return (
    <div>
      {linkUrl ? (
        <li className="hover:text-green-400">
          <Link
            to={linkUrl}
            className="flex flex-col md:flex-row items-center justify-center gap-2"
          >
            <span>{title}</span>
            {imgLink ? (
              <img src={imgLink} alt={altTitle} className="w-28" />
            ) : null}
          </Link>
        </li>
      ) : (
        <li>{title}</li>
      )}
    </div>
  );
}
