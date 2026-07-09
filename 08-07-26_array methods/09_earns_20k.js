const employees = [
  { id: 1, name: "Akash", age: 24, salary: 25000, department: "IT" },
  { id: 2, name: "Priya", age: 27, salary: 40000, department: "HR" },
  { id: 3, name: "John", age: 30, salary: 55000, department: "Finance" },
  { id: 4, name: "Yogesh", age: 22, salary: 28000, department: "IT" },
  { id: 5, name: "Anu", age: 26, salary: 35000, department: "HR" },
];

const allAbove20k = employees.every(emp => emp.salary > 20000);

console.log(allAbove20k);