import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserByEmail } from "../services/authService";
import { hashPassword } from "../types/encryption";
import { useAppDispatch } from "../store/hooks";
import { login } from "../features/auth/authSlice";
import toast from "react-hot-toast";
import PasswordInput from "../components/PasswordInput";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const email = formData.email.trim().toLowerCase();
      const user = await getUserByEmail(email);

      if (!user || user.password !== hashPassword(formData.password)) {
        toast.error("Invalid email or password.");
        return;
      }

      dispatch(login(user));
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-page-container">
      <div className="landing-card">
      
        <div className="landing-form-section">
          <div className="landing-brand-header">
            <span className="brand-logo-icon">OL</span>
            <span className="brand-name">OrgLists</span>
          </div>

          <div className="landing-form-content">
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
              <div className="minimal-input-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Username or Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="minimal-input-group">
                <PasswordInput
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="forgot-link-wrapper">
                <Link to="/forgot-password">Forgot Your Password?</Link>
              </div>

              <button
                type="submit"
                className="btn-pill-submit"
                disabled={loading}
              >
                {loading ? "LOGGING IN..." : "LOGIN"}
              </button>
            </form>
          </div>
        </div>

        
        <div className="landing-hero-section">
          <div className="hero-top-nav">
            <span>Don't have an account ?</span>
            <Link to="/register" className="btn-hero-outline">
              Sign Up
            </Link>
          </div>

          <div className="hero-content">
            <h1>Welcome to OrgList</h1>
            <p>
              Organize and manage your shopping lists
              efficiently in one place.
            </p>
          </div>

          <div className="hero-pagination-dots">
            <span className="dot active"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;