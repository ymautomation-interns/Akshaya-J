import EmployeeCard from "./components/EmployeeCard";

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "30px",
        flexWrap: "wrap",
        background: "#eef3f8",
        padding: "40px",
      }}
    >
      <EmployeeCard
        name="SANJU SHREE"
        id="EMP101"
        department="Biotechnology"
        salary="45,000"
      />

      <EmployeeCard
        name="JANANI"
        id="EMP102"
        department="Human Resources"
        salary="52,000"
      />
      <EmployeeCard
        name="NIVETHA"
        id="EMP103"
        department="HR"
        salary="48,500"
      />

      <EmployeeCard
        name="AKSHAYA"
        id="EMP104"
        department="Marketing"
        salary="40,500"
      />
    </div>
  );
}

export default App;