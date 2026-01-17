/* ═══════════════════════════════════════════════════════════════════════════
   SYNAPSE - Sensei Mode Logic
   "If you can't explain it simply, you don't understand it well enough."
   ═══════════════════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────────────────────
// SENSEI TOPICS & DIALOGUES
// ─────────────────────────────────────────────────────────────────────────────

const SENSEI_TOPICS = {
    quadratic: {
        title: 'Quadratic Equations',
        icon: '📐',
        opening: "I've heard about quadratic equations but I don't really get them. What exactly is a quadratic equation?",
        followUps: [
            {
                trigger: ['ax^2', 'x squared', 'second degree', 'power of 2', 'squared'],
                satisfied: true,
                response: "Okay, so it has an x² term. But why does that matter? What makes it different from a regular equation like 2x + 3 = 7?"
            },
            {
                trigger: ['parabola', 'curve', 'u-shape', 'two solutions', 'two roots'],
                satisfied: true,
                response: "Interesting! So it can have two solutions because of the curve? How do I actually solve one though?"
            },
            {
                trigger: ['factoring', 'factor', 'quadratic formula', 'completing the square'],
                satisfied: true,
                response: "Can you give me a simple example? Like, how would you solve x² - 5x + 6 = 0?"
            },
            {
                trigger: ['(x-2)', '(x-3)', 'x = 2', 'x = 3', '2 and 3'],
                satisfied: true,
                response: "Oh! So we find two numbers that multiply to 6 and add to -5. That's -2 and -3. So (x-2)(x-3) = 0, meaning x = 2 or x = 3. I think I get it now!"
            }
        ],
        resistance: [
            "Hmm, that doesn't quite click for me. Can you be more specific?",
            "I'm not sure I follow. What do you mean exactly?",
            "That seems a bit vague. Can you explain it differently?",
            "I've heard those words before but I still don't understand the concept."
        ],
        criteria: {
            clarity: ['clear', 'simple', 'example', 'because', 'means', 'so'],
            depth: ['formula', 'solution', 'solve', 'roots', 'zero', 'equals'],
            engagement: ['you', 'your', 'think', 'imagine', 'notice', 'see']
        }
    },
    inference: {
        title: 'Making Inferences',
        icon: '📖',
        opening: "My teacher says I need to make 'inferences' when reading. But what does that even mean?",
        followUps: [
            {
                trigger: ['conclude', 'conclusion', 'figure out', 'not stated', 'between the lines', 'implied'],
                satisfied: true,
                response: "So it's like reading between the lines? But how do I know if my inference is correct?"
            },
            {
                trigger: ['evidence', 'clues', 'text says', 'support', 'details'],
                satisfied: true,
                response: "Okay, so I need evidence from the text. Can you give me an example?"
            },
            {
                trigger: ['example', 'for instance', 'like when', 'imagine', 'suppose'],
                satisfied: true,
                response: "That makes sense! So I combine what the text says with what I already know. But how is this different from just guessing?"
            },
            {
                trigger: ['logical', 'makes sense', 'reasonable', 'supported', 'based on'],
                satisfied: true,
                response: "Oh, so it's educated reasoning, not random guessing. The text has to support it. I think I understand now!"
            }
        ],
        resistance: [
            "I'm still confused. That sounds like just guessing to me.",
            "But how is that different from making stuff up?",
            "I don't see how I'm supposed to know something that isn't written.",
            "That's too abstract. Can you make it more concrete?"
        ],
        criteria: {
            clarity: ['clues', 'evidence', 'text', 'author', 'implies'],
            depth: ['logical', 'reasoning', 'support', 'conclude', 'deduce'],
            engagement: ['example', 'imagine', 'like', 'think about', 'consider']
        }
    },
    semicolons: {
        title: 'Semicolon Usage',
        icon: '✏️',
        opening: "I never know when to use a semicolon. It looks like a period but also like a comma? I'm confused.",
        followUps: [
            {
                trigger: ['independent clause', 'two sentences', 'complete thought', 'could be separate'],
                satisfied: true,
                response: "So it connects sentences that could stand alone? Why not just use a period then?"
            },
            {
                trigger: ['related', 'connected', 'close', 'relationship', 'together'],
                satisfied: true,
                response: "Ah, so when ideas are closely related! Can you give me an example?"
            },
            {
                trigger: ['example', 'like', 'for instance', ';'],
                satisfied: true,
                response: "Okay, I see. Is there any other time I'd use a semicolon?"
            },
            {
                trigger: ['however', 'therefore', 'conjunctive', 'list', 'commas'],
                satisfied: true,
                response: "Got it! So before words like 'however' or in complex lists. This is clearer now, thanks!"
            }
        ],
        resistance: [
            "That's still not clear to me. When would I actually use one?",
            "But why not just use a comma?",
            "I need a concrete example to understand.",
            "That rule sounds complicated. Is there an easier way to think about it?"
        ],
        criteria: {
            clarity: ['sentence', 'period', 'comma', 'connect', 'join'],
            depth: ['independent', 'clause', 'however', 'therefore', 'list'],
            engagement: ['example', 'like', 'such as', 'for instance', 'imagine']
        }
    },
    pythagorean: {
        title: 'Pythagorean Theorem',
        icon: '📐',
        opening: "What's the Pythagorean theorem? I've seen a² + b² = c² but I don't get what it means.",
        followUps: [
            {
                trigger: ['right triangle', 'right angle', '90 degree', 'legs', 'hypotenuse'],
                satisfied: true,
                response: "Okay, so it only works for right triangles. But what are the legs and hypotenuse?"
            },
            {
                trigger: ['longest side', 'across from', 'opposite', 'shorter sides'],
                satisfied: true,
                response: "So a and b are the two shorter sides, and c is the longest one across from the right angle? Can you show me how to use it?"
            },
            {
                trigger: ['3', '4', '5', 'example', 'solve', 'find'],
                satisfied: true,
                response: "Oh! So if I know two sides, I can find the third. Like 3² + 4² = 9 + 16 = 25 = 5². That's cool!"
            },
            {
                trigger: ['distance', 'real world', 'diagonal', 'construction', 'practical'],
                satisfied: true,
                response: "So it's actually useful in real life too, not just math class. I get it now!"
            }
        ],
        resistance: [
            "I don't see why this works. It seems like magic.",
            "But what are a, b, and c supposed to be?",
            "Can you explain it without just stating the formula?",
            "Why does squaring the sides matter?"
        ],
        criteria: {
            clarity: ['right', 'triangle', 'sides', 'equals', 'square'],
            depth: ['hypotenuse', 'legs', 'opposite', 'formula', 'solve'],
            engagement: ['imagine', 'example', 'like', 'think', 'real']
        }
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// SENSEI STATE
// ─────────────────────────────────────────────────────────────────────────────

const senseiState = {
    active: false,
    topic: null,
    topicData: null,
    messages: [],
    currentFollowUp: 0,
    scores: {
        clarity: 0,
        depth: 0,
        engagement: 0
    },
    messageCount: 0,
    satisfied: false
};

// ─────────────────────────────────────────────────────────────────────────────
// INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────────

function startSensei(topic) {
    senseiState.topic = topic;
    senseiState.topicData = SENSEI_TOPICS[topic];
    senseiState.messages = [];
    senseiState.currentFollowUp = 0;
    senseiState.scores = { clarity: 0, depth: 0, engagement: 0 };
    senseiState.messageCount = 0;
    senseiState.satisfied = false;
    senseiState.active = true;

    // Update UI
    document.getElementById('current-topic-title').textContent = senseiState.topicData.title;

    // Show chat, hide selection
    document.getElementById('sensei-topic-select').classList.add('hidden');
    document.getElementById('sensei-chat').classList.remove('hidden');
    document.getElementById('sensei-evaluation').classList.add('hidden');

    // Clear chat
    document.getElementById('chat-container').innerHTML = '';

    // Add opening message
    addMessage('ai', senseiState.topicData.opening);

    // Focus input
    document.getElementById('chat-input').focus();
}

// ─────────────────────────────────────────────────────────────────────────────
// MESSAGE HANDLING
// ─────────────────────────────────────────────────────────────────────────────

function addMessage(sender, text) {
    const container = document.getElementById('chat-container');
    const message = document.createElement('div');
    message.className = `chat-message ${sender}`;

    const avatar = sender === 'ai' ? '🧠' : '👤';

    message.innerHTML = `
    <div class="chat-avatar">${avatar}</div>
    <div class="chat-bubble">${text}</div>
  `;

    container.appendChild(message);
    container.scrollTop = container.scrollHeight;

    senseiState.messages.push({ sender, text });
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();

    if (!text || !senseiState.active) return;

    // Add user message
    addMessage('user', text);
    input.value = '';
    senseiState.messageCount++;

    // Analyze the response
    analyzeResponse(text);

    // Generate AI response after a short delay
    setTimeout(() => {
        generateAIResponse(text);
    }, 800);
}

// Allow Enter to send (Shift+Enter for new line)
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('chat-input');
    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSE ANALYSIS
// ─────────────────────────────────────────────────────────────────────────────

function analyzeResponse(text) {
    const topic = senseiState.topicData;
    const lowerText = text.toLowerCase();

    // Score clarity
    topic.criteria.clarity.forEach(keyword => {
        if (lowerText.includes(keyword)) {
            senseiState.scores.clarity += 1;
        }
    });

    // Score depth
    topic.criteria.depth.forEach(keyword => {
        if (lowerText.includes(keyword)) {
            senseiState.scores.depth += 1;
        }
    });

    // Score engagement
    topic.criteria.engagement.forEach(keyword => {
        if (lowerText.includes(keyword)) {
            senseiState.scores.engagement += 1;
        }
    });
}

function checkFollowUpTrigger(text) {
    if (senseiState.currentFollowUp >= senseiState.topicData.followUps.length) {
        return null;
    }

    const followUp = senseiState.topicData.followUps[senseiState.currentFollowUp];
    const lowerText = text.toLowerCase();

    for (const trigger of followUp.trigger) {
        if (lowerText.includes(trigger.toLowerCase())) {
            return followUp;
        }
    }

    return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// AI RESPONSE GENERATION
// ─────────────────────────────────────────────────────────────────────────────

function generateAIResponse(userText) {
    const topic = senseiState.topicData;

    // Check if the response triggers the next follow-up
    const triggeredFollowUp = checkFollowUpTrigger(userText);

    if (triggeredFollowUp) {
        // User gave a satisfactory response
        addMessage('ai', triggeredFollowUp.response);
        senseiState.currentFollowUp++;

        // Check if we've completed all follow-ups
        if (senseiState.currentFollowUp >= topic.followUps.length) {
            senseiState.satisfied = true;
            setTimeout(() => {
                endSensei();
            }, 2000);
        }
    } else {
        // User's response wasn't satisfactory - push back
        const resistance = topic.resistance[
            Math.floor(Math.random() * topic.resistance.length)
        ];
        addMessage('ai', resistance);

        // After too many failed attempts, give a hint
        if (senseiState.messageCount > 6 && senseiState.currentFollowUp === 0) {
            setTimeout(() => {
                addMessage('ai', "Let me ask more specifically: " + topic.opening);
            }, 1000);
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// END SESSION
// ─────────────────────────────────────────────────────────────────────────────

function endSensei() {
    senseiState.active = false;

    // Calculate final grade
    const { clarity, depth, engagement } = senseiState.scores;
    const totalScore = clarity + depth + engagement;
    const maxPossible = Object.values(senseiState.topicData.criteria)
        .reduce((sum, arr) => sum + arr.length * (senseiState.currentFollowUp + 1), 0);

    const percentage = Math.min(100, (totalScore / maxPossible) * 100 + (senseiState.satisfied ? 40 : 0));

    let grade, gradeClass, xpReward, dmReward, feedback;

    if (percentage >= 85 || senseiState.satisfied) {
        grade = 'A';
        gradeClass = 'excellent';
        xpReward = 150;
        dmReward = 2;
        feedback = "Outstanding teaching! You explained concepts clearly, provided depth, and engaged effectively. Your understanding of this topic is masterful.";
    } else if (percentage >= 70) {
        grade = 'B';
        gradeClass = 'good';
        xpReward = 100;
        dmReward = 1;
        feedback = "Good teaching session. You demonstrated solid understanding, though some explanations could be clearer or more detailed.";
    } else if (percentage >= 50) {
        grade = 'C';
        gradeClass = 'needs-work';
        xpReward = 50;
        dmReward = 0;
        feedback = "Acceptable effort, but your explanations need more clarity and depth. Practice breaking down concepts into simpler parts.";
    } else {
        grade = 'D';
        gradeClass = 'needs-work';
        xpReward = 25;
        dmReward = 0;
        feedback = "Your explanations were too vague or incomplete. Remember: if you can't explain it simply, you may need to review this topic yourself.";
    }

    // Update UI
    document.getElementById('eval-score').textContent = grade;
    document.getElementById('eval-score').className = `evaluation-score-value ${gradeClass}`;

    document.getElementById('eval-breakdown').innerHTML = `
    <div class="breakdown-stat">
      <div class="breakdown-value text-electric">${clarity}</div>
      <div class="breakdown-label">Clarity</div>
    </div>
    <div class="breakdown-stat">
      <div class="breakdown-value text-purple">${depth}</div>
      <div class="breakdown-label">Depth</div>
    </div>
    <div class="breakdown-stat">
      <div class="breakdown-value text-success">${engagement}</div>
      <div class="breakdown-label">Engagement</div>
    </div>
  `;

    document.getElementById('eval-feedback').innerHTML = `<p>${feedback}</p>`;
    document.getElementById('reward-xp').textContent = xpReward;
    document.getElementById('reward-dm').textContent = dmReward;

    // Award rewards
    window.SYNAPSE.addXP(xpReward);
    if (dmReward > 0) {
        window.SYNAPSE.addDarkMatter(dmReward);
    }

    // Show evaluation
    document.getElementById('sensei-chat').classList.add('hidden');
    document.getElementById('sensei-evaluation').classList.remove('hidden');
}

function restartSensei() {
    document.getElementById('sensei-topic-select').classList.remove('hidden');
    document.getElementById('sensei-chat').classList.add('hidden');
    document.getElementById('sensei-evaluation').classList.add('hidden');
}

// ─────────────────────────────────────────────────────────────────────────────
// INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    console.log('🧠 Sensei Mode initialized. You are the teacher now.');
});
