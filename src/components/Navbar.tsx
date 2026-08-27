
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

import {
  logout,
  updateCurrentUser,
} from "../features/auth/authSlice";

import { updateUser } from "../services/authService";
import { hashPassword } from "../types/encryption";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector(
    (state) => state.auth.currentUser
  );

  const [showProfile, setShowProfile] =
    useState(false);

  const [editingDetails, setEditingDetails] =
    useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [cellNumber, setCellNumber] = useState("");

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
   * No logged-in user
   */
  if (!currentUser) {
    return null;
  }

  const displayName =
    `${currentUser.name || ""} ${currentUser.surname || ""}`.trim() ||
    "User";

  const initial =
    currentUser.name?.charAt(0).toUpperCase() ||
    "U";

  /*
   * OPEN PROFILE
   */
  const handleOpenProfile = () => {
    setShowProfile(true);
    setEditingDetails(false);
    setChangingPassword(false);
    setError("");
    setSuccess("");
  };

  /*
   * OPEN EDIT DETAILS
   */
  const handleEditDetails = () => {
    setName(currentUser.name || "");
    setSurname(currentUser.surname || "");
    setCellNumber(currentUser.cellNumber || "");

    setError("");
    setSuccess("");

    setChangingPassword(false);
    setEditingDetails(true);
  };

  /*
   * SAVE EDITED DETAILS
   *
   * Uses the existing:
   * updateUser()
   *
   * PATCH /users/:id
   */
  const handleSaveDetails = async () => {
    if (!name.trim() || !surname.trim()) {
      setError("Name and surname are required.");
      setSuccess("");
      return;
    }

    try {
      setError("");
      setSuccess("");

      const updatedUser = await updateUser(
        currentUser.id,
        {
          name: name.trim(),
          surname: surname.trim(),
          cellNumber: cellNumber.trim(),
        }
      );

      /*
       * Do NOT store password in Redux/localStorage.
       *
       * Your API may return the password because it
       * exists in db.json, so remove it before saving
       * the user to Redux.
       */
      const {
        password: _password,
        ...safeUser
      } = updatedUser;

      dispatch(updateCurrentUser(safeUser));

      setEditingDetails(false);

      setSuccess("Your details have been updated.");
    } catch (error) {
      console.error(
        "Failed to update user details:",
        error
      );

      setError(
        "Failed to update your details. Please try again."
      );

      setSuccess("");
    }
  };

  /*
   * OPEN CHANGE PASSWORD
   *
   * IMPORTANT:
   * We do NOT close the profile.
   * We only switch the content inside
   * the existing profile panel.
   */
  const handleChangePassword = () => {
    setError("");
    setSuccess("");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setEditingDetails(false);
    setChangingPassword(true);
  };

  /*
   * SAVE NEW PASSWORD
   *
   * The new password is hashed BEFORE
   * being sent to json-server.
   *
   * Therefore db.json contains ONLY
   * the SHA-256 hash.
   */
  const handleSavePassword = async () => {
    if (!currentPassword) {
      setError("Please enter your current password.");
      setSuccess("");
      return;
    }

    if (!newPassword) {
      setError("Please enter a new password.");
      setSuccess("");
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "Your new password must be at least 8 characters."
      );
      setSuccess("");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setSuccess("");
      return;
    }

    try {
      setError("");
      setSuccess("");

      /*
       * HASH THE NEW PASSWORD.
       *
       * This uses your existing encryption.ts:
       *
       * hashPassword(password)
       */
      const hashedPassword =
        hashPassword(newPassword);

      /*
       * PATCH ONLY THE PASSWORD.
       *
       * The database receives:
       *
       * {
       *   password: "SHA256_HASH_HERE"
       * }
       */
      const updatedUser = await updateUser(
        currentUser.id,
        {
          password: hashedPassword,
        }
      );

      /*
       * Never put password into Redux/localStorage.
       */
      const {
        password: _password,
        ...safeUser
      } = updatedUser;

      dispatch(updateCurrentUser(safeUser));

      /*
       * Clear password fields.
       */
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      /*
       * Return to the normal profile view.
       *
       * The profile panel itself stays open.
       */
      setChangingPassword(false);

      setSuccess(
        "Your password has been changed successfully."
      );
    } catch (error) {
      console.error(
        "Failed to change password:",
        error
      );

      setError(
        "Failed to change your password. Please try again."
      );

      setSuccess("");
    }
  };

  /*
   * LOGOUT
   */
  const handleLogout = () => {
    dispatch(logout());
    setShowProfile(false);
    setEditingDetails(false);
    setChangingPassword(false);

    navigate("/login");
  };

  /*
   * CLOSE PROFILE
   */
  const handleCloseProfile = () => {
    setShowProfile(false);
    setEditingDetails(false);
    setChangingPassword(false);

    setError("");
    setSuccess("");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  /*
   * CANCEL EDIT
   */
  const handleCancelEdit = () => {
    setEditingDetails(false);
    setError("");
    setSuccess("");
  };

  /*
   * CANCEL PASSWORD CHANGE
   */
  const handleCancelPassword = () => {
    setChangingPassword(false);

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setError("");
    setSuccess("");
  };

  return (
    <>
      {/* =====================================================
          NAVBAR
      ===================================================== */}

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
          onClick={handleOpenProfile}
          aria-label="Open profile"
        >
          {initial}
        </button>
      </header>

      {/* =====================================================
          PROFILE PANEL
      ===================================================== */}

      {showProfile && (
        <>
          {/* Overlay */}
          <div
            className="profile-overlay"
            onClick={handleCloseProfile}
          />

          {/* Panel */}
          <aside className="profile-panel">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="profile-panel-header">

              <h2>
                {editingDetails
                  ? "Edit Details"
                  : changingPassword
                  ? "Change Password"
                  : "My Profile"}
              </h2>

              <button
                type="button"
                className="profile-close-button"
                onClick={handleCloseProfile}
                aria-label="Close profile"
              >
                <X size={20} />
              </button>

            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div
                className="profile-form-error"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* =================================================
                SUCCESS
            ================================================= */}

            {success && (
              <div
                className="profile-form-success"
                role="status"
              >
                {success}
              </div>
            )}

            {/* =================================================
                EDIT DETAILS
            ================================================= */}

            {editingDetails ? (
              <section className="profile-edit-form">

                <div className="profile-form-field">
                  <label htmlFor="profile-name">
                    Name
                  </label>

                  <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                  />
                </div>

                <div className="profile-form-field">
                  <label htmlFor="profile-surname">
                    Surname
                  </label>

                  <input
                    id="profile-surname"
                    type="text"
                    value={surname}
                    onChange={(event) =>
                      setSurname(event.target.value)
                    }
                  />
                </div>

                <div className="profile-form-field">
                  <label htmlFor="profile-cell">
                    Cell Number
                  </label>

                  <input
                    id="profile-cell"
                    type="text"
                    value={cellNumber}
                    onChange={(event) =>
                      setCellNumber(event.target.value)
                    }
                  />
                </div>

                <div className="profile-form-actions">

                  <button
                    type="button"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveDetails}
                  >
                    Save Changes
                  </button>

                </div>

              </section>
            ) : changingPassword ? (

              /* ===============================================
                 CHANGE PASSWORD
              =============================================== */

              <section className="profile-edit-form">

                <div className="profile-form-field">
                  <label htmlFor="current-password">
                    Current Password
                  </label>

                  <input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(event) =>
                      setCurrentPassword(
                        event.target.value
                      )
                    }
                  />
                </div>

                <div className="profile-form-field">
                  <label htmlFor="new-password">
                    New Password
                  </label>

                  <input
                    id="new-password"
                    type="password"
                    minLength={8}
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(
                        event.target.value
                      )
                    }
                  />
                </div>

                <div className="profile-form-field">
                  <label htmlFor="confirm-password">
                    Confirm New Password
                  </label>

                  <input
                    id="confirm-password"
                    type="password"
                    minLength={8}
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                  />
                </div>

                {newPassword &&
                  confirmPassword &&
                  newPassword !==
                    confirmPassword && (
                    <p className="profile-form-error">
                      Passwords do not match.
                    </p>
                  )}

                <div className="profile-form-actions">

                  <button
                    type="button"
                    onClick={
                      handleCancelPassword
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleSavePassword
                    }
                    disabled={
                      !currentPassword ||
                      !newPassword ||
                      !confirmPassword ||
                      newPassword !==
                        confirmPassword ||
                      newPassword.length < 8
                    }
                  >
                    Save Password
                  </button>

                </div>

              </section>

            ) : (

              /* ===============================================
                 NORMAL PROFILE
              =============================================== */

              <>
                {/* PROFILE SUMMARY */}
                <div className="profile-summary">

                  <div className="profile-large-avatar">
                    {initial}
                  </div>

                  <h3>
                    {displayName}
                  </h3>

                  <p>
                    {currentUser.email ||
                      "No email available"}
                  </p>

                </div>

                {/* =================================================
                    PERSONAL DETAILS
                ================================================= */}

                <section className="profile-section">

                  <h4>
                    Personal Details
                  </h4>

                  <div className="profile-detail">
                    <span>Name</span>

                    <strong>
                      {currentUser.name || "-"}
                    </strong>
                  </div>

                  <div className="profile-detail">
                    <span>Surname</span>

                    <strong>
                      {currentUser.surname || "-"}
                    </strong>
                  </div>

                  <div className="profile-detail">
                    <span>Cell Number</span>

                    <strong>
                      {currentUser.cellNumber ||
                        "-"}
                    </strong>
                  </div>

                  <button
                    type="button"
                    className="profile-action-button"
                    onClick={
                      handleEditDetails
                    }
                  >
                    <Pencil size={17} />
                    Edit Details
                  </button>

                </section>

                {/* =================================================
                    LOGIN CREDENTIALS
                ================================================= */}

                <section className="profile-section">

                  <h4>
                    Login Credentials
                  </h4>

                  <div className="profile-detail">
                    <span>Email</span>

                    <strong>
                      {currentUser.email || "-"}
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
                    onClick={
                      handleChangePassword
                    }
                  >
                    <LockKeyhole size={17} />
                    Change Password
                  </button>

                </section>

                {/* =================================================
                    LOGOUT
                ================================================= */}

                <button
                  type="button"
                  className="profile-logout-button"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            )}

          </aside>
        </>
      )}
    </>
  );
};

export default Navbar;
