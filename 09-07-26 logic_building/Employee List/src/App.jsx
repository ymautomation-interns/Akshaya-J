import "./App.css";

function App() {

  const employees = [
    {
      id: 101,
      name: "Sanju Shree",
      dept: "Human Resources",
      role: "HR Executive",
      email: "sanju@company.com",
    },
    {
      id: 102,
      name: "Arun Kumar",
      dept: "Information Technology",
      role: "Software Engineer",
      email: "arun@company.com",
    },
    {
      id: 103,
      name: "Priya Sharma",
      dept: "Marketing",
      role: "Marketing Manager",
      email: "priya@company.com",
    },
    {
      id: 104,
      name: "Rahul Verma",
      dept: "Finance",
      role: "Financial Analyst",
      email: "rahul@company.com",
    },
  ];

  return (
    <div className="container">

      <h1>Employee Directory</h1>
      <p>Displaying Employee Details using React map()</p>

      <div className="employee-grid">

        {employees.map((employee) => (
          <div className="card" key={employee.id}>

            <div className="avatar">
              {employee.name.charAt(0)}
            </div>

            <h2>{employee.name}</h2>

            <p className="role">{employee.role}</p>

            <div className="details">
              <p><strong>ID :</strong> {employee.id}</p>
              <p><strong>Department :</strong> {employee.dept}</p>
              <p><strong>Email :</strong> {employee.email}</p>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default App;