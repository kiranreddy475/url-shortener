import { useState } from "react";
import axios from "axios";

function Urlshortner({ onLogout }) {

  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  async function onSubmit() {

    try {

      if (!url) {
        alert("Please enter a URL");
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/short",
        {
          url
        }
      );

      console.log(response.data);

      setShortUrl(response.data.responseUrl);

      setUrl("");

    } catch (error) {

      console.log(error);

    }
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
            onChange={(e) => setUrl(e.target.value)}
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

export default Urlshortner;