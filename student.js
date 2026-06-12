// Student Portal State Management
let studentName = localStorage.getItem('eduStudentName') || '';
let exams = JSON.parse(localStorage.getItem('eduManageExams')) || [];
let examResults = JSON.parse(localStorage.getItem('eduExamResults')) || [];

// Current Exam Session
let currentExam = null;
let examTimerInterval = null;
let examAnswers = {}; // { questionIndex: 'A'|'B'|'C'|'D' }

// DOM Elements
const loginScreen = document.getElementById('student-login-screen');
const dashboard = document.getElementById('student-dashboard');
const loginForm = document.getElementById('student-login-form');
const nameInput = document.getElementById('student-name');
const studentDisplayName = document.getElementById('student-display-name');
const logoutBtn = document.getElementById('student-logout-btn');

const portalView = document.getElementById('portal-view');
const examTakingView = document.getElementById('exam-taking-view');
const examResultView = document.getElementById('exam-result-view');
const examsGrid = document.getElementById('student-exams-grid');
const noExamsMsg = document.getElementById('no-student-exams');

const confirmModal = document.getElementById('confirm-exam-modal');
const confirmExamTitle = document.getElementById('confirm-exam-title');
const confirmExamDuration = document.getElementById('confirm-exam-duration');
const btnConfirmYes = document.getElementById('btn-confirm-yes');
const btnConfirmNo = document.getElementById('btn-confirm-no');

const takingExamTitle = document.getElementById('taking-exam-title');
const takingExamQcount = document.getElementById('taking-exam-qcount');
const examTimer = document.getElementById('exam-timer');
const examProgressBar = document.getElementById('exam-progress-bar');
const progressPercentage = document.getElementById('progress-percentage');
const examQuestionsList = document.getElementById('exam-questions-list');
const qNavGrid = document.getElementById('q-nav-grid');
const btnSubmitExam = document.getElementById('btn-submit-exam');

// Result elements
const resultExamTitle = document.getElementById('result-exam-title');
const resultScore = document.getElementById('result-score');
const resultCorrectCount = document.getElementById('result-correct-count');
const resultWrongCount = document.getElementById('result-wrong-count');
const resultTotalQ = document.getElementById('result-total-q');
const btnBackToPortal = document.getElementById('btn-back-to-portal');

// Initialize portal
function init() {
    setupEventListeners();
    checkAuth();
}

function checkAuth() {
    if (studentName) {
        studentDisplayName.textContent = studentName;
        loginScreen.classList.remove('active');
        dashboard.classList.remove('hidden');
        switchView('portal');
        loadExams();
    } else {
        loginScreen.classList.add('active');
        dashboard.classList.add('hidden');
    }
}

function setupEventListeners() {
    // Identity registration
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const enteredName = nameInput.value.trim();
        if (enteredName) {
            studentName = enteredName;
            localStorage.setItem('eduStudentName', studentName);
            checkAuth();
        }
    });

    // Exit room
    logoutBtn.addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn thoát phòng thi và đăng xuất?')) {
            localStorage.removeItem('eduStudentName');
            studentName = '';
            checkAuth();
        }
    });

    // Confirm Modal actions
    btnConfirmNo.addEventListener('click', () => {
        confirmModal.classList.remove('active');
        currentExam = null;
    });

    btnConfirmYes.addEventListener('click', () => {
        confirmModal.classList.remove('active');
        startExam();
    });

    // Submit exam
    btnSubmitExam.addEventListener('click', () => {
        const totalQ = currentExam.questions.length;
        const answeredQ = Object.keys(examAnswers).length;
        
        let confirmMsg = 'Bạn có chắc chắn muốn nộp bài thi không?';
        if (answeredQ < totalQ) {
            confirmMsg = `Bạn chưa làm hết câu hỏi (${answeredQ}/${totalQ} câu). Bạn có chắc chắn muốn nộp bài thi?`;
        }
        
        if (confirm(confirmMsg)) {
            submitExam(false);
        }
    });

    // Go back to list of exams after result page
    btnBackToPortal.addEventListener('click', () => {
        switchView('portal');
        loadExams();
    });
}

function switchView(view) {
    portalView.classList.remove('active');
    examTakingView.classList.remove('active');
    examResultView.classList.remove('active');

    if (view === 'portal') {
        portalView.classList.add('active');
    } else if (view === 'taking') {
        examTakingView.classList.add('active');
    } else if (view === 'result') {
        examResultView.classList.add('active');
    }
}

// Load and Render Exams
function loadExams() {
    // Reload state
    exams = JSON.parse(localStorage.getItem('eduManageExams')) || [];
    examResults = JSON.parse(localStorage.getItem('eduExamResults')) || [];

    examsGrid.innerHTML = '';
    if (exams.length === 0) {
        noExamsMsg.classList.remove('hidden');
        return;
    }
    noExamsMsg.classList.add('hidden');

    exams.forEach(exam => {
        // Check if student has already done this exam
        const doneRecord = examResults.find(r => r.studentName === studentName && r.examId === exam.id);

        const card = document.createElement('div');
        card.className = `student-exam-card ${doneRecord ? 'completed' : ''}`;
        
        let badgeHtml = `<span class="exam-badge"><i class="fa-solid fa-hourglass-start"></i> Chưa làm</span>`;
        let actionBtnHtml = `<button class="btn-primary" onclick="confirmStartExam('${exam.id}')" style="margin-top: auto; justify-content: center; width: 100%;">Bắt đầu làm bài</button>`;

        if (doneRecord) {
            badgeHtml = `<span class="exam-badge completed"><i class="fa-solid fa-circle-check"></i> Đã hoàn thành</span>`;
            actionBtnHtml = `
                <div style="margin-top: auto;">
                    <div style="font-weight: 700; color: var(--excellent); margin-bottom: 10px; font-size: 15px; text-align: center;">Điểm của bạn: ${doneRecord.score.toFixed(1)} / 10</div>
                    <button class="btn-secondary" onclick="viewCompletedResult('${exam.id}')" style="justify-content: center; width: 100%;">Xem lại kết quả</button>
                </div>
            `;
        }

        card.innerHTML = `
            <div>
                <h3>${exam.title}</h3>
                <div class="exam-meta">
                    <div class="exam-meta-item">
                        <i class="fa-solid fa-list-check"></i>
                        <span>Số lượng: ${exam.questions.length} câu hỏi</span>
                    </div>
                    <div class="exam-meta-item">
                        <i class="fa-solid fa-clock"></i>
                        <span>Thời gian: ${exam.duration} phút</span>
                    </div>
                </div>
            </div>
            ${badgeHtml}
            <div style="height: 15px;"></div>
            ${actionBtnHtml}
        `;
        examsGrid.appendChild(card);
    });
}

// Confirm Modal Setup
window.confirmStartExam = function(examId) {
    const exam = exams.find(e => e.id === examId);
    if (!exam) return;

    currentExam = exam;
    confirmExamTitle.textContent = exam.title;
    confirmExamDuration.textContent = exam.duration;
    confirmModal.classList.add('active');
};

// Start Exam Execution
function startExam() {
    if (!currentExam) return;

    examAnswers = {};
    switchView('taking');

    takingExamTitle.textContent = currentExam.title;
    takingExamQcount.innerHTML = `<i class="fa-solid fa-list-check"></i> ${currentExam.questions.length} câu hỏi`;

    // Render questions list
    examQuestionsList.innerHTML = '';
    qNavGrid.innerHTML = '';

    currentExam.questions.forEach((q, index) => {
        // Question Card
        const qCard = document.createElement('div');
        qCard.className = 'question-card-take';
        qCard.id = `question-take-${index}`;
        qCard.innerHTML = `
            <h4>Câu ${index + 1}: ${q.text}</h4>
            <div class="options-list-take">
                <label class="option-label-take" id="lbl-opt-${index}-A">
                    <input type="radio" name="question-${index}" value="A" onchange="selectAnswer(${index}, 'A')">
                    <span class="option-prefix-take">A</span>
                    <span>${q.options.A}</span>
                </label>
                <label class="option-label-take" id="lbl-opt-${index}-B">
                    <input type="radio" name="question-${index}" value="B" onchange="selectAnswer(${index}, 'B')">
                    <span class="option-prefix-take">B</span>
                    <span>${q.options.B}</span>
                </label>
                <label class="option-label-take" id="lbl-opt-${index}-C">
                    <input type="radio" name="question-${index}" value="C" onchange="selectAnswer(${index}, 'C')">
                    <span class="option-prefix-take">C</span>
                    <span>${q.options.C}</span>
                </label>
                <label class="option-label-take" id="lbl-opt-${index}-D">
                    <input type="radio" name="question-${index}" value="D" onchange="selectAnswer(${index}, 'D')">
                    <span class="option-prefix-take">D</span>
                    <span>${q.options.D}</span>
                </label>
            </div>
        `;
        examQuestionsList.appendChild(qCard);

        // Sidebar navigation dots
        const qNavBtn = document.createElement('button');
        qNavBtn.className = 'q-nav-btn';
        qNavBtn.id = `q-nav-btn-${index}`;
        qNavBtn.textContent = index + 1;
        qNavBtn.addEventListener('click', () => {
            qCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Highlight active nav
            document.querySelectorAll('.q-nav-btn').forEach(btn => btn.classList.remove('active'));
            qNavBtn.classList.add('active');
        });
        qNavGrid.appendChild(qNavBtn);
    });

    // Update Progress
    updateProgress();

    // Start Timer countdown
    startTimer(currentExam.duration * 60);
}

// Select Answer logic
window.selectAnswer = function(qIndex, choice) {
    examAnswers[qIndex] = choice;

    // Highlight option locally
    const options = ['A', 'B', 'C', 'D'];
    options.forEach(opt => {
        const label = document.getElementById(`lbl-opt-${qIndex}-${opt}`);
        if (opt === choice) {
            label.classList.add('selected');
        } else {
            label.classList.remove('selected');
        }
    });

    // Mark sidebar dot
    const qNavBtn = document.getElementById(`q-nav-btn-${qIndex}`);
    if (qNavBtn) {
        qNavBtn.classList.add('answered');
    }

    // Update progress
    updateProgress();
};

function updateProgress() {
    const totalQuestions = currentExam.questions.length;
    const answeredCount = Object.keys(examAnswers).length;
    const percentage = Math.round((answeredCount / totalQuestions) * 100);

    examProgressBar.style.width = `${percentage}%`;
    progressPercentage.textContent = `${percentage}%`;
}

// Countdown timer functions
function startTimer(durationSeconds) {
    if (examTimerInterval) clearInterval(examTimerInterval);

    let timeRemaining = durationSeconds;
    updateTimerDisplay(timeRemaining);

    examTimerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay(timeRemaining);

        // Warn if less than 1 minute remaining
        const timerContainer = document.querySelector('.timer-container');
        if (timeRemaining <= 60) {
            timerContainer.style.background = 'rgba(239, 68, 68, 0.2)';
            timerContainer.style.borderColor = 'rgba(239, 68, 68, 0.5)';
        } else {
            timerContainer.style.background = 'rgba(239, 68, 68, 0.1)';
            timerContainer.style.borderColor = 'rgba(239, 68, 68, 0.2)';
        }

        if (timeRemaining <= 0) {
            clearInterval(examTimerInterval);
            alert('Đã hết thời gian làm bài! Hệ thống sẽ tự động nộp bài.');
            submitExam(true); // Auto submit
        }
    }, 1000);
}

function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = secs < 10 ? '0' + secs : secs;
    
    examTimer.textContent = `${formattedMinutes}:${formattedSeconds}`;
}

// Submit Exam Assessment
function submitExam(isAutoSubmit) {
    if (examTimerInterval) clearInterval(examTimerInterval);

    const totalQuestions = currentExam.questions.length;
    let correctCount = 0;

    currentExam.questions.forEach((q, index) => {
        const studentAns = examAnswers[index];
        if (studentAns && studentAns === q.correct) {
            correctCount++;
        }
    });

    const score = (correctCount / totalQuestions) * 10;

    // Save exam results
    const resultRecord = {
        id: Date.now().toString(),
        studentName: studentName,
        examId: currentExam.id,
        examTitle: currentExam.title,
        correctCount: correctCount,
        totalQuestions: totalQuestions,
        score: score,
        submittedAt: new Date().toLocaleString('vi-VN'),
        submittedAtEpoch: Date.now()
    };

    // Load, add and save
    examResults = JSON.parse(localStorage.getItem('eduExamResults')) || [];
    examResults.push(resultRecord);
    localStorage.setItem('eduExamResults', JSON.stringify(examResults));

    // Show Results
    displayResults(resultRecord);
}

function displayResults(record) {
    switchView('result');
    resultExamTitle.textContent = record.examTitle;
    resultScore.textContent = record.score.toFixed(1);
    resultCorrectCount.textContent = record.correctCount;
    resultWrongCount.textContent = record.totalQuestions - record.correctCount;
    resultTotalQ.textContent = record.totalQuestions;

    // Adjust score circle border color based on score grade
    const scoreCircle = document.querySelector('.score-circle');
    const scoreNum = document.getElementById('result-score');
    if (record.score >= 8.0) {
        scoreCircle.style.borderColor = 'var(--excellent)';
        scoreNum.style.color = 'var(--excellent)';
    } else if (record.score >= 5.0) {
        scoreCircle.style.borderColor = 'var(--good)';
        scoreNum.style.color = 'var(--good)';
    } else {
        scoreCircle.style.borderColor = 'var(--weak)';
        scoreNum.style.color = 'var(--weak)';
    }
}

// View completed score directly (already taken)
window.viewCompletedResult = function(examId) {
    const doneRecord = examResults.find(r => r.studentName === studentName && r.examId === examId);
    if (doneRecord) {
        displayResults(doneRecord);
    }
};

// Start
init();
