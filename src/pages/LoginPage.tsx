import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAppDispatch } from "../store/hooks";
import { login } from "../features/auth/authSlice";
import { getUserByEmail } from "../services/authService";

import { hashPassword } from "../types/encryption";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    setError("");

    try {
      // Make sure the email matches the
      // format used during registration.
      const normalizedEmail = email
        .trim()
        .toLowerCase();

      const user =
        await getUserByEmail(normalizedEmail);

      if (!user) {
        setError(
          "Invalid email or password."
        );
        return;
      }

      // Hash the password entered during login.
      const hashedPassword =
        hashPassword(password);

      // Compare the hash with the value
      // stored in JSON Server.
      if (hashedPassword !== user.password) {
        setError(
          "Invalid email or password."
        );
        return;
      }

      // Login successful
      dispatch(login(user));

      navigate("/");
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        "Something went wrong while logging in."
      );
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-header">
        <h1>Welcome back!</h1>

        <p>
          Sign in to continue
        </p>
      </div>

      {error && (
        <p role="alert">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <label htmlFor="login-email">
          Email
        </label>

        <input
          id="login-email"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          required
        />

        <label htmlFor="login-password">
          Password
        </label>

        <input
          id="login-password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          required
        />

        <button type="submit">
          Login
        </button>
      </form>

      <p>
        <Link to="/forgot-password">
          Forgot your password?
        </Link>
      </p>

      <p>
        Don't have an account?{" "}
        <Link to="/register">
          Register
        </Link>
      </p>
    </main>
  );
};

export default LoginPage;