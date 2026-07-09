import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch users.");
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load users.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <h1>User Directory</h1>
      <p>Fetching data using React useEffect()</p>

      {loading && <h2 className="loading">Loading users...</h2>}

      {error && <h2 className="error">{error}</h2>}

      <div className="user-grid">
        {users.map((user) => (
          <div className="card" key={user.id}>
            <div className="avatar">
              {user.name.charAt(0)}
            </div>

            <h2>{user.name}</h2>

            <div className="details">
              <p>
                <strong>Email</strong>
                <br />
                {user.email}
              </p>

              <p>
                <strong>Phone</strong>
                <br />
                {user.phone}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;