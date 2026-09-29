import { useState } from "react";

import Url from "./urlshortner";
import "./App.css";
import Login from "./login";

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
    <Url
      onLogout={() => setIsLoggedIn(false)}
    />
  );
}

export default App;