import { useState } from "react";
import Card from "../components/UI/Card.jsx";
import Button from "../components/UI/Button.jsx";
import Input from "../components/UI/Input.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

const Login = () => {
  const { setSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.login({ email, password });
      setSession(response.session);
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login-panel">
        <div className="login-hero">
          <div className="login-badge">Internal Access</div>
          <h1>Ship client work with clarity.</h1>
          <p>
            Track projects, align tasks, and keep delivery momentum in one
            command center.
          </p>
          <div className="login-graphic" />
        </div>
        <Card className="login-card">
          <h2>Welcome back</h2>
          <p>Sign in with your agency credentials.</p>
          <form onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@agency.com"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
            />
            {error ? <div className="ui-error">{error}</div> : null}
            <Button type="submit" disabled={isLoading} className="full-width">
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
