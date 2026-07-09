import "./EmployeeCard.css";

function EmployeeCard({ name, id, department, salary }) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="avatar">
          {name.charAt(0)}
        </div>

        <div>
          <h2>{name}</h2>
          <p className="emp-id">Employee ID: {id}</p>
        </div>
      </div>

      <div className="card-body">
        <div className="info">
          <span>Department</span>
          <strong>{department}</strong>
        </div>

        <div className="info">
          <span>Salary</span>
          <strong>₹ {salary}</strong>
        </div>
      </div>
    </div>
  );
}

export default EmployeeCard;