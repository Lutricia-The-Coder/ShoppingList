import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, User, LogOut } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../features/auth/authSlice";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector((state) => state.auth.currentUser);

  const displayName = currentUser
    ? `${currentUser.name} ${currentUser.surname}`
    : "User";

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(logout());
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-profile">
        <div className="sidebar-user-info">
          <h3>{displayName}</h3>
          <p>{currentUser?.email}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/"
          className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
        >
          <Home size={20} />
          <span>Home</span>
        </Link>
        <Link
          to="/profile"
          className={`nav-item ${
            location.pathname === "/profile" ? "active" : ""
          }`}
        >
          <User size={20} />
          <span>Profile</span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="nav-item nav-logout-btn"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Navbar;