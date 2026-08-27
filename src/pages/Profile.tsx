import { type FormEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { login, logout } from "../features/auth/authSlice";
import { updateUser, getUserByEmail } from "../services/authService";
import { hashPassword } from "../types/encryption";

const Profile = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [name, setName] = useState(currentUser?.name ?? "");
  const [surname, setSurname] = useState(currentUser?.surname ?? "");
  const [email, setEmail] = useState(currentUser?.email ?? "");
  const [cellNumber, setCellNumber] = useState(currentUser?.cellNumber ?? "");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!currentUser) {
    return null;
  }

  const handleProfileUpdate = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const trimmedEmail = email.trim().toLowerCase();
      const existingUser = await getUserByEmail(trimmedEmail);

      if (existingUser && existingUser.id !== currentUser.id) {
        setError("That email address is already registered.");
        return;
      }

      const updatedUser = await updateUser(currentUser.id, {
        name: name.trim(),
        surname: surname.trim(),
        email: trimmedEmail,
        cellNumber: cellNumber.trim(),
      });

      dispatch(login(updatedUser));
      setMessage("Profile details updated successfully.");
      setEditing(false);
    } catch (error) {
      console.error("Profile update error:", error);
      setError("Unable to update your profile.");
    }
  };

  const handlePasswordUpdate = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const hashedPassword = hashPassword(password);
      const updatedUser = await updateUser(currentUser.id, {
        password: hashedPassword,
      });

      dispatch(login(updatedUser));
      setPassword("");
      setConfirmPassword("");
      setMessage("Password changed successfully.");
      setChangingPassword(false);
    } catch (error) {
      console.error("Password update error:", error);
      setError("Unable to update your password.");
    }
  };

  return (
    <div className="profile-page-flat">

      {message && <div className="auth-success-alert" role="status">{message}</div>}
      {error && <div className="auth-error-alert" role="alert">{error}</div>}

      <section className="profile-section">
        <h3 className="profile-section-title">Personal Details</h3>

        {!editing ? (
          <div>
            <div className="minimal-input-group">
              <input type="text" value={currentUser.name} readOnly placeholder="First Name" />
            </div>

            <div className="minimal-input-group">
              <input type="text" value={currentUser.surname} readOnly placeholder="Last Name" />
            </div>

            <div className="minimal-input-group">
              <input type="tel" value={currentUser.cellNumber} readOnly placeholder="Cell Number" />
            </div>

            <button
              type="button"
              className="btn-pill-submit-sm"
              style={{ marginTop: "8px" }}
              onClick={() => {
                setName(currentUser.name);
                setSurname(currentUser.surname);
                setEmail(currentUser.email);
                setCellNumber(currentUser.cellNumber);
                setMessage("");
                setError("");
                setEditing(true);
              }}
            >
              EDIT DETAILS
            </button>
          </div>
        ) : (
          <form onSubmit={handleProfileUpdate}>
            <div className="minimal-input-group">
              <input
                id="name"
                type="text"
                name="name"
                placeholder="First Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="minimal-input-group">
              <input
                id="surname"
                type="text"
                name="surname"
                placeholder="Last Name"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
              />
            </div>

            <div className="minimal-input-group">
              <input
                id="cellNumber"
                type="tel"
                name="cellNumber"
                placeholder="Cell Number"
                value={cellNumber}
                onChange={(e) => setCellNumber(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-pill-submit-sm"
              style={{ marginTop: "8px" }}
            >
              SAVE CHANGES
            </button>

            <button
              type="button"
              className="btn-pill-outline-sm"
              style={{ marginTop: "8px" }}
              onClick={() => setEditing(false)}
            >
              CANCEL
            </button>
          </form>
        )}
      </section>

      <hr className="profile-divider" />

      <section className="profile-section">
        <h3 className="profile-section-title">Login Credentials</h3>

        <div className="minimal-input-group">
          <input type="email" value={currentUser.email} readOnly placeholder="Email Address" />
        </div>

        {!changingPassword ? (
          <button
            type="button"
            className="btn-pill-outline-sm"
            style={{ marginTop: "8px" }}
            onClick={() => {
              setPassword("");
              setConfirmPassword("");
              setMessage("");
              setError("");
              setChangingPassword(true);
            }}
          >
            CHANGE PASSWORD
          </button>
        ) : (
          <form onSubmit={handlePasswordUpdate}>
            <div className="minimal-input-group">
              <input
                id="new-password"
                type="password"
                placeholder="New Password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="minimal-input-group">
              <input
                id="confirm-password"
                type="password"
                placeholder="Confirm New Password"
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-pill-submit-sm"
              style={{ marginTop: "8px" }}
            >
              UPDATE PASSWORD
            </button>

            <button
              type="button"
              className="btn-pill-outline-sm"
              style={{ marginTop: "8px" }}
              onClick={() => {
                setChangingPassword(false);
                setPassword("");
                setConfirmPassword("");
              }}
            >
              CANCEL
            </button>
          </form>
        )}
      </section>

      <hr className="profile-divider" />

     
      <section>
        <button
          type="button"
          className="btn-pill-danger-sm"
          onClick={() => dispatch(logout())}
        >
          LOGOUT
        </button>
      </section>
    </div>
  );
};

export default Profile;