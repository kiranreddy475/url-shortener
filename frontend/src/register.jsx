
import { useState } from "react";
import axios from "axios";

function Register({ onRegister }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleRegister() {

    try {
      setError("");

      const response = await axios.post(
        "http://localhost:3000/register",
        {
          username,
          password
        }
      );

      console.log(response.data);

      if (response.data.success) {
        onRegister();
      }

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Something went wrong"
      );
    }
  }

  return (
    <div className="app">

      <div className="login-card">

        <h1>Create Account</h1>

        <p>
          Register to use the URL Shortener
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
          onClick={handleRegister}
        >
          Register
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

export default Register;
