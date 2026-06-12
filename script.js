// Authentication Check
const activeUser = JSON.parse(localStorage.getItem('eduActiveUser'));
if (!activeUser) {
    window.location.href = 'auth.html';
}

// State Management
let students = JSON.parse(localStorage.getItem('eduManageStudents')) || [];
let gradeChartInstance = null;
let conductChartInstance = null;

// DOM Elements
const navDashboard = document.getElementById('nav-dashboard');
const navStudents = document.getElementById('nav-students');
const dashboardView = document.getElementById('dashboard-view');
const studentsView = document.getElementById('students-view');

const studentsTable = document.getElementById('students-table');
const studentsList = document.getElementById('students-list');
const noDataMsg = document.getElementById('no-data-msg');
const searchInput = document.getElementById('searchInput');

const modal = document.getElementById('student-modal');
const modalTitle = document.getElementById('modal-title');
const studentForm = document.getElementById('student-form');
const openAddModalBtn = document.getElementById('open-add-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cancelBtn = document.getElementById('cancel-btn');

// Input fields
const idInput = document.getElementById('student-id');
const nameInput = document.getElementById('name');
const mathInput = document.getElementById('math');
const literatureInput = document.getElementById('literature');
const englishInput = document.getElementById('english');
const conductInput = document.getElementById('conduct');

// Initialize App
function init() {
    if (activeUser) {
        document.getElementById('display-username').textContent = activeUser.name;
    }
    renderStudents(students);
    updateDashboard();
    setupEventListeners();
}

// Navigation Logic
function switchView(view) {
    if (view === 'dashboard') {
        dashboardView.classList.add('active');
        studentsView.classList.remove('active');
        navDashboard.parentElement.classList.add('active');
        navStudents.parentElement.classList.remove('active');
        updateDashboard();
    } else {
        studentsView.classList.add('active');
        dashboardView.classList.remove('active');
        navStudents.parentElement.classList.add('active');
        navDashboard.parentElement.classList.remove('active');
    }
}

// Event Listeners
function setupEventListeners() {
    navDashboard.addEventListener('click', (e) => { e.preventDefault(); switchView('dashboard'); });
    navStudents.addEventListener('click', (e) => { e.preventDefault(); switchView('students'); });

    openAddModalBtn.addEventListener('click', openAddModal);
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    studentForm.addEventListener('submit', handleFormSubmit);

    searchInput.addEventListener('input', handleSearch);

    // Logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('eduActiveUser');
        window.location.href = 'auth.html';
    });
}

// Logic Functions
function calculateAverage(math, lit, eng) {
    return ((parseFloat(math) + parseFloat(lit) + parseFloat(eng)) / 3).toFixed(2);
}

function classifyGrade(average) {
    if (average >= 8.0) return 'Giỏi';
    if (average >= 6.5) return 'Khá';
    if (average >= 5.0) return 'Trung Bình';
    return 'Yếu';
}

function getGradeClass(grade) {
    switch (grade) {
        case 'Giỏi': return 'excellent';
        case 'Khá': return 'good';
        case 'Trung Bình': return 'average';
        case 'Yếu': return 'weak';
        default: return '';
    }
}

// CRUD Operations
function handleFormSubmit(e) {
    e.preventDefault();

    const id = idInput.value;
    const name = nameInput.value.trim();
    const math = parseFloat(mathInput.value);
    const literature = parseFloat(literatureInput.value);
    const english = parseFloat(englishInput.value);
    const conduct = conductInput.value;

    const average = calculateAverage(math, literature, english);
    const grade = classifyGrade(average);

    const studentData = {
        id: id ? id : Date.now().toString(),
        name,
        math,
        literature,
        english,
        average: parseFloat(average),
        grade,
        conduct
    };

    if (id) {
        // Update existing
        const index = students.findIndex(s => s.id === id);
        if (index !== -1) {
            students[index] = studentData;
        }
    } else {
        // Add new
        students.push(studentData);
    }

    saveData();
    renderStudents(students);
    updateDashboard();
    closeModal();
}

function editStudent(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;

    modalTitle.textContent = 'Sửa Thông Tin Học Sinh';
    idInput.value = student.id;
    nameInput.value = student.name;
    mathInput.value = student.math;
    literatureInput.value = student.literature;
    englishInput.value = student.english;
    conductInput.value = student.conduct;

    openModal();
}

function deleteStudent(id) {
    if (confirm('Bạn có chắc chắn muốn xóa học sinh này không?')) {
        students = students.filter(s => s.id !== id);
        saveData();
        renderStudents(students);
        updateDashboard();
    }
}

function saveData() {
    localStorage.setItem('eduManageStudents', JSON.stringify(students));
}

// Render Functions
function renderStudents(dataList) {
    studentsList.innerHTML = '';
    
    if (dataList.length === 0) {
        studentsTable.style.display = 'none';
        noDataMsg.classList.remove('hidden');
        return;
    }

    studentsTable.style.display = 'table';
    noDataMsg.classList.add('hidden');

    dataList.forEach((student, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td style="font-weight: 500;">${student.name}</td>
            <td>${student.math}</td>
            <td>${student.literature}</td>
            <td>${student.english}</td>
            <td style="font-weight: 700;">${student.average}</td>
            <td><span class="badge ${getGradeClass(student.grade)}">${student.grade}</span></td>
            <td>${student.conduct}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editStudent('${student.id}')" title="Sửa"><i class="fa-solid fa-pen"></i></button>
                <button class="action-btn delete-btn" onclick="deleteStudent('${student.id}')" title="Xóa"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        studentsList.appendChild(tr);
    });
}

// Modal Functions
function openAddModal() {
    modalTitle.textContent = 'Thêm Học Sinh Mới';
    studentForm.reset();
    idInput.value = '';
    openModal();
}

function openModal() {
    modal.classList.add('active');
    setTimeout(() => nameInput.focus(), 100);
}

function closeModal() {
    modal.classList.remove('active');
}

// Search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = students.filter(s => s.name.toLowerCase().includes(searchTerm));
    
    // Automatically switch to students view if searching from dashboard
    if (dashboardView.classList.contains('active') && searchTerm.length > 0) {
        switchView('students');
    }
    
    renderStudents(filtered);
}

// Dashboard & Charts
function updateDashboard() {
    const total = students.length;
    let excellent = 0, good = 0, average = 0, weak = 0;
    let conductCounts = { 'Tốt': 0, 'Khá': 0, 'Trung Bình': 0, 'Yếu': 0 };

    students.forEach(s => {
        if (s.grade === 'Giỏi') excellent++;
        else if (s.grade === 'Khá') good++;
        else if (s.grade === 'Trung Bình') average++;
        else weak++;

        if(conductCounts[s.conduct] !== undefined) {
             conductCounts[s.conduct]++;
        }
    });

    document.getElementById('total-students').textContent = total;
    document.getElementById('total-excellent').textContent = excellent;
    document.getElementById('total-good').textContent = good;
    document.getElementById('total-weak').textContent = weak;

    renderCharts([excellent, good, average, weak], [conductCounts['Tốt'], conductCounts['Khá'], conductCounts['Trung Bình'], conductCounts['Yếu']]);
}

function renderCharts(gradeData, conductData) {
    // Destroy previous instances to prevent overlap
    if (gradeChartInstance) gradeChartInstance.destroy();
    if (conductChartInstance) conductChartInstance.destroy();

    const ctxGrade = document.getElementById('gradeChart').getContext('2d');
    const ctxConduct = document.getElementById('conductChart').getContext('2d');

    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = '#8d99ae';

    // Grade Chart (Doughnut)
    gradeChartInstance = new Chart(ctxGrade, {
        type: 'doughnut',
        data: {
            labels: ['Giỏi', 'Khá', 'Trung Bình', 'Yếu'],
            datasets: [{
                data: gradeData,
                backgroundColor: [
                    '#10b981', // excellent
                    '#3b82f6', // good
                    '#f59e0b', // average
                    '#ef4444'  // weak
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { padding: 20, usePointStyle: true }
                }
            },
            cutout: '70%'
        }
    });

    // Conduct Chart (Bar)
    conductChartInstance = new Chart(ctxConduct, {
        type: 'bar',
        data: {
            labels: ['Tốt', 'Khá', 'Trung Bình', 'Yếu'],
            datasets: [{
                label: 'Số lượng',
                data: conductData,
                backgroundColor: '#4361ee',
                borderRadius: 6,
                barPercentage: 0.5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

// Start
init();
