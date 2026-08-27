import { type FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, getUserByEmail } from "../services/authService";
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

      const email = formData.email.trim().toLowerCase();
      const existingUser = await getUserByEmail(email);

      if (existingUser) {
        setError("An account with this email already exists. Try signing in.");
        return;
      }

      const hashedPassword = hashPassword(formData.password);

      await registerUser({
        email,
        password: hashedPassword,
        name: formData.name.trim(),
        surname: formData.surname.trim(),
        cellNumber: formData.cellNumber.trim(),
      });

      setSuccess("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);
      setError("Something went wrong during registration.");
    }
  };

  return (
    <div className="auth-centered-container">
      <div className="auth-single-card">
        <div className="brand-header">
          <span className="brand-logo-icon">G</span>
          <span className="brand-name">mbank</span>
        </div>

        <h2>Create Account</h2>
        <p className="auth-subtitle">
          Enter your details below to create your account
        </p>

        {error && <div className="auth-error-alert" role="alert">{error}</div>}
        {success && <div className="auth-success-alert" role="status">{success}</div>}

        <form onSubmit={handleSubmit}>
          
            <div className="minimal-input-group">
              <input
                id="name"
                type="text"
                name="name"
                placeholder="First Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="minimal-input-group">
              <input
                id="surname"
                type="text"
                name="surname"
                placeholder="Last Name"
                value={formData.surname}
                onChange={handleChange}
                required
              />
            </div>
          

          <div className="minimal-input-group">
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="minimal-input-group">
            <input
              id="cellNumber"
              type="tel"
              name="cellNumber"
              placeholder="Cell Number"
              value={formData.cellNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="minimal-input-group">
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
          </div>

          <button
            type="submit"
            className="btn-pill-submit"
            style={{ marginTop: "16px" }}
          >
            REGISTER
          </button>
        </form>

        <div className="auth-footer-link">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;