import { useState } from "react";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "container dark" : "container light"}>
      <div className="card">

        <div className="icon">
          {darkMode ? "🌙" : "🌞"}
        </div>

        <h1>
          {darkMode ? "Dark Mode" : "Light Mode"}
        </h1>

        <p>
          {darkMode
            ? "Dark mode is enabled for a comfortable viewing experience."
            : "Light mode is enabled for a bright and refreshing experience."}
        </p>

        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode
            ? "☀️ Switch to Light Mode"
            : "🌙 Switch to Dark Mode"}
        </button>

      </div>
    </div>
  );
}

export default App;