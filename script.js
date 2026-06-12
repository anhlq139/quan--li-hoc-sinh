// Authentication Check
const activeUser = JSON.parse(localStorage.getItem('eduActiveUser'));
if (!activeUser) {
    window.location.href = 'auth.html';
}

// State Management
let students = JSON.parse(localStorage.getItem('eduManageStudents')) || [];
let gradeChartInstance = null;
let conductChartInstance = null;
let exams = JSON.parse(localStorage.getItem('eduManageExams')) || [];
let examResults = JSON.parse(localStorage.getItem('eduExamResults')) || [];

// DOM Elements
const navDashboard = document.getElementById('nav-dashboard');
const navStudents = document.getElementById('nav-students');
const dashboardView = document.getElementById('dashboard-view');
const studentsView = document.getElementById('students-view');
const examsView = document.getElementById('exams-view');
const navExams = document.getElementById('nav-exams');

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

// Exams DOM Elements
const examModal = document.getElementById('exam-modal');
const examForm = document.getElementById('exam-form');
const examTitleInput = document.getElementById('exam-title');
const examDurationInput = document.getElementById('exam-duration');
const questionsContainer = document.getElementById('questions-container');
const addQuestionBtn = document.getElementById('add-question-btn');
const openExamModalBtn = document.getElementById('open-exam-modal-btn');
const closeExamModalBtn = document.getElementById('close-exam-modal-btn');
const cancelExamBtn = document.getElementById('cancel-exam-btn');

const examsList = document.getElementById('exams-list');
const examsTable = document.getElementById('exams-table');
const noExamsMsg = document.getElementById('no-exams-msg');

const resultsList = document.getElementById('results-list');
const resultsTable = document.getElementById('results-table');
const noResultsMsg = document.getElementById('no-results-msg');

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
        examsView.classList.remove('active');
        navDashboard.parentElement.classList.add('active');
        navStudents.parentElement.classList.remove('active');
        navExams.parentElement.classList.remove('active');
        updateDashboard();
    } else if (view === 'students') {
        studentsView.classList.add('active');
        dashboardView.classList.remove('active');
        examsView.classList.remove('active');
        navStudents.parentElement.classList.add('active');
        navDashboard.parentElement.classList.remove('active');
        navExams.parentElement.classList.remove('active');
    } else {
        examsView.classList.add('active');
        dashboardView.classList.remove('active');
        studentsView.classList.remove('active');
        navExams.parentElement.classList.add('active');
        navDashboard.parentElement.classList.remove('active');
        navStudents.parentElement.classList.remove('active');
        renderExams();
        renderExamResults();
    }
}

// Event Listeners
function setupEventListeners() {
    navDashboard.addEventListener('click', (e) => { e.preventDefault(); switchView('dashboard'); });
    navStudents.addEventListener('click', (e) => { e.preventDefault(); switchView('students'); });
    navExams.addEventListener('click', (e) => { e.preventDefault(); switchView('exams'); });

    openAddModalBtn.addEventListener('click', openAddModal);
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    studentForm.addEventListener('submit', handleFormSubmit);

    searchInput.addEventListener('input', handleSearch);

    // Exam Events
    openExamModalBtn.addEventListener('click', openExamModal);
    closeExamModalBtn.addEventListener('click', closeExamModal);
    cancelExamBtn.addEventListener('click', closeExamModal);
    examModal.addEventListener('click', (e) => {
        if (e.target === examModal) closeExamModal();
    });
    addQuestionBtn.addEventListener('click', () => addQuestionField());
    examForm.addEventListener('submit', handleExamFormSubmit);

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

// Exam Management Logic
function openExamModal() {
    examForm.reset();
    questionsContainer.innerHTML = '';
    addQuestionField(); // add at least one question
    examModal.classList.add('active');
}

function closeExamModal() {
    examModal.classList.remove('active');
}

function addQuestionField(data = null) {
    const qIndex = questionsContainer.children.length + 1;
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-item';
    questionDiv.innerHTML = `
        <button type="button" class="remove-q-btn" onclick="this.parentElement.remove(); reindexQuestions();" title="Xóa câu hỏi"><i class="fa-solid fa-trash"></i></button>
        <div class="form-group" style="margin-bottom: 12px;">
            <label style="font-size: 13px; font-weight: 600;">Câu <span class="q-num">${qIndex}</span></label>
            <input type="text" class="q-text" required placeholder="Nhập nội dung câu hỏi..." value="${data ? data.text : ''}">
        </div>
        <div class="question-options-grid">
            <div class="option-input-wrapper">
                <span class="option-prefix">A</span>
                <input type="text" class="q-opt-a" required placeholder="Đáp án A" value="${data ? data.options.A : ''}">
            </div>
            <div class="option-input-wrapper">
                <span class="option-prefix">B</span>
                <input type="text" class="q-opt-b" required placeholder="Đáp án B" value="${data ? data.options.B : ''}">
            </div>
            <div class="option-input-wrapper">
                <span class="option-prefix">C</span>
                <input type="text" class="q-opt-c" required placeholder="Đáp án C" value="${data ? data.options.C : ''}">
            </div>
            <div class="option-input-wrapper">
                <span class="option-prefix">D</span>
                <input type="text" class="q-opt-d" required placeholder="Đáp án D" value="${data ? data.options.D : ''}">
            </div>
        </div>
        <div class="correct-ans-select">
            <label style="margin-bottom: 0; font-size: 13px;">Đáp án đúng:</label>
            <select class="q-correct" required>
                <option value="A" ${data && data.correct === 'A' ? 'selected' : ''}>A</option>
                <option value="B" ${data && data.correct === 'B' ? 'selected' : ''}>B</option>
                <option value="C" ${data && data.correct === 'C' ? 'selected' : ''}>C</option>
                <option value="D" ${data && data.correct === 'D' ? 'selected' : ''}>D</option>
            </select>
        </div>
    `;
    questionsContainer.appendChild(questionDiv);
}

function reindexQuestions() {
    const qNums = questionsContainer.querySelectorAll('.q-num');
    qNums.forEach((span, index) => {
        span.textContent = index + 1;
    });
}

function handleExamFormSubmit(e) {
    e.preventDefault();
    
    const title = examTitleInput.value.trim();
    const duration = parseInt(examDurationInput.value);
    
    const questionItems = questionsContainer.querySelectorAll('.question-item');
    if (questionItems.length === 0) {
        alert('Vui lòng thêm ít nhất một câu hỏi cho đề thi!');
        return;
    }
    
    const questionsList = [];
    questionItems.forEach(item => {
        const text = item.querySelector('.q-text').value.trim();
        const optionA = item.querySelector('.q-opt-a').value.trim();
        const optionB = item.querySelector('.q-opt-b').value.trim();
        const optionC = item.querySelector('.q-opt-c').value.trim();
        const optionD = item.querySelector('.q-opt-d').value.trim();
        const correct = item.querySelector('.q-correct').value;
        
        questionsList.push({
            text,
            options: { A: optionA, B: optionB, C: optionC, D: optionD },
            correct
        });
    });
    
    const newExam = {
        id: Date.now().toString(),
        title,
        duration,
        questions: questionsList,
        createdAt: new Date().toLocaleString('vi-VN')
    };
    
    exams.push(newExam);
    localStorage.setItem('eduManageExams', JSON.stringify(exams));
    
    renderExams();
    closeExamModal();
}

function deleteExam(id) {
    if (confirm('Bạn có chắc chắn muốn xóa đề thi này không?')) {
        exams = exams.filter(e => e.id !== id);
        localStorage.setItem('eduManageExams', JSON.stringify(exams));
        renderExams();
    }
}

function renderExams() {
    examsList.innerHTML = '';
    if (exams.length === 0) {
        examsTable.style.display = 'none';
        noExamsMsg.style.display = 'block';
        return;
    }
    
    examsTable.style.display = 'table';
    noExamsMsg.style.display = 'none';
    
    exams.forEach((exam, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td style="font-weight: 500;">${exam.title}</td>
            <td>${exam.duration} phút</td>
            <td>${exam.questions.length} câu</td>
            <td>
                <button class="action-btn delete-btn" onclick="deleteExam('${exam.id}')" title="Xóa"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        examsList.appendChild(tr);
    });
}

function renderExamResults() {
    examResults = JSON.parse(localStorage.getItem('eduExamResults')) || [];
    resultsList.innerHTML = '';
    if (examResults.length === 0) {
        resultsTable.style.display = 'none';
        noResultsMsg.style.display = 'block';
        return;
    }
    
    resultsTable.style.display = 'table';
    noResultsMsg.style.display = 'none';
    
    const sortedResults = [...examResults].sort((a, b) => (b.submittedAtEpoch || 0) - (a.submittedAtEpoch || 0));
    
    sortedResults.forEach((res, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td style="font-weight: 500;">${res.studentName}</td>
            <td>${res.examTitle}</td>
            <td>${res.correctCount} / ${res.totalQuestions}</td>
            <td style="font-weight: 700; color: ${res.score >= 5 ? 'var(--excellent)' : 'var(--weak)'};">${res.score.toFixed(1)}</td>
            <td style="font-size: 13px; color: var(--text-muted);">${res.submittedAt}</td>
        `;
        resultsList.appendChild(tr);
    });
}

// Expose functions to window
window.deleteExam = deleteExam;
window.reindexQuestions = reindexQuestions;

// Start
init();
