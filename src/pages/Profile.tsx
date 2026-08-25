import { type FormEvent, useState } from "react";

import {
  useAppDispatch,
  useAppSelector,
} from "../store/hooks";

import {
  login,
  logout,
} from "../features/auth/authSlice";

import { updateUser , getUserByEmail} from "../services/authService";
import { hashPassword } from "../types/encryption";

const Profile = () => {
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector(
    (state) => state.auth.currentUser
  );

  const [editing, setEditing] =
    useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [name, setName] = useState(
    currentUser?.name ?? ""
  );

  const [surname, setSurname] = useState(
    currentUser?.surname ?? ""
  );

  const [email, setEmail] = useState(
    currentUser?.email ?? ""
  );

  const [cellNumber, setCellNumber] =
    useState(
      currentUser?.cellNumber ?? ""
    );

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  if (!currentUser) {
    return null;
  }

  /*
   * Update personal information
   */
  const handleProfileUpdate = async (
  event: FormEvent
) => {
  event.preventDefault();

  setMessage("");
  setError("");

  try {
    const trimmedEmail =
      email.trim().toLowerCase();

    // Check if another user already uses this email
    const existingUser =
      await getUserByEmail(trimmedEmail);

    if (
      existingUser &&
      existingUser.id !== currentUser.id
    ) {
      setError(
        "That email address is already registered."
      );
      return;
    }

    const updatedUser =
      await updateUser(
        currentUser.id,
        {
          name: name.trim(),
          surname: surname.trim(),
          email: trimmedEmail,
          cellNumber: cellNumber.trim(),
        }
      );

    dispatch(login(updatedUser));

    setMessage(
      "Profile updated successfully."
    );

    setEditing(false);
  } catch (error) {
    console.error(
      "Profile update error:",
      error
    );

    setError(
      "Unable to update your profile."
    );
  }
};
  /*
   * Update password
   */
  const handlePasswordUpdate = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    try {
      /*
       * Hash the new password before
       * sending it to JSON Server.
       */
      const hashedPassword =
        hashPassword(password);

      const updatedUser =
        await updateUser(
          currentUser.id,
          {
            password: hashedPassword,
          }
        );

      dispatch(login(updatedUser));

      setPassword("");
      setConfirmPassword("");

      setMessage(
        "Password updated successfully."
      );

      setChangingPassword(false);
    } catch (error) {
      console.error(
        "Password update error:",
        error
      );

      setError(
        "Unable to update your password."
      );
    }
  };

  /*
   * Logout
   */
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <main className="profile-page">
      <h1>My Profile</h1>

      {message && (
        <p role="status">
          {message}
        </p>
      )}

      {error && (
        <p role="alert">
          {error}
        </p>
      )}

      {/* Personal information */}
      <section className="profile-section">
        <h2>
          Personal Information
        </h2>

        {!editing ? (
          <>
            <p>
              <strong>Name:</strong>{" "}
              {currentUser.name}
            </p>

            <p>
              <strong>Surname:</strong>{" "}
              {currentUser.surname}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {currentUser.email}
            </p>

            <p>
              <strong>Cell Number:</strong>{" "}
              {currentUser.cellNumber}
            </p>

            <button
              type="button"
              onClick={() => {
                setName(
                  currentUser.name
                );
                setSurname(
                  currentUser.surname
                );
                setEmail(
                  currentUser.email
                );
                setCellNumber(
                  currentUser.cellNumber
                );

                setMessage("");
                setError("");
                setEditing(true);
              }}
            >
              Edit Profile
            </button>
          </>
        ) : (
          <form
            onSubmit={
              handleProfileUpdate
            }
          >
            <label htmlFor="profile-name">
              Name
            </label>

            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              required
            />

            <label htmlFor="profile-surname">
              Surname
            </label>

            <input
              id="profile-surname"
              type="text"
              value={surname}
              onChange={(event) =>
                setSurname(
                  event.target.value
                )
              }
              required
            />

            <label htmlFor="profile-email">
              Email
            </label>

            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              required
            />

            <label htmlFor="profile-cell">
              Cell Number
            </label>

            <input
              id="profile-cell"
              type="tel"
              value={cellNumber}
              onChange={(event) =>
                setCellNumber(
                  event.target.value
                )
              }
              required
            />

            <div className="form-actions">
              <button type="submit">
                Save Changes
              </button>

              <button
                type="button"
                onClick={() =>
                  setEditing(false)
                }
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Login credentials */}
      <section className="profile-section">
        <h2>
          Login Credentials
        </h2>

        <p>
          <strong>Email:</strong>{" "}
          {currentUser.email}
        </p>

        {!changingPassword ? (
          <button
            type="button"
            onClick={() => {
              setPassword("");
              setConfirmPassword("");
              setMessage("");
              setError("");
              setChangingPassword(true);
            }}
          >
            Change Password
          </button>
        ) : (
          <form
            onSubmit={
              handlePasswordUpdate
            }
          >
            <label htmlFor="new-password">
              New Password
            </label>

            <input
              id="new-password"
              type="password"
              minLength={8}
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              required
            />

            <label htmlFor="confirm-password">
              Confirm Password
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
              required
            />

            <div className="form-actions">
              <button type="submit">
                Update Password
              </button>

              <button
                type="button"
                onClick={() => {
                  setChangingPassword(
                    false
                  );
                  setPassword("");
                  setConfirmPassword("");
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Logout */}
      <section className="profile-section">
        <button
          type="button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </section>
    </main>
  );
};

export default Profile;