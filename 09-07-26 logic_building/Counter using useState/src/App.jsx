import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  const increase = () => setCount(count + 1);

  const decrease = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  const reset = () => setCount(0);

  return (
    <div className="container">
      <div className="card">
        <h1>Counter Dashboard</h1>
        <p>React useState Demonstration</p>

        <div className="counter">{count}</div>

        <div className="buttons">
          <button className="btn plus" onClick={increase}>
            ➕ Increment
          </button>

          <button className="btn minus" onClick={decrease}>
            ➖ Decrement
          </button>

          <button className="btn reset" onClick={reset}>
            🔄 Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;