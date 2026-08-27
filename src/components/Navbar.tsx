
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


  if (!currentUser) {
    return null;
  }

  const displayName =
    `${currentUser.name || ""} ${currentUser.surname || ""}`.trim() ||
    "User";

  const initial =
    currentUser.name?.charAt(0).toUpperCase() ||
    "U";

  
  const handleOpenProfile = () => {
    setShowProfile(true);
    setEditingDetails(false);
    setChangingPassword(false);
    setError("");
    setSuccess("");
  };


  const handleEditDetails = () => {
    setName(currentUser.name || "");
    setSurname(currentUser.surname || "");
    setCellNumber(currentUser.cellNumber || "");

    setError("");
    setSuccess("");

    setChangingPassword(false);
    setEditingDetails(true);
  };

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


  const handleChangePassword = () => {
    setError("");
    setSuccess("");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setEditingDetails(false);
    setChangingPassword(true);
  };


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

      const hashedPassword =
        hashPassword(newPassword);

      const updatedUser = await updateUser(
        currentUser.id,
        {
          password: hashedPassword,
        }
      );

      const {
        password: _password,
        ...safeUser
      } = updatedUser;

      dispatch(updateCurrentUser(safeUser));

    
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

  
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

  
  const handleLogout = () => {
    dispatch(logout());
    setShowProfile(false);
    setEditingDetails(false);
    setChangingPassword(false);

    navigate("/login");
  };

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

  
  const handleCancelEdit = () => {
    setEditingDetails(false);
    setError("");
    setSuccess("");
  };


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
    
      <header className="top-navbar">

        <Link
          to="/dashboard"
          className="navbar-logo"
        >
          <div className="navbar-logo-icon">
            🛒
          </div>

          <span>ShopList</span>
        </Link>

        <button
          type="button"
          className="navbar-profile-button"
          onClick={handleOpenProfile}
          aria-label="Open profile"
        >
          {initial}
        </button>
      </header>


      {showProfile && (
        <>
       
          <div
            className="profile-overlay"
            onClick={handleCloseProfile}
          />

          <aside className="profile-panel">

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

            {error && (
              <div
                className="profile-form-error"
                role="alert"
              >
                {error}
              </div>
            )}

        
            {success && (
              <div
                className="profile-form-success"
                role="status"
              >
                {success}
              </div>
            )}

          
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

              <>
              
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
