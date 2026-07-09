import { useState } from "react";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");
    setSuccess("");

    let isValid = true;

    // Email Validation
    if (email.trim() === "") {
      setEmailError("Email cannot be empty");
      isValid = false;
    } else if (!email.includes("@")) {
      setEmailError("Email must contain '@'");
      isValid = false;
    }

    // Password Validation
    if (password.trim() === "") {
      setPasswordError("Password cannot be empty");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }

    // Success
    if (isValid) {
      setSuccess("🎉 Login Successful!");
      console.log({
        Email: email,
        Password: password,
      });
    }
  };

  return (
    <div className="container">
      <form className="login-card" onSubmit={handleLogin} noValidate>

        <h1>Welcome Back</h1>
        <p>Sign in to continue</p>

        <div className="input-group">
          <label>Email Address</label>

          <input
            type="text"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {emailError && (
            <span className="error">{emailError}</span>
          )}
        </div>

        <div className="input-group">
          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {passwordError && (
            <span className="error">{passwordError}</span>
          )}
        </div>

        <button type="submit">
          Login
        </button>

        {success && (
          <p className="success">{success}</p>
        )}

      </form>
    </div>
  );
}

export default App;