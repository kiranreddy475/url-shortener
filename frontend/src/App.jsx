import { useState } from 'react'
import axios from 'axios'
 import './App.css'

function App() {
  const [url, setUrl] = useState("")
  const [shortUrl, setShortUrl] = useState("")
  
 async function onSubmit(){
try {
  
const response =   await axios.post("http://localhost:3000/short",{
  url
}
)

console.log(response.data)
setShortUrl(response.data.responseUrl)
}
catch(error){
console.log(error)
}

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
      </div>
      
    </div>
  )
}
export default App
