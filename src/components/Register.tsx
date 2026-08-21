import { type FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  registerUser,
  getUserByEmail,
} from "../services/authService";

import { encrypt } from "../types/encryption";

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

      // Check if the email is already registered
      const existingUser = await getUserByEmail(formData.email);

      if (existingUser) {
        setError(
          "An account with this email already exists. Try signing in."
        );
        return;
      }

      // Encrypting the password before sending it to JSON Server
      const encryptedPassword = encrypt(formData.password);

      // Create the user with the encrypted password
      await registerUser({
        ...formData,
        password: encryptedPassword,
      });

      setSuccess("Registration successful!");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
  console.error("Registration error:", error);
  setError("Something went wrong during registration.");
}
  };

  return (
    <main>
      <h1>Create Account</h1>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>

        <input
          id="name"
          type="text"
          name="name"
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="surname">Surname</label>

        <input
          id="surname"
          type="text"
          name="surname"
          placeholder="Your surname"
          value={formData.surname}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email</label>

        <input
          id="email"
          type="email"
          name="email"
          placeholder="example@email.com"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="cellNumber">Cell Number</label>

        <input
          id="cellNumber"
          type="tel"
          name="cellNumber"
          placeholder="Cell number"
          value={formData.cellNumber}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>

        <input
          id="password"
          type="password"
          name="password"
          placeholder="Password"
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
        <Link to="/login">Login</Link>
      </p>
    </main>
  );
};

export default Register;