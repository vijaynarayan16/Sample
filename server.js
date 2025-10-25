// Simple Express backend with lowdb (file-based JSON DB)
const express = require("express");
const cors = require("cors");
const { Low } = require("lowdb");
const { JSONFile } = require("lowdb/node");
const { nanoid } = require("nanoid");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// DB setup
const file = path.join(__dirname, "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);

async function initDB() {
  await db.read();
  db.data = db.data || { students: [] };
  await db.write();
}
initDB();

// REST endpoints
// Get all students
app.get("/students", async (req, res) => {
  await db.read();
  res.json(db.data.students);
});

// Add a new student
app.post("/students", async (req, res) => {
  const { name, roll, marks } = req.body;
  if (!name || !roll || typeof marks !== "number") {
    return res.status(400).json({ error: "Invalid student data" });
  }

  // Calculate grade
  const calcGrade = (m) => {
    if (m >= 90) return "A+";
    if (m >= 80) return "A";
    if (m >= 70) return "B";
    if (m >= 60) return "C";
    if (m >= 50) return "D";
    return "F";
  };

  const student = {
    id: nanoid(),
    name,
    roll,
    marks,
    grade: calcGrade(marks),
    createdAt: new Date().toISOString()
  };

  await db.read();
  db.data.students.push(student);
  await db.write();

  res.status(201).json(student);
});

// Update a student (marks/name/roll)
app.put("/students/:id", async (req, res) => {
  const id = req.params.id;
  const { name, roll, marks } = req.body;

  await db.read();
  const idx = db.data.students.findIndex((s) => s.id === id);
  if (idx === -1) return res.status(404).json({ error: "Student not found" });

  if (name !== undefined) db.data.students[idx].name = name;
  if (roll !== undefined) db.data.students[idx].roll = roll;
  if (marks !== undefined) {
    db.data.students[idx].marks = marks;
    const m = marks;
    const calcGrade = (m) => {
      if (m >= 90) return "A+";
      if (m >= 80) return "A";
      if (m >= 70) return "B";
      if (m >= 60) return "C";
      if (m >= 50) return "D";
      return "F";
    };
    db.data.students[idx].grade = calcGrade(m);
  }

  await db.write();
  res.json(db.data.students[idx]);
});

// Delete one student
app.delete("/students/:id", async (req, res) => {
  const id = req.params.id;
  await db.read();
  const originalLength = db.data.students.length;
  db.data.students = db.data.students.filter((s) => s.id !== id);
  await db.write();
  if (db.data.students.length === originalLength) {
    return res.status(404).json({ error: "Student not found" });
  }
  res.json({ success: true });
});

// Clear all students
app.delete("/students", async (req, res) => {
  db.data.students = [];
  await db.write();
  res.json({ success: true });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(Student Grading API running on http://localhost:${PORT});
});
