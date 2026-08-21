import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { login } from "../features/auth/authSlice";
import { getUserByEmail } from "../services/authService";
import { encrypt } from "../types/encryption";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setError("");

    try {
      const user = await getUserByEmail(email);

      if (!user) {
        setError("Invalid email or password.");
        return;
      }

      const encryptedPassword = encrypt(password);

      if (encryptedPassword !== user.password) {
        setError("Invalid email or password.");
        return;
      }

      dispatch(login(user));

      navigate("/");
    } catch {
      setError("Something went wrong while logging in.");
    }
  };

  return (
    <main>
       <h1>Welcome back!</h1>
                  <p>Sign in to continue</p>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
          <label>Email</label>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
 <label>Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button type="submit">
          Login
        </button>
      </form>

      <p>
        Don't have an account?{" "}
        <Link to="/register">Register</Link>
      </p>
    </main>
  );
};

export default LoginPage