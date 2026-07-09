import "./App.css";

function App() {

  const employees = [
    {
      id: 101,
      name: "Sanju Shree",
      department: "Human Resources",
      status: "Active",
    },
    {
      id: 102,
      name: "Arun Kumar",
      department: "Information Technology",
      status: "Inactive",
    },
    {
      id: 103,
      name: "Priya Sharma",
      department: "Marketing",
      status: "Active",
    },
    {
      id: 104,
      name: "Rahul Verma",
      department: "Finance",
      status: "Inactive",
    },
  ];

  return (
    <div className="container">

      <h1>Employee Status Dashboard</h1>
      <p>Conditional Rendering using React</p>

      <div className="employee-grid">

        {employees.map((employee) => (

          <div className="card" key={employee.id}>

            <div className="avatar">
              {employee.name.charAt(0)}
            </div>

            <h2>{employee.name}</h2>

            <p className="department">
              {employee.department}
            </p>

            <div className="status-section">

              <span>Status :</span>

              {employee.status === "Active" ? (
                <span className="active">
                  🟢 Active
                </span>
              ) : (
                <span className="inactive">
                  🔴 Inactive
                </span>
              )}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default App;