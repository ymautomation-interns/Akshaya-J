const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = 5000;

const uri = "mongodb+srv://admin:AKSHU1213@cluster0.h5otten.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri);

app.use(cors());
app.use(express.json());

async function connectDB() {
  try {
    await client.connect();
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.log(err);
  }
}

connectDB();



app.post("/submit", async (req, res) => {

  try {

    const db = client.db("EmployeeDB");
    const collection = db.collection("employees");

    await collection.insertOne(req.body);

    res.json({
      message: "Employee Registered Successfully!"
    });

  } catch (err) {

    console.log(err);   

    res.status(500).json({
      message: "Error saving employee data"
    });

  }

});



app.get("/employees", async (req, res) => {

  try {

    const db = client.db("EmployeeDB");
    const collection = db.collection("employees");

    const employees = await collection.find().toArray();

    res.json(employees);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Error fetching employees"
    });

  }

});



app.put("/employees/:id", async (req, res) => {

  try {

    const db = client.db("EmployeeDB");
    const collection = db.collection("employees");

    await collection.updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          name: req.body.name,
          age: req.body.age,
          department: req.body.department,
          salary: req.body.salary
        }
      }
    );

    res.json({
      message: "Employee Updated Successfully!"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Update Failed"
    });

  }

});



app.get("/", (req, res) => {

  res.send("Backend Server is Running Successfully!");

});



app.listen(PORT, () => {

  console.log(`Server running on http://localhost:${PORT}`);

});