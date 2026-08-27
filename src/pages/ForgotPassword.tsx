
import {
  type FormEvent,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  getUserByCellNumber,
  updateUser,
} from "../services/authService";

import { hashPassword } from "../types/encryption";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [cellNumber, setCellNumber] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [userId, setUserId] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [numberVerified, setNumberVerified] =
    useState(false);

  /*
   * Check if the cell number exists
   * in the database.
   */
  const handleVerifyNumber = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!cellNumber.trim()) {
      setError("Please enter your cell number.");
      return;
    }

    try {
      setLoading(true);

      const user =
        await getUserByCellNumber(
          cellNumber
        );

      if (!user) {
        setError(
          "No account was found with that cell number."
        );
        return;
      }

      /*
       * Store only the user's ID.
       *
       * We do NOT store the password.
       */
      setUserId(user.id);
      setNumberVerified(true);

      setSuccess(
        "Number verified. You can now create a new password."
      );
    } catch (error) {
      console.error(
        "Verify number error:",
        error
      );

      setError(
        "Something went wrong while checking your number."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Change password.
   *
   * The new password is hashed BEFORE
   * being sent to json-server.
   */
  const handleChangePassword = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!userId) {
      setError(
        "Please verify your cell number first."
      );
      return;
    }

    if (!newPassword) {
      setError(
        "Please enter a new password."
      );
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (
      newPassword !== confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      /*
       * Hash the password using the SAME
       * SHA-256 function used during registration.
       */
      const hashedPassword =
        hashPassword(newPassword);

      /*
       * PATCH the existing user.
       *
       * Only the password field is changed.
       */
      await updateUser(userId, {
        password: hashedPassword,
      });

      setSuccess(
        "Password changed successfully. Redirecting to login..."
      );

      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      setError(
        "Unable to change your password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-centered-container">
      <div className="auth-single-card">

        {/* Brand */}
        <div className="brand-header">
          <span className="brand-logo-icon">
            OL
          </span>

          <span className="brand-name">
            OrgList
          </span>
        </div>

        {!numberVerified ? (
          <>
            <h2>Forgot Password</h2>

            <p className="auth-subtitle">
              Enter your cell number to verify
              your account.
            </p>

            {error && (
              <div
                className="auth-error-alert"
                role="alert"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                className="auth-success-alert"
                role="status"
              >
                {success}
              </div>
            )}

            <form
              onSubmit={handleVerifyNumber}
            >
              <div className="minimal-input-group">
                <input
                  type="tel"
                  placeholder="Cell Number"
                  value={cellNumber}
                  onChange={(event) =>
                    setCellNumber(
                      event.target.value
                    )
                  }
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-pill-submit"
                disabled={loading}
              >
                {loading
                  ? "CHECKING..."
                  : "VERIFY NUMBER"}
              </button>
            </form>

            <div className="auth-footer-link">
              Remember your password?
              <Link to="/login">
                Login
              </Link>
            </div>
          </>
        ) : (
          <>
            <h2>Change Password</h2>

            <p className="auth-subtitle">
              Enter your new password below.
            </p>

            {error && (
              <div
                className="auth-error-alert"
                role="alert"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                className="auth-success-alert"
                role="status"
              >
                {success}
              </div>
            )}

            <form
              onSubmit={handleChangePassword}
            >
              <div className="minimal-input-group">
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(
                      event.target.value
                    )
                  }
                  minLength={8}
                  required
                />
              </div>

              <div className="minimal-input-group">
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  minLength={8}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-pill-submit"
                disabled={loading}
              >
                {loading
                  ? "CHANGING PASSWORD..."
                  : "CHANGE PASSWORD"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

