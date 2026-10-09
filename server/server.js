// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const Student = require("./models/Student");

// require("dotenv").config();
// const app = express();

// app.use(cors());
// app.use(express.json());

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((error) => {
//     console.log("MongoDB connection error:", error);
//   });

// // let students = [
// //   {
// //     id: 1,
// //     name: "Juan Dela Cruz",
// //     course: "BSIT",
// //     age: 20,
// //   },
// // ];

// app.get("/", (req, res) => {
//   res.send("Server is running!");
// });

// app.get("/students", async (req, res) => {
//   const students = await Student.find();

//   res.json(students);
// });

// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require("./models/Student");

const app = express();

app.use(cors());
app.use(express.json());

let connectError = null;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    connectError = error.message;
    console.log("MongoDB connection error:", error);
  });

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    
    res.status(500).json({ message: error.message, dbState: mongoose.connection.readyState, connectError });
  }
});

app.post("/students", async (req, res) => {
  const student = new Student({
    name: req.body.name,
    course: req.body.course,
    age: req.body.age,
  });
  const savedStudent = await student.save();
  res.status(201).json(savedStudent);
});

app.put("/students/:id", async (req, res) => {
  const updatedStudent = await Student.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      course: req.body.course,
      age: req.body.age,
    },
    { new: true },
  );

  res.json(updatedStudent);
});

app.delete("/students/:id", async (req, res) => {
  const deletedStudent = await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Student deleted" });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
}

module.exports = app;
