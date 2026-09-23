import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return (
      <Login
        onLogin={() => setIsLoggedIn(true)}
      />
    );
  }

  return (
    <UrlShortener
      onLogout={() => setIsLoggedIn(false)}
    />
  );
}


// =========================
// Login
// =========================

function Login({ onLogin }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin() {

    // Static credentials
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


// =========================
// URL Shortener
// =========================

function UrlShortener({ onLogout }) {

  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  async function onSubmit() {

    try {

      const response = await axios.post(
        "http://localhost:3000/short",
        {
          url
        }
      );

      console.log(response.data);

      setShortUrl(
        response.data.responseUrl
      );

    } catch (error) {

      console.log(error);

    }

    setUrl("");
  }

  return (
    <div className="app">

      <div className="shortener-card">

        <h1>Link Shortener</h1>

        <p>
          Turn your long URLs into short, shareable links.
        </p>

        <div className="input-container">

          <input
            type="text"
            placeholder="Enter your URL..."
            value={url}
            onChange={(e) =>
              setUrl(e.target.value)
            }
          />

          <button onClick={onSubmit}>
            Shorten
          </button>

        </div>

        {shortUrl && (
          <div className="result-container">

            <h3>Short URL</h3>

            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {shortUrl}
            </a>

          </div>
        )}

        <button
          className="logout-button"
          onClick={onLogout}
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default App;