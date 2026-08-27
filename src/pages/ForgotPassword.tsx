import {
  type FormEvent,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

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
    useState("");

  const [step, setStep] = useState(1);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /*
   * STEP 1
   *
   * Find the account using the
   * user's cell number.
   */
  const handleFindAccount = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");

    const trimmedCellNumber =
      cellNumber.trim();

    if (!trimmedCellNumber) {
      setError(
        "Please enter your cell number."
      );

      return;
    }

    try {
      setLoading(true);

      const user =
        await getUserByCellNumber(
          trimmedCellNumber
        );

      if (!user) {
        setError(
          "No account was found with that cell number."
        );

        return;
      }

      /*
       * Keep only the user ID.
       *
       * We don't need to store the
       * existing password.
       */
      setUserId(user.id);

      setMessage(
        "Account found. You can now create a new password."
      );

      setStep(2);
    } catch (error) {
      console.error(
        "Find account error:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * STEP 2
   *
   * Validate and update the password.
   */
  const handleResetPassword = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!userId) {
      setError(
        "Your account could not be identified. Please start again."
      );

      setStep(1);

      return;
    }

    if (newPassword.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );

      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    try {
      setLoading(true);

      /*
       * Hash the new password before
       * sending it to the API.
       */
      const hashedPassword =
        hashPassword(newPassword);

      /*
       * PATCH the existing user.
       *
       * Only the password field is
       * changed.
       */
      await updateUser(userId, {
        password: hashedPassword,
      });

      setMessage(
        "Password reset successfully. Redirecting to sign in..."
      );

      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error(
        "Password reset error:",
        error
      );

      setError(
        "Unable to reset your password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };



  return (
    <main className="auth-page">
      <div className="auth-header">
        <h1>Reset your password</h1>

        <p>
          Reset your password using
          your registered cell number.
        </p>
      </div>

      {message && (
        <p
          className="auth-success-alert"
          role="status"
        >
          {message}
        </p>
      )}

      {error && (
        <p
          className="auth-error-alert"
          role="alert"
        >
          {error}
        </p>
      )}


      {step === 1 && (
        <form
          onSubmit={
            handleFindAccount
          }
        >
          <p>
            Enter the cell number
            associated with your account.
          </p>

          <label htmlFor="forgot-phone">
            Cell number
          </label>

          <input
            id="forgot-phone"
            type="tel"
            value={cellNumber}
            onChange={(event) =>
              setCellNumber(
                event.target.value
              )
            }
            placeholder="+27 123 456 7891"
            autoComplete="tel"
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Finding account..."
              : "Continue"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form
          onSubmit={
            handleResetPassword
          }
        >
          <p>
            Create a new password for
            your account.
          </p>

          <label htmlFor="new-password">
            New password
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
            autoComplete="new-password"
            placeholder="Enter new password"
            required
          />

          <label htmlFor="confirm-password">
            Confirm password
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
            autoComplete="new-password"
            placeholder="Confirm new password"
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Resetting password..."
              : "Reset password"}
          </button>

        </form>
      )}

      <div>
        <button
          type="button"
          onClick={() =>
            navigate("/login")
          }
          disabled={loading}
        >
          Back to sign in
        </button>
      </div>
    </main>
  );
};

export default ForgotPassword;