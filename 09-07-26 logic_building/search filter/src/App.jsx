import { useState } from "react";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");

  const employees = [
    {
      id: 101,
      name: "Sanju Shree",
      department: "Human Resources",
      role: "HR Executive",
    },
    {
      id: 102,
      name: "Arun Kumar",
      department: "Information Technology",
      role: "Software Engineer",
    },
    {
      id: 103,
      name: "Priya Sharma",
      department: "Marketing",
      role: "Marketing Manager",
    },
    {
      id: 104,
      name: "Rahul Verma",
      department: "Finance",
      role: "Financial Analyst",
    },
    {
      id: 105,
      name: "Sneha Reddy",
      department: "Sales",
      role: "Sales Executive",
    },
  ];

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Employee Search</h1>
      <p>Search employees using React filter()</p>

      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="employee-grid">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => (
            <div className="card" key={employee.id}>
              <div className="avatar">
                {employee.name.charAt(0)}
              </div>

              <h2>{employee.name}</h2>

              <p className="role">{employee.role}</p>

              <div className="details">
                <p><strong>ID:</strong> {employee.id}</p>
                <p><strong>Department:</strong> {employee.department}</p>
              </div>
            </div>
          ))
        ) : (
          <h2 className="not-found">
            No Employee Found
          </h2>
        )}
      </div>
    </div>
  );
}

export default App;