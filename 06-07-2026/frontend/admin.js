const API_URL = 'http://localhost:5000/api';
const state = { students: [], viewMode: 'table' };

function ensureAuth() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user || user.role !== 'admin') {
    window.location.href = 'index.html';
  }
}

async function loadStudents() {
  try {
    const response = await fetch(`${API_URL}/students`, {
      headers: { 'x-user-role': 'admin' }
    });
    const students = await response.json();
    state.students = students;
    renderCount();
    renderStudents();
  } catch (error) {
    console.error(error);
  }
}

async function loadCount() {
  try {
    const response = await fetch(`${API_URL}/students/count`, {
      headers: { 'x-user-role': 'admin' }
    });
    const data = await response.json();
    document.getElementById('studentCount').textContent = data.count;
  } catch (error) {
    console.error(error);
  }
}

function renderCount() {
  document.getElementById('studentCount').textContent = state.students.length;
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
        <div class="actions">
          <button data-action="edit" data-id="${student.id}">Edit</button>
          <button data-action="delete" data-id="${student.id}" class="secondary">Delete</button>
        </div>
      </div>
    `).join('')}</div>`;
  } else {
    container.innerHTML = `
      <table>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Phone</th><th>Department</th><th>Course</th><th>Age</th><th>Address</th><th>Actions</th></tr>
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
              <td>
                <button data-action="edit" data-id="${student.id}">Edit</button>
                <button data-action="delete" data-id="${student.id}" class="secondary">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>`;
  }
}

async function saveStudent(event) {
  event.preventDefault();
  const form = event.target;
  const id = document.getElementById('studentId').value;
  const payload = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    department: document.getElementById('department').value,
    course: document.getElementById('course').value,
    age: document.getElementById('age').value,
    address: document.getElementById('address').value
  };

  const method = id ? 'PUT' : 'POST';
  const url = id ? `${API_URL}/students/${id}` : `${API_URL}/students`;

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-user-role': 'admin'
    },
    body: JSON.stringify(payload)
  });

  if (response.ok) {
    form.reset();
    document.getElementById('studentId').value = '';
    document.getElementById('formTitle').textContent = 'Add Student';
    await loadStudents();
    await loadCount();
  }
}

function populateForm(student) {
  document.getElementById('studentId').value = student.id;
  document.getElementById('name').value = student.name;
  document.getElementById('email').value = student.email;
  document.getElementById('phone').value = student.phone || '';
  document.getElementById('department').value = student.department || '';
  document.getElementById('course').value = student.course || '';
  document.getElementById('age').value = student.age || '';
  document.getElementById('address').value = student.address || '';
  document.getElementById('formTitle').textContent = 'Edit Student';
}

async function deleteStudent(id) {
  if (!confirm('Delete this student?')) return;
  const response = await fetch(`${API_URL}/students/${id}`, {
    method: 'DELETE',
    headers: { 'x-user-role': 'admin' }
  });
  if (response.ok) {
    await loadStudents();
    await loadCount();
  }
}

function attachEvents() {
  document.getElementById('studentForm').addEventListener('submit', saveStudent);
  document.getElementById('cancelEdit').addEventListener('click', () => {
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = '';
    document.getElementById('formTitle').textContent = 'Add Student';
  });
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
  document.getElementById('studentTable').addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const id = button.getAttribute('data-id');
    if (button.getAttribute('data-action') === 'edit') {
      const student = state.students.find((item) => item.id === Number(id));
      if (student) populateForm(student);
    } else if (button.getAttribute('data-action') === 'delete') {
      await deleteStudent(id);
    }
  });
}

ensureAuth();
attachEvents();
loadStudents();
loadCount();
