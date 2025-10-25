document.addEventListener("DOMContentLoaded", loadData);

function calculateGrade(marks) {
  if (marks >= 90) return "O";
  else if (marks >= 80) return "A+";
  else if (marks >= 70) return "A";
  else if (marks >= 60) return "B";
  else if (marks >= 50) return "C";
  else return "F";
}

function addStudent() {
  const name = document.getElementById("name").value.trim();
  const roll = document.getElementById("roll").value.trim();
  const marks = parseFloat(document.getElementById("marks").value);

  if (!name || !roll || isNaN(marks)) {
    alert("⚠️ Please enter all details correctly!");
    return;
  }

  const grade = calculateGrade(marks);
  const student = { name, roll, marks, grade };

  // Save to localStorage
  let students = JSON.parse(localStorage.getItem("students")) || [];
  students.push(student);
  localStorage.setItem("students", JSON.stringify(students));

  displayStudents();
  clearInputs();
}

function displayStudents() {
  const tableBody = document
    .getElementById("gradeTable")
    .getElementsByTagName("tbody")[0];
  tableBody.innerHTML = "";

  const students = JSON.parse(localStorage.getItem("students")) || [];

  students.forEach((s) => {
    const row = tableBody.insertRow();
    row.insertCell(0).textContent = s.name;
    row.insertCell(1).textContent = s.roll;
    row.insertCell(2).textContent = s.marks;
    row.insertCell(3).textContent = s.grade;
  });
}

function clearInputs() {
  document.getElementById("name").value = "";
  document.getElementById("roll").value = "";
  document.getElementById("marks").value = "";
}

function clearAll() {
  if (confirm("Are you sure you want to delete all student records?")) {
    localStorage.removeItem("students");
    displayStudents();
  }
}

function loadData() {
  displayStudents();
}
