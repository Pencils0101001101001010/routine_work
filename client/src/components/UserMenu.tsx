import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth-context";

export default function UserMenu() {
  const { logout, user } = useAuth();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;

    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const itemClass =
    "block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 hover:text-green-500";

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-1 hover:text-green-400"
      >
        {user?.name ?? "Account"}
        <span
          className={`text-xs transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      {open && (
        <ul
          role="menu"
          className="absolute right-0 mt-2 w-44 rounded-md  bg-[#02593C] text-green-400 shadow-lg z-50 py-1"
        >
          <li role="none">
            <Link
              role="menuitem"
              to="/preferences"
              className={itemClass}
              onClick={() => setOpen(false)}
            >
              Preferences
            </Link>
          </li>
          <li role="none">
            <Link
              role="menuitem"
              to="/history"
              className={itemClass}
              onClick={() => setOpen(false)}
            >
              History
            </Link>
          </li>
          <li role="none">
            <Link
              role="menuitem"
              to="/user-profile"
              className={itemClass}
              onClick={() => setOpen(false)}
            >
              Profile
            </Link>
          </li>
          <li role="none" className="border-t my-1" />
          <li role="none">
            <button
              role="menuitem"
              className={itemClass}
              onClick={() => {
                setOpen(false);
                logout();
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
