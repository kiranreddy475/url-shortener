import { useState } from 'react'
 import './App.css'

function App() {
  const [url, setUrl] = useState("")
function onSubmit(){
   window.alert(url)
   setUrl("")
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

          <button  onClick={onSubmit}>
            Shorten
          </button>

        </div>

      </div>

    </div>
      
  )
}

export default App
