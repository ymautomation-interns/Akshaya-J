const API_URL = 'http://localhost:5000/api';
const state = { students: [], viewMode: 'table' };

function ensureAuth() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) {
    window.location.href = 'index.html';
  }
}

async function loadStudents() {
  try {
    const response = await fetch(`${API_URL}/students`, {
      headers: { 'x-user-role': 'user' }
    });
    const students = await response.json();
    state.students = students;
    renderStudents();
    document.getElementById('studentCount').textContent = students.length;
  } catch (error) {
    console.error(error);
  }
}

function renderStudents() {
  const container = document.getElementById('studentTable');
  if (!container) return;

  if (state.viewMode === 'card') {
    container.innerHTML = `<div class="card-grid">${state.students.map(student => `
      <div class="student-card">
        <h3>${student.name}</h3>
        <p><strong>Email:</strong> ${student.email}</p>
        <p><strong>Phone:</strong> ${student.phone || '-'}</p>
        <p><strong>Department:</strong> ${student.department || '-'}</p>
        <p><strong>Course:</strong> ${student.course || '-'}</p>
        <p><strong>Age:</strong> ${student.age || '-'}</p>
        <p><strong>Address:</strong> ${student.address || '-'}</p>
      </div>
    `).join('')}</div>`;
  } else {
    container.innerHTML = `
      <table>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Phone</th><th>Department</th><th>Course</th><th>Age</th><th>Address</th></tr>
        </thead>
        <tbody>
          ${state.students.map(student => `
            <tr>
              <td>${student.name}</td>
              <td>${student.email}</td>
              <td>${student.phone || '-'}</td>
              <td>${student.department || '-'}</td>
              <td>${student.course || '-'}</td>
              <td>${student.age || '-'}</td>
              <td>${student.address || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>`;
  }
}

function attachEvents() {
  document.getElementById('tableViewBtn').addEventListener('click', () => {
    state.viewMode = 'table';
    document.getElementById('tableViewBtn').classList.add('active');
    document.getElementById('cardViewBtn').classList.remove('active');
    renderStudents();
  });
  document.getElementById('cardViewBtn').addEventListener('click', () => {
    state.viewMode = 'card';
    document.getElementById('cardViewBtn').classList.add('active');
    document.getElementById('tableViewBtn').classList.remove('active');
    renderStudents();
  });
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  });
}

ensureAuth();
attachEvents();
loadStudents();
