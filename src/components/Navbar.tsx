import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../features/auth/authSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector(
    (state) => state.auth.currentUser
  );

  if (!currentUser) {
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav>
      <div>
        <Link to="/">
          <strong>ShopList</strong>
        </Link>
      </div>

      <div>
        <Link to="/">
          Home
        </Link>

        <Link to="/profile">
          Profile
        </Link>

        <button
          type="button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;