function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    try {
      setError("");

      const response = await axios.post(
        "http://localhost:3000/login",
        {
          username,
          password
        }
      );

      console.log(response.data);

      if (response.data.success) {
        onLogin();
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