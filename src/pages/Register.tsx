import { type FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  registerUser,
  getUserByEmail,
} from "../services/authService";

import { hashPassword } from "../types/encryption";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    surname: "",
    cellNumber: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    try {
      // Check that all fields have been completed
      if (
        !formData.email ||
        !formData.password ||
        !formData.name ||
        !formData.surname ||
        !formData.cellNumber
      ) {
        setError("Please complete all fields.");
        return;
      }

      // Convert email to lowercase
      const email = formData.email
        .trim()
        .toLowerCase();

      // Check if the email is already registered
      const existingUser =
        await getUserByEmail(email);

      if (existingUser) {
        setError(
          "An account with this email already exists. Try signing in."
        );
        return;
      }

      // Hash the password before sending it
      // to JSON Server.
      const hashedPassword =
        hashPassword(formData.password);

      // Create the user
      await registerUser({
        email,
        password: hashedPassword,
        name: formData.name.trim(),
        surname: formData.surname.trim(),
        cellNumber: formData.cellNumber.trim(),
      });

      setSuccess(
        "Registration successful! Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      setError(
        "Something went wrong during registration."
      );
    }
  };

  return (
    <main className="auth-page">
      <h1>Create Account</h1>

      {error && (
        <p role="alert">
          {error}
        </p>
      )}

      {success && (
        <p role="status">
          {success}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">
          Name
        </label>

        <input
          id="name"
          type="text"
          name="name"
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="surname">
          Surname
        </label>

        <input
          id="surname"
          type="text"
          name="surname"
          placeholder="Your surname"
          value={formData.surname}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">
          Email
        </label>

        <input
          id="email"
          type="email"
          name="email"
          placeholder="example@email.com"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="cellNumber">
          Cell Number
        </label>

        <input
          id="cellNumber"
          type="tel"
          name="cellNumber"
          placeholder="Cell number"
          value={formData.cellNumber}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">
          Password
        </label>

        <input
          id="password"
          type="password"
          name="password"
          placeholder="Password"
          minLength={8}
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">
          Register
        </button>
      </form>

      <p>
        Already have an account?{" "}
        <Link to="/login">
          Login
        </Link>
      </p>
    </main>
  );
};

export default Register;