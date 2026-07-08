import { useState, useEffect } from "react";
import "./App.css";

function App() {

  const [employee, setEmployee] = useState({
    name: "",
    age: "",
    department: "",
    salary: ""
  });

  const [employees, setEmployees] = useState([]);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  const fetchEmployees = async () => {
    const response = await fetch("http://localhost:5000/employees");
    const data = await response.json();
    setEmployees(data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const url = editId
      ? `http://localhost:5000/employees/${editId}`
      : "http://localhost:5000/submit";

    const method = editId ? "PUT" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(employee)
    });

    const result = await response.json();

    setMessage(result.message);

    setEmployee({
      name: "",
      age: "",
      department: "",
      salary: ""
    });

    setEditId(null);

    fetchEmployees();
  };

  const handleEdit = (emp) => {

    setEmployee({
      name: emp.name,
      age: emp.age,
      department: emp.department,
      salary: emp.salary
    });

    setEditId(emp._id);
  };

  return (

    <div className="container">

      <h1>Employee Registration</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Enter Employee Name"
          value={employee.name}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="age"
          placeholder="Enter Age"
          value={employee.age}
          onChange={handleChange}
          required
        />

        <select
          name="department"
          value={employee.department}
          onChange={handleChange}
          required
        >
          <option value="">Select Department</option>
          <option value="HR">HR</option>
          <option value="IT">IT</option>
          <option value="Finance">Finance</option>
          <option value="Marketing">Marketing</option>
        </select>

        <input
          type="number"
          name="salary"
          placeholder="Enter Salary"
          value={employee.salary}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editId ? "Update Employee" : "Submit"}
        </button>

      </form>

      <h3>{message}</h3>

      <h2>Employee List</h2>

      <table border="1" cellPadding="10" style={{ width: "100%" }}>

        <thead>

          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Action</th>
          </tr>

        </thead>

        <tbody>

          {employees.map((emp) => (

            <tr key={emp._id}>

              <td>{emp.name}</td>
              <td>{emp.age}</td>
              <td>{emp.department}</td>
              <td>{emp.salary}</td>

              <td>

                <button
                  onClick={() => handleEdit(emp)}
                >
                  Edit
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default App;