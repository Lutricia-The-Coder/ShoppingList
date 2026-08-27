import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  
  LogOut,
  Pencil,
  LockKeyhole,
  X,
} from "lucide-react";

import {
  useAppDispatch,
  useAppSelector,
} from "../store/hooks";

import { logout } from "../features/auth/authSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [showProfile, setShowProfile] =
    useState(false);

  const currentUser = useAppSelector(
    (state) => state.auth.currentUser
  );

  const displayName = currentUser
    ? `${currentUser.name} ${currentUser.surname}`
    : "User";

  const initial =
    currentUser?.name
      ?.charAt(0)
      .toUpperCase() || "U";

  const handleLogout = () => {
    dispatch(logout());
    setShowProfile(false);
    navigate("/login");
  };

  return (
    <>
      <header className="top-navbar">
        {/* LOGO */}
        <Link
          to="/dashboard"
          className="navbar-logo"
        >
          <div className="navbar-logo-icon">
            🛒
          </div>

          <span>ShopList</span>
        </Link>

        {/* PROFILE BUTTON */}
        <button
          type="button"
          className="navbar-profile-button"
          onClick={() =>
            setShowProfile(!showProfile)
          }
          aria-label="Open profile"
        >
          {initial}
        </button>
      </header>

      {/* PROFILE PANEL */}
      {showProfile && (
        <>
          <div
            className="profile-overlay"
            onClick={() =>
              setShowProfile(false)
            }
          />

          <aside className="profile-panel">
            <div className="profile-panel-header">
              <h2>My Profile</h2>

              <button
                type="button"
                className="profile-close-button"
                onClick={() =>
                  setShowProfile(false)
                }
              >
                <X size={20} />
              </button>
            </div>

            {/* PROFILE HEADER */}
            <div className="profile-summary">
              <div className="profile-large-avatar">
                {initial}
              </div>

              <h3>{displayName}</h3>

              <p>
                {currentUser?.email ||
                  "No email available"}
              </p>
            </div>

            {/* PERSONAL DETAILS */}
            <section className="profile-section">
              <h4>Personal Details</h4>

              <div className="profile-detail">
                <span>Name</span>
                <strong>
                  {currentUser?.name || "-"}
                </strong>
              </div>

              <div className="profile-detail">
                <span>Surname</span>
                <strong>
                  {currentUser?.surname || "-"}
                </strong>
              </div>

              <div className="profile-detail">
                <span>Cell Number</span>
                <strong>
                  {currentUser?.cellNumber ||
                    "-"}
                </strong>
              </div>

              <button
                type="button"
                className="profile-action-button"
                onClick={() => {
                  setShowProfile(false);
                  navigate("/profile");
                }}
              >
                <Pencil size={17} />
                Edit Details
              </button>
            </section>

            {/* LOGIN CREDENTIALS */}
            <section className="profile-section">
              <h4>Login Credentials</h4>

              <div className="profile-detail">
                <span>Email</span>

                <strong>
                  {currentUser?.email || "-"}
                </strong>
              </div>

              <div className="profile-detail">
                <span>Password</span>

                <strong>
                  ••••••••••
                </strong>
              </div>

              <button
                type="button"
                className="profile-action-button"
                onClick={() => {
                  setShowProfile(false);
                  navigate(
                    "/profile?changePassword=true"
                  );
                }}
              >
                <LockKeyhole size={17} />
                Change Password
              </button>
            </section>

            {/* LOGOUT */}
            <button
              type="button"
              className="profile-logout-button"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              Logout
            </button>
          </aside>
        </>
      )}
    </>
  );
};

export default Navbar;