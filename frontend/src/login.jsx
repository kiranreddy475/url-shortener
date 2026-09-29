import { useState } from "react";

function Login({ onLogin }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin() {

    const staticUsername = "admin";
    const staticPassword = "123456";

    if (
      username === staticUsername &&
      password === staticPassword
    ) {
      setError("");
      onLogin();
    } else {
      setError("Invalid username or password");
    }
  }

  return (
    <div className="app">

      <div className="login-card">

        <h1>Welcome Back</h1>

        <p>
          Login to access the URL Shortener
        </p>

        <input
          className="login-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="login-button"
          onClick={handleLogin}
        >
          Login
        </button>

        {error && (
          <p className="login-error">
            {error}
          </p>
        )}

      </div>

    </div>
  );
}

export default Login;