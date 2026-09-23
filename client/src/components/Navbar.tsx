import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
import logo from "../assets/maskable-icon-512x512.png";

export default function Navbar() {
  const { logout, user } = useAuth();

  return (
    <nav className="flex flex-row items-center justify-between px-4 h-12 ">
      <Link to={"/"} className="flex items-center ">
        <img
          src={logo}
          alt="Routine Work logo"
          className="w-8 h-8 rounded-full"
        />
        <p className="pl-2 font-extrabold">Routine Works</p>
      </Link>

      {user ? (
        <menu className="flex  items-center gap-2 ">
          <Link to={"/preferences"} className="hover:text-green-400">
            Preferences
          </Link>
          |
          <li className="hover:text-green-400">
            <button onClick={logout}>Logout</button>
          </li>
        </menu>
      ) : (
        <menu className="flex items-center gap-2">
          <Link className="hover:text-green-400" to={"/login"}>
            Login
          </Link>
          |
          <Link className="hover:text-green-400" to={"/register"}>
            Register
          </Link>
        </menu>
      )}
    </nav>
  );
}
