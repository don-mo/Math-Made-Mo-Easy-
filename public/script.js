// Data structure
let data = {
    employees: [],
    videoTracking: {}, // { weekKey: { employeeId: { freestyle: true, backstroke: false, ... } } }
    quizQuestions: [],
    quizResults: [], // { employeeId, date, score, answers }
    activityLog: []
};

/* Initialize default quiz questions
    Why there aren't any correct answers in the options?
    options is always the first one is correct for first guy
    second guy it's the second one */

const defaultQuestions = [
    {
        id: 1,
        question: "What is the most important aspect of freestyle breathing?",
        options: ["Breathing to the side with one goggle in the water", "Lifting head completely out of water", "Breathing every stroke", "Holding breath for entire length"],
        correct: 0,
        category: "freestyle"
    },
    {
        id: 2,
        question: "In backstroke, where should your hand enter the water?",
        options: ["At your side", "Directly above your shoulder (12 o'clock)", "Across your body", "At your hip"],
        correct: 1,
        category: "backstroke"
    },
    {
        id: 3,
        question: "What is the key timing for the breaststroke pull-breathe-kick sequence?",
        options: ["Pull, Kick, Breathe", "Pull, Breathe, Kick", "Breathe, Pull, Kick", "Kick, Pull, Breathe"],
        correct: 1,
        category: "breaststroke"
    },
    {
        id: 4,
        question: "In butterfly, when should the second kick occur?",
        options: ["During the recovery", "During the entry", "During the pull", "At the end of the pull/exit"],
        correct: 3,
        category: "butterfly"
    },
    {
        id: 5,
        question: "What is the correct body position for freestyle?",
        options: ["Head up, looking forward", "Horizontal with head in neutral position", "Hips dropped low", "Completely vertical"],
        correct: 1,
        category: "freestyle"
    },
    {
        id: 6,
        question: "How should you rotate in backstroke?",
        options: ["No rotation needed", "Rotate entire body from side to side", "Only rotate shoulders", "Only rotate hips"],
        correct: 1,
        category: "backstroke"
    },
    {
        id: 7,
        question: "What is the proper hand position during breaststroke pull?",
        options: ["Fingers together, pointing down", "Fingers spread wide", "Palms facing up", "Hands in fists"],
        correct: 0,
        category: "breaststroke"
    },
    {
        id: 8,
        question: "How many dolphin kicks are allowed at the start and turns in breaststroke?",
        options: ["None", "One", "Two", "As many as needed"],
        correct: 1,
        category: "breaststroke"
    }
];

// Load data from localStorage
function loadData() {
    const saved = localStorage.getItem('moswimmingData');
    if (saved) {
        data = JSON.parse(saved);
    } else {
        data.quizQuestions = [...defaultQuestions];
        saveData();
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('moswimmingData', JSON.stringify(data));
}

// Get current week key (ISO week)
function getCurrentWeekKey() {
    const now = new Date();
    const onejan = new Date(now.getFullYear(), 0, 1);
    const week = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    return `${now.getFullYear()}-W${week}`;
}

// Get week display text
function getWeekDisplay(weekKey) {
    const [year, weekNum] = weekKey.split('-W');
    const week = parseInt(weekNum);

    // Calculate the date of Monday of that week
    const jan1 = new Date(year, 0, 1);
    const daysOffset = (week - 1) * 7;
    const monday = new Date(jan1.setDate(jan1.getDate() + daysOffset - jan1.getDay() + 1));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const options = { month: 'short', day: 'numeric' };
    return `Week ${week}, ${year} (${monday.toLocaleDateString('en-US', options)} - ${sunday.toLocaleDateString('en-US', options)})`;
}

// Current week for tracking
let currentTrackingWeek = getCurrentWeekKey();

// Add activity log entry
function addActivity(text) {
    const activity = {
        text,
        timestamp: new Date().toISOString()
    };
    data.activityLog.unshift(activity);
    if (data.activityLog.length > 20) {
        data.activityLog.pop();
    }
    saveData();
    updateActivityLog();
}

// Update activity log display
function updateActivityLog() {
    const log = document.getElementById('activityLog');
    if (data.activityLog.length === 0) {
        log.innerHTML = '<p class="info-text">No recent activity</p>';
        return;
    }

    log.innerHTML = data.activityLog.slice(0, 10).map(activity => `
        <div class="activity-item">
            ${activity.text}
            <div class="activity-time">${new Date(activity.timestamp).toLocaleString()}</div>
        </div>
    `).join('');
}

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;

        // Update buttons
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        // Refresh content based on tab
        if (tabName === 'dashboard') updateDashboard();
        if (tabName === 'employees') renderEmployees();
        if (tabName === 'videos') renderVideoTracking();
        if (tabName === 'quiz') renderQuizSection();
        if (tabName === 'reports') renderReports();
    });
});

// Dashboard updates
function updateDashboard() {
    document.getElementById('totalEmployees').textContent = data.employees.length;

    const currentWeek = getCurrentWeekKey();
    const weekTracking = data.videoTracking[currentWeek] || {};
    let videosCompleted = 0;
    Object.values(weekTracking).forEach(emp => {
        videosCompleted += Object.values(emp).filter(v => v).length;
    });
    document.getElementById('videosCompleted').textContent = videosCompleted;

    document.getElementById('quizzesCompleted').textContent = data.quizResults.length;

    const avgScore = data.quizResults.length > 0
        ? Math.round(data.quizResults.reduce((sum, r) => sum + r.score, 0) / data.quizResults.length)
        : 0;
    document.getElementById('avgScore').textContent = avgScore + '%';

    updateActivityLog();
}

// Employee Management
const addEmployeeModal = document.getElementById('addEmployeeModal');
const addEmployeeBtn = document.getElementById('addEmployeeBtn');
const closeModal = document.querySelectorAll('.close');

addEmployeeBtn.addEventListener('click', () => {
    addEmployeeModal.style.display = 'block';
});

closeModal.forEach(close => {
    close.addEventListener('click', () => {
        close.closest('.modal').style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

document.getElementById('addEmployeeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('employeeName').value;
    const email = document.getElementById('employeeEmail').value;

    const employee = {
        id: Date.now().toString(),
        name,
        email,
        dateAdded: new Date().toISOString()
    };

    data.employees.push(employee);
    saveData();
    addActivity(`Added new employee: ${name}`);

    document.getElementById('addEmployeeForm').reset();
    addEmployeeModal.style.display = 'none';
    renderEmployees();
    updateDashboard();
});

function renderEmployees() {
    const list = document.getElementById('employeeList');

    if (data.employees.length === 0) {
        list.innerHTML = '<p class="info-text">No employees added yet. Click "Add Employee" to get started.</p>';
        return;
    }

    list.innerHTML = data.employees.map(emp => {
        const weekTracking = data.videoTracking[getCurrentWeekKey()]?.[emp.id] || {};
        const videosWatched = Object.values(weekTracking).filter(v => v).length;

        const quizzes = data.quizResults.filter(r => r.employeeId === emp.id).length;

        return `
            <div class="employee-card">
                <div class="employee-name">${emp.name}</div>
                <div class="employee-email">${emp.email}</div>
                <div class="employee-stats">
                    <div class="employee-stat">
                        <strong>${videosWatched}</strong>
                        <span>Videos This Week</span>
                    </div>
                    <div class="employee-stat">
                        <strong>${quizzes}</strong>
                        <span>Quizzes Taken</span>
                    </div>
                </div>
                <button class="btn btn-danger" style="margin-top: 15px; width: 100%;" onclick="deleteEmployee('${emp.id}')">
                    Remove Employee
                </button>
            </div>
        `;
    }).join('');
}

function deleteEmployee(id) {
    if (confirm('Are you sure you want to remove this employee?')) {
        const emp = data.employees.find(e => e.id === id);
        data.employees = data.employees.filter(e => e.id !== id);
        saveData();
        addActivity(`Removed employee: ${emp.name}`);
        renderEmployees();
        updateDashboard();
    }
}

// Video Tracking
const videos = ['freestyle', 'backstroke', 'breaststroke', 'butterfly'];

function renderVideoTracking() {
    document.getElementById('currentWeek').textContent = getWeekDisplay(currentTrackingWeek);

    videos.forEach(video => {
        const checklist = document.getElementById(`${video}-checklist`);

        if (data.employees.length === 0) {
            checklist.innerHTML = '<p class="info-text">No employees to track</p>';
            return;
        }

        if (!data.videoTracking[currentTrackingWeek]) {
            data.videoTracking[currentTrackingWeek] = {};
        }

        checklist.innerHTML = data.employees.map(emp => {
            if (!data.videoTracking[currentTrackingWeek][emp.id]) {
                data.videoTracking[currentTrackingWeek][emp.id] = {};
            }

            const checked = data.videoTracking[currentTrackingWeek][emp.id][video] || false;

            return `
                <div class="checklist-item ${checked ? 'checked' : ''}">
                    <input type="checkbox"
                           id="${video}-${emp.id}"
                           ${checked ? 'checked' : ''}
                           onchange="toggleVideo('${video}', '${emp.id}', this.checked)">
                    <label for="${video}-${emp.id}">${emp.name}</label>
                </div>
            `;
        }).join('');
    });
}

function toggleVideo(video, employeeId, checked) {
    if (!data.videoTracking[currentTrackingWeek]) {
        data.videoTracking[currentTrackingWeek] = {};
    }
    if (!data.videoTracking[currentTrackingWeek][employeeId]) {
        data.videoTracking[currentTrackingWeek][employeeId] = {};
    }

    data.videoTracking[currentTrackingWeek][employeeId][video] = checked;
    saveData();

    const emp = data.employees.find(e => e.id === employeeId);
    addActivity(`${emp.name} ${checked ? 'watched' : 'unmarked'} ${video} video (${getWeekDisplay(currentTrackingWeek)})`);

    renderVideoTracking();
    updateDashboard();
}

document.getElementById('prevWeek').addEventListener('click', () => {
    const [year, weekNum] = currentTrackingWeek.split('-W');
    let week = parseInt(weekNum) - 1;
    let newYear = parseInt(year);

    if (week < 1) {
        week = 52;
        newYear--;
    }

    currentTrackingWeek = `${newYear}-W${week}`;
    renderVideoTracking();
});

document.getElementById('nextWeek').addEventListener('click', () => {
    const [year, weekNum] = currentTrackingWeek.split('-W');
    let week = parseInt(weekNum) + 1;
    let newYear = parseInt(year);

    if (week > 52) {
        week = 1;
        newYear++;
    }

    currentTrackingWeek = `${newYear}-W${week}`;
    renderVideoTracking();
});

// Quiz System
let currentQuiz = null;
let currentQuizEmployee = null;
let currentQuestionIndex = 0;
let quizAnswers = [];

function renderQuizSection() {
    // Update employee dropdown
    const dropdown = document.getElementById('quizEmployee');
    dropdown.innerHTML = '<option value="">Choose an employee...</option>' +
        data.employees.map(emp => `<option value="${emp.id}">${emp.name}</option>`).join('');

    // Render question list
    renderQuestionList();
}

document.getElementById('startQuiz').addEventListener('click', () => {
    const employeeId = document.getElementById('quizEmployee').value;
    if (!employeeId) {
        alert('Please select an employee');
        return;
    }

    if (data.quizQuestions.length === 0) {
        alert('No quiz questions available. Please add some questions first.');
        return;
    }

    currentQuizEmployee = employeeId;
    currentQuiz = [...data.quizQuestions].sort(() => Math.random() - 0.5).slice(0, Math.min(10, data.quizQuestions.length));
    currentQuestionIndex = 0;
    quizAnswers = [];

    document.querySelector('.quiz-setup').style.display = 'none';
    document.getElementById('quizResults').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'block';

    showQuestion();
});

function showQuestion() {
    const question = currentQuiz[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / currentQuiz.length) * 100;

    document.getElementById('quizProgressFill').style.width = progress + '%';
    document.getElementById('quizQuestion').textContent = `Question ${currentQuestionIndex + 1} of ${currentQuiz.length}: ${question.question}`;

    const optionsHtml = question.options.map((option, index) => `
        <div class="quiz-option" onclick="selectOption(${index})">
            ${option}
        </div>
    `).join('');

    document.getElementById('quizOptions').innerHTML = optionsHtml;
}

function selectOption(index) {
    document.querySelectorAll('.quiz-option').forEach((opt, i) => {
        opt.classList.remove('selected');
        if (i === index) {
            opt.classList.add('selected');
        }
    });
}

document.getElementById('submitAnswer').addEventListener('click', () => {
    const selected = document.querySelector('.quiz-option.selected');
    if (!selected) {
        alert('Please select an answer');
        return;
    }

    const selectedIndex = Array.from(document.querySelectorAll('.quiz-option')).indexOf(selected);
    const question = currentQuiz[currentQuestionIndex];
    const correct = selectedIndex === question.correct;

    quizAnswers.push({
        questionId: question.id,
        selectedIndex,
        correct
    });

    // Show correct/incorrect
    document.querySelectorAll('.quiz-option').forEach((opt, i) => {
        if (i === question.correct) {
            opt.classList.add('correct');
        } else if (i === selectedIndex && !correct) {
            opt.classList.add('incorrect');
        }
    });

    setTimeout(() => {
        currentQuestionIndex++;

        if (currentQuestionIndex < currentQuiz.length) {
            showQuestion();
        } else {
            finishQuiz();
        }
    }, 1500);
});

function finishQuiz() {
    const score = Math.round((quizAnswers.filter(a => a.correct).length / quizAnswers.length) * 100);

    const result = {
        employeeId: currentQuizEmployee,
        date: new Date().toISOString(),
        score,
        answers: quizAnswers
    };

    data.quizResults.push(result);
    saveData();

    const emp = data.employees.find(e => e.id === currentQuizEmployee);
    addActivity(`${emp.name} completed quiz with score: ${score}%`);

    document.getElementById('quizContainer').style.display = 'none';
    document.getElementById('quizResults').style.display = 'block';

    document.querySelector('.result-score').textContent = score + '%';
    document.querySelector('.result-details').innerHTML = `
        <p>Correct Answers: ${quizAnswers.filter(a => a.correct).length} / ${quizAnswers.length}</p>
        <p>${score >= 80 ? '🎉 Great job!' : score >= 60 ? '👍 Good effort!' : '📚 Keep studying!'}</p>
    `;

    updateDashboard();
}

document.getElementById('retakeQuiz').addEventListener('click', () => {
    document.querySelector('.quiz-setup').style.display = 'block';
    document.getElementById('quizResults').style.display = 'none';
    document.getElementById('quizEmployee').value = '';
});

// Question Management
const addQuestionModal = document.getElementById('addQuestionModal');
const addQuestionBtn = document.getElementById('addQuestionBtn');

addQuestionBtn.addEventListener('click', () => {
    addQuestionModal.style.display = 'block';
});

document.getElementById('addQuestionForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const question = {
        id: Date.now(),
        question: document.getElementById('questionText').value,
        options: [
            document.getElementById('option1').value,
            document.getElementById('option2').value,
            document.getElementById('option3').value,
            document.getElementById('option4').value
        ],
        correct: 0, // First option is always correct
        category: document.getElementById('questionCategory').value
    };

    data.quizQuestions.push(question);
    saveData();
    addActivity(`Added new quiz question: ${question.question.substring(0, 50)}...`);

    document.getElementById('addQuestionForm').reset();
    addQuestionModal.style.display = 'none';
    renderQuestionList();
});

function renderQuestionList() {
    const list = document.getElementById('questionList');

    if (data.quizQuestions.length === 0) {
        list.innerHTML = '<p class="info-text">No questions added yet.</p>';
        return;
    }

    list.innerHTML = data.quizQuestions.map(q => `
        <div class="question-item">
            <span class="question-category">${q.category}</span>
            <div class="question-text">${q.question}</div>
            <div style="margin-top: 10px; color: #28a745;">✓ ${q.options[q.correct]}</div>
            <button class="btn btn-danger" style="margin-top: 10px;" onclick="deleteQuestion(${q.id})">Delete</button>
        </div>
    `).join('');
}

function deleteQuestion(id) {
    if (confirm('Are you sure you want to delete this question?')) {
        data.quizQuestions = data.quizQuestions.filter(q => q.id !== id);
        saveData();
        addActivity('Deleted a quiz question');
        renderQuestionList();
    }
}

// Reports
function renderReports() {
    const employeeDropdown = document.getElementById('reportEmployee');
    employeeDropdown.innerHTML = '<option value="all">All Employees</option>' +
        data.employees.map(emp => `<option value="${emp.id}">${emp.name}</option>`).join('');
}

document.getElementById('generateReport').addEventListener('click', () => {
    const employeeId = document.getElementById('reportEmployee').value;
    const period = document.getElementById('reportPeriod').value;

    const reportContent = document.getElementById('reportContent');

    let employees = employeeId === 'all' ? data.employees : [data.employees.find(e => e.id === employeeId)];

    const tableRows = employees.map(emp => {
        const quizzes = data.quizResults.filter(r => r.employeeId === emp.id);
        const avgScore = quizzes.length > 0
            ? Math.round(quizzes.reduce((sum, r) => sum + r.score, 0) / quizzes.length)
            : 0;

        // Count videos for current week
        const currentWeek = getCurrentWeekKey();
        const weekTracking = data.videoTracking[currentWeek]?.[emp.id] || {};
        const videosWatched = Object.values(weekTracking).filter(v => v).length;

        return `
            <tr>
                <td>${emp.name}</td>
                <td>${videosWatched}/4</td>
                <td>${quizzes.length}</td>
                <td>${avgScore}%</td>
                <td>${quizzes.length > 0 ? new Date(quizzes[quizzes.length - 1].date).toLocaleDateString() : 'N/A'}</td>
            </tr>
        `;
    }).join('');

    reportContent.innerHTML = `
        <table class="report-table">
            <thead>
                <tr>
                    <th>Employee</th>
                    <th>Videos This Week</th>
                    <th>Total Quizzes</th>
                    <th>Avg Quiz Score</th>
                    <th>Last Quiz Date</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
    `;
});

// Initialize app
loadData();
updateDashboard();
renderEmployees();
renderVideoTracking();
renderQuizSection();
renderReports();
