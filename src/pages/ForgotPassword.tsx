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

  const [verificationCode, setVerificationCode] =
    useState("");

  const [enteredCode, setEnteredCode] =
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

  /*
   * Step 1:
   * Find the user and generate
   * a verification code.
   */
  const handleSendCode = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
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
       * Generate a six digit code.
       */
      const code =
        Math.floor(
          100000 +
            Math.random() * 900000
        ).toString();

      setUserId(user.id);
      setVerificationCode(code);

      /*
       * Development/testing only.
       * There is no real SMS service connected.
       */
      setMessage(
        `Verification code: ${code}`
      );

      setStep(2);
    } catch (error) {
      console.error(
        "Forgot password error:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    }
  };

  /*
   * Step 2:
   * Verify the code.
   */
  const handleVerifyCode = (
    event: FormEvent
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (
      enteredCode.trim() !==
      verificationCode
    ) {
      setError(
        "Invalid verification code."
      );

      return;
    }

    setMessage(
      "Verification successful."
    );

    setStep(3);
  };

  /*
   * Step 3:
   * Hash the new password and
   * update the user with PATCH.
   */
  const handleResetPassword = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");

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
      /*
       * Hash the password.
       * We never decrypt it.
       */
      const hashedPassword =
        hashPassword(newPassword);

      /*
       * PATCH only changes the
       * password field.
       */
      await updateUser(userId, {
        password: hashedPassword,
      });

      setMessage(
        "Password reset successfully."
      );

      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error(
        "Password reset error:",
        error
      );

      setError(
        "Unable to reset your password."
      );
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-header">
        <h1>Reset your password</h1>

        <p>
          Follow the steps below to
          reset your password.
        </p>
      </div>

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

      {/* STEP 1 */}
      {step === 1 && (
        <form
          onSubmit={
            handleSendCode
          }
        >
          <p>
            Enter your cell number to
            receive a verification code.
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
            required
          />

          <button type="submit">
            Send verification code
          </button>
        </form>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <form
          onSubmit={
            handleVerifyCode
          }
        >
          <p>
            Enter the verification
            code sent to your cell
            number.
          </p>

          <label htmlFor="verification-code">
            Verification code
          </label>

          <input
            id="verification-code"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={enteredCode}
            onChange={(event) =>
              setEnteredCode(
                event.target.value
              )
            }
            placeholder="123456"
            required
          />

          <button type="submit">
            Verify code
          </button>
        </form>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <form
          onSubmit={
            handleResetPassword
          }
        >
          <p>
            Enter your new password.
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
            required
          />

          <button type="submit">
            Reset password
          </button>
        </form>
      )}

      <div>
        <button
          type="button"
          onClick={() =>
            navigate("/login")
          }
        >
          Back to sign in
        </button>
      </div>
    </main>
  );
};

export default ForgotPassword;