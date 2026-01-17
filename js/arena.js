/* ═══════════════════════════════════════════════════════════════════════════
   SYNAPSE - Arena Mode Logic
   ═══════════════════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────────────────────
// ARENA STATE
// ─────────────────────────────────────────────────────────────────────────────

const arenaState = {
    active: false,
    topic: null,
    questions: [],
    currentIndex: 0,
    selectedAnswer: null,
    answered: false,
    correct: 0,
    wrong: 0,
    timeRemaining: 90,
    totalTime: 0,
    wagerMode: false,
    hintUsed: false,
    timerInterval: null,
    startTime: null
};

// ─────────────────────────────────────────────────────────────────────────────
// ARENA INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────────

function startArena(topic) {
    arenaState.topic = topic;
    arenaState.questions = getRandomQuestions(topic, 5);
    arenaState.currentIndex = 0;
    arenaState.selectedAnswer = null;
    arenaState.answered = false;
    arenaState.correct = 0;
    arenaState.wrong = 0;
    arenaState.totalTime = 0;
    arenaState.hintUsed = false;
    arenaState.wagerMode = document.getElementById('wager-mode')?.checked || false;
    arenaState.startTime = Date.now();
    arenaState.active = true;

    // Deduct wager if enabled
    if (arenaState.wagerMode) {
        if (!window.SYNAPSE.spendBrainCells(25)) {
            alert('Not enough BrainCells for wager mode!');
            arenaState.wagerMode = false;
        }
    }

    // Update UI
    const topicNames = {
        math: 'Math: Mixed',
        reading: 'Reading Comprehension',
        writing: 'Writing & Grammar'
    };
    document.getElementById('topic-name').textContent = topicNames[topic] || topic;
    document.getElementById('total-q').textContent = arenaState.questions.length;

    // Hide topic selection, show question container
    document.getElementById('topic-select').classList.add('hidden');
    document.getElementById('question-container').classList.remove('hidden');
    document.getElementById('results-container').classList.add('hidden');

    // Load first question
    loadQuestion(0);

    // Start timer
    startTimer();
}

// ─────────────────────────────────────────────────────────────────────────────
// QUESTION LOADING
// ─────────────────────────────────────────────────────────────────────────────

function loadQuestion(index) {
    const question = arenaState.questions[index];
    if (!question) {
        endArena();
        return;
    }

    arenaState.currentIndex = index;
    arenaState.selectedAnswer = null;
    arenaState.answered = false;
    arenaState.hintUsed = false;

    // Update progress
    document.getElementById('current-q').textContent = index + 1;
    document.getElementById('question-number').textContent =
        `Question ${index + 1} of ${arenaState.questions.length}`;

    // Handle passage for reading questions
    const passageContainer = document.getElementById('passage-container');
    if (question.passage) {
        passageContainer.classList.remove('hidden');
        document.getElementById('passage-text').textContent = question.passage;
    } else {
        passageContainer.classList.add('hidden');
    }

    // Set question text
    document.getElementById('question-text').textContent = question.question;

    // Populate answers
    const answersList = document.getElementById('answers-list');
    answersList.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D'];
    question.options.forEach((option, i) => {
        const answerBtn = document.createElement('button');
        answerBtn.className = 'answer-option';
        answerBtn.dataset.index = i;
        answerBtn.innerHTML = `
      <span class="answer-letter">${letters[i]}</span>
      <span class="answer-text">${option}</span>
    `;
        answerBtn.addEventListener('click', () => selectAnswer(i));
        answersList.appendChild(answerBtn);
    });

    // Reset feedback
    document.getElementById('feedback-panel').classList.add('hidden');

    // Show/hide buttons
    document.getElementById('hint-btn').classList.remove('hidden');
    document.getElementById('submit-btn').classList.add('hidden');
    document.getElementById('next-btn').classList.add('hidden');

    // Reset timer for this question
    arenaState.timeRemaining = 90;
    updateTimerDisplay();
}

// ─────────────────────────────────────────────────────────────────────────────
// ANSWER SELECTION
// ─────────────────────────────────────────────────────────────────────────────

function selectAnswer(index) {
    if (arenaState.answered) return;

    arenaState.selectedAnswer = index;

    // Update visual selection
    document.querySelectorAll('.answer-option').forEach((opt, i) => {
        opt.classList.toggle('selected', i === index);
    });

    // Show submit button
    document.getElementById('submit-btn').classList.remove('hidden');
}

function submitAnswer() {
    if (arenaState.selectedAnswer === null || arenaState.answered) return;

    arenaState.answered = true;
    const question = arenaState.questions[arenaState.currentIndex];
    const isCorrect = arenaState.selectedAnswer === question.correct;

    // Update stats
    if (isCorrect) {
        arenaState.correct++;
    } else {
        arenaState.wrong++;
    }

    // Show correct/incorrect states
    document.querySelectorAll('.answer-option').forEach((opt, i) => {
        if (i === question.correct) {
            opt.classList.add('correct');
        } else if (i === arenaState.selectedAnswer && !isCorrect) {
            opt.classList.add('incorrect');
        }
        opt.style.pointerEvents = 'none';
    });

    // Show feedback
    const feedbackPanel = document.getElementById('feedback-panel');
    const feedbackIcon = document.getElementById('feedback-icon');
    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackExplanation = document.getElementById('feedback-explanation');

    feedbackPanel.classList.remove('hidden');

    if (isCorrect) {
        feedbackIcon.textContent = '✓';
        feedbackTitle.textContent = 'Correct!';
        feedbackTitle.className = 'feedback-title correct';
    } else {
        feedbackIcon.textContent = '✗';
        feedbackTitle.textContent = 'Not quite right';
        feedbackTitle.className = 'feedback-title incorrect';
    }

    // ANTIGRAVITY-style feedback
    feedbackExplanation.innerHTML = generateFeedback(question, isCorrect);

    // Hide submit, show next
    document.getElementById('submit-btn').classList.add('hidden');
    document.getElementById('hint-btn').classList.add('hidden');
    document.getElementById('next-btn').classList.remove('hidden');
}

function generateFeedback(question, isCorrect) {
    let feedback = '';

    if (isCorrect) {
        const praises = [
            'Excellent work. Your reasoning was sound.',
            'Well done. You demonstrated clear understanding.',
            'Precisely correct. This shows solid mastery.',
            'Perfect. Your approach was methodical and accurate.'
        ];
        feedback += `<p class="text-success mb-2">${praises[Math.floor(Math.random() * praises.length)]}</p>`;
    } else {
        feedback += `<p class="text-danger mb-2">Let's understand why this matters.</p>`;
    }

    feedback += `<p>${question.explanation}</p>`;

    if (!isCorrect) {
        feedback += `<p class="mt-2 text-muted text-sm">💡 This concept will appear in your upcoming dungeon for targeted practice.</p>`;
    }

    return feedback;
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────────────────────────────────────

function nextQuestion() {
    if (arenaState.currentIndex < arenaState.questions.length - 1) {
        loadQuestion(arenaState.currentIndex + 1);
    } else {
        endArena();
    }
}

function restartArena() {
    // Reset and show topic selection
    document.getElementById('topic-select').classList.remove('hidden');
    document.getElementById('question-container').classList.add('hidden');
    document.getElementById('results-container').classList.add('hidden');

    arenaState.active = false;
    if (arenaState.timerInterval) {
        clearInterval(arenaState.timerInterval);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// TIMER
// ─────────────────────────────────────────────────────────────────────────────

function startTimer() {
    if (arenaState.timerInterval) {
        clearInterval(arenaState.timerInterval);
    }

    arenaState.timerInterval = setInterval(() => {
        if (!arenaState.answered) {
            arenaState.timeRemaining--;
            arenaState.totalTime++;
            updateTimerDisplay();

            if (arenaState.timeRemaining <= 0) {
                // Auto-submit with no answer
                if (arenaState.selectedAnswer === null) {
                    arenaState.selectedAnswer = -1; // Wrong by default
                }
                submitAnswer();
            }
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timer = document.getElementById('timer');
    const minutes = Math.floor(arenaState.timeRemaining / 60);
    const seconds = arenaState.timeRemaining % 60;

    timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Update timer styling based on remaining time
    timer.classList.remove('warning', 'danger');
    if (arenaState.timeRemaining <= 10) {
        timer.classList.add('danger');
    } else if (arenaState.timeRemaining <= 30) {
        timer.classList.add('warning');
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// HINTS
// ─────────────────────────────────────────────────────────────────────────────

function useHint() {
    if (arenaState.hintUsed || arenaState.answered) return;

    // Check if user has enough BrainCells
    if (!window.SYNAPSE.spendBrainCells(10)) {
        alert('Not enough BrainCells for a hint!');
        return;
    }

    arenaState.hintUsed = true;

    const question = arenaState.questions[arenaState.currentIndex];

    // Eliminate two wrong answers
    const wrongAnswers = [];
    question.options.forEach((_, i) => {
        if (i !== question.correct) {
            wrongAnswers.push(i);
        }
    });

    // Shuffle and pick 2 to eliminate
    wrongAnswers.sort(() => Math.random() - 0.5);
    const toEliminate = wrongAnswers.slice(0, 2);

    // Visually eliminate
    document.querySelectorAll('.answer-option').forEach((opt, i) => {
        if (toEliminate.includes(i)) {
            opt.style.opacity = '0.3';
            opt.style.pointerEvents = 'none';
        }
    });

    // Disable hint button
    document.getElementById('hint-btn').disabled = true;
    document.getElementById('hint-btn').textContent = '💡 Hint Used';
}

// ─────────────────────────────────────────────────────────────────────────────
// END ARENA
// ─────────────────────────────────────────────────────────────────────────────

function endArena() {
    if (arenaState.timerInterval) {
        clearInterval(arenaState.timerInterval);
    }

    arenaState.active = false;

    // Calculate results
    const total = arenaState.questions.length;
    const correct = arenaState.correct;
    const accuracy = Math.round((correct / total) * 100);

    // Calculate time
    const totalSeconds = arenaState.totalTime;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Calculate rewards
    let xpReward = correct * 15;
    let brainCellReward = correct * 10;

    // Bonus for accuracy
    if (accuracy >= 80) {
        xpReward += 25;
        brainCellReward += 15;
    }
    if (accuracy === 100) {
        xpReward += 50;
        brainCellReward += 25;
    }

    // Wager mode multiplier
    if (arenaState.wagerMode) {
        xpReward *= 2;
        brainCellReward *= 2;
    }

    // Update results UI
    document.getElementById('stat-correct').textContent = `${correct}/${total}`;
    document.getElementById('stat-accuracy').textContent = `${accuracy}%`;
    document.getElementById('stat-time').textContent = timeStr;
    document.getElementById('reward-xp').textContent = xpReward;
    document.getElementById('reward-braincells').textContent = brainCellReward;

    // Set icon based on performance
    const resultsIcon = document.getElementById('results-icon');
    const resultsTitle = document.getElementById('results-title');

    if (accuracy === 100) {
        resultsIcon.textContent = '🏆';
        resultsTitle.textContent = 'Perfect Score!';
    } else if (accuracy >= 80) {
        resultsIcon.textContent = '⭐';
        resultsTitle.textContent = 'Excellent Work!';
    } else if (accuracy >= 60) {
        resultsIcon.textContent = '👍';
        resultsTitle.textContent = 'Good Effort!';
    } else {
        resultsIcon.textContent = '📚';
        resultsTitle.textContent = 'Keep Practicing!';
    }

    // Award rewards
    window.SYNAPSE.addXP(xpReward);
    window.SYNAPSE.addBrainCells(brainCellReward);

    // Update Oracle
    window.SYNAPSE.updateOracle(correct, total);

    // Show results
    document.getElementById('question-container').classList.add('hidden');
    document.getElementById('results-container').classList.remove('hidden');
}

// ─────────────────────────────────────────────────────────────────────────────
// INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    // Check URL params for mode
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');

    if (mode === 'dungeon') {
        document.querySelector('.topic-selection h1').textContent = '🧱 Dungeon Challenge';
        document.querySelector('.topic-selection p').textContent =
            'Face questions based on your error history';
    } else if (mode === 'boss') {
        document.querySelector('.topic-selection h1').textContent = '👑 Boss Fight';
        document.querySelector('.topic-selection p').textContent =
            'Weekly challenge — Your target score is the boss HP';
    }

    console.log('🏟️ Arena initialized');
});

// Cleanup on page leave
window.addEventListener('beforeunload', () => {
    if (arenaState.timerInterval) {
        clearInterval(arenaState.timerInterval);
    }
});
