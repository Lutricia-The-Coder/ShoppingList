
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
import toast from "react-hot-toast";

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

  const [loading, setLoading] =
    useState(false);

  const [numberVerified, setNumberVerified] =
    useState(false);

  const handleVerifyNumber = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    if (!cellNumber.trim()) {
      toast.error("Please enter your cell number.");
      return;
    }

    try {
      setLoading(true);

      const user =
        await getUserByCellNumber(
          cellNumber
        );

      if (!user) {
        toast.error("No account was found with that cell number.");
        return;
      }

   
      setUserId(user.id);
      setNumberVerified(true);

      toast.success("Number verified. You can now create a new password.");
    } catch (error) {
      console.error(
        "Verify number error:",
        error
      );

      toast.error("Something went wrong while checking your number.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    if (!userId) {
      toast.error("Please verify your cell number first.");
      return;
    }

    if (!newPassword) {
      toast.error("Please enter a new password.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (
      newPassword !== confirmPassword
    ) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const hashedPassword =
        hashPassword(newPassword);

      await updateUser(userId, {
        password: hashedPassword,
      });

      toast.success("Password changed successfully. Redirecting to login...");

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

      toast.error("Unable to change your password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-centered-container">
      <div className="auth-single-card">

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

