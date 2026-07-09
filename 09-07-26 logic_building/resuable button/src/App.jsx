import "./App.css";
import Button from "./components/Button";
import Input from "./components/Input";

function App() {
  return (
    <div className="container">

      <div className="card">

        <h1>Reusable Components</h1>

        <p>
          Create reusable Button and Input
          components in React.
        </p>

        <Input placeholder="Enter Your Name" />

        <Input placeholder="Enter Email Address" />

        <div className="buttons">

          <Button
            text="Submit"
            color="#2563EB"
          />

          <Button
            text="Save"
            color="#22C55E"
          />

          <Button
            text="Delete"
            color="#EF4444"
          />

        </div>

      </div>

    </div>
  );
}

export default App;