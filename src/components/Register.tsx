import { type FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, getUserByEmail } from "../../src/services/authService";
import {encrypt} from "../types/encryption";

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

      const existingUser = await getUserByEmail(formData.email);

      if (existingUser) {
        setError("An account with this email already exists.Try signing in");
        return;
      }

      // Encryption
      const encryptedPassword = encrypt(formData.password);

   await registerUser({
  ...formData,
  password: encryptedPassword,
});

      await registerUser(formData);

      setSuccess("Registration successful!");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch {
      setError("Something went wrong during registration.");
    }
  };

  return (
    <main>
      <h1>Create Account</h1>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          placeholder="your name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <label>Surname</label>
        <input
          type="text"
          name="surname"
          placeholder=""
          value={formData.surname}
          onChange={handleChange}
          required
        />
<label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="exapmle.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
<label>Cell Number</label>
        <input
          type="tel"
          name="cellNumber"
          placeholder="Cell number"
          value={formData.cellNumber}
          onChange={handleChange}
          required
        />
<label>Password</label>
        <input
          type="password"
          name="password"
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