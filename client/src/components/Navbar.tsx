import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
import logo from "../assets/maskable-icon-512x512.png";
import UserMenu from "./UserMenu";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="flex flex-row items-center justify-between px-4 h-12">
      <Link to="/" className="flex items-center">
        <img
          src={logo}
          alt="Routine Work logo"
          className="w-8 h-8 rounded-full"
        />
      </Link>

      {user ? (
        <UserMenu />
      ) : (
        <menu className="flex items-center gap-2">
          <Link className="hover:text-green-400" to="/login">
            Login
          </Link>
          |
          <Link className="hover:text-green-400" to="/register">
            Register
          </Link>
        </menu>
      )}
    </nav>
  );
}
