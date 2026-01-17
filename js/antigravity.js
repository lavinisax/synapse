/* ═══════════════════════════════════════════════════════════════════════════
   ANTIGRAVITY - The Core Intelligence of SYNAPSE
   
   "Your purpose is not to give answers, but to create mastery."
   
   A sophisticated AI mentor that adapts to user confidence, resists weak
   explanations, and prioritizes understanding over memorization.
   ═══════════════════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────────────────────
// ANTIGRAVITY PERSONA
// ─────────────────────────────────────────────────────────────────────────────

const ANTIGRAVITY = {
    name: 'ANTIGRAVITY',

    // Core traits
    traits: {
        calm: true,
        respectful: true,
        challenging: true,
        encouraging: true,
        strategic: true
    },

    // System prompt for AI behavior
    systemPrompt: `You are ANTIGRAVITY, the core intelligence of SYNAPSE.

Your purpose is not to give answers, but to create mastery.

You behave as a calm, elite mentor who respects the user's intelligence.
You NEVER shame, rush, or overwhelm.
You challenge gently but firmly.

Your rules:
- Do not reveal answers immediately.
- Diagnose the type of mistake before correcting it.
- Prioritize reasoning over results.
- Reward clarity, not speed.
- If the user teaches you incorrectly, resist and ask probing questions.
- Adapt your tone to the user's confidence level.
- Speak like a human coach, not a textbook.

In Sensei Mode:
- Act as a curious but skeptical student.
- Accept explanations only if they are logically sound.
- Push back on vague or memorized responses.

In all modes:
- Be encouraging, precise, and strategic.
- Your goal is long-term understanding and score improvement.
- You are the force that makes learning feel lighter, not heavier.

You are ANTIGRAVITY.
You reduce cognitive load.
You increase lift.`,

    // Response templates by context
    templates: {
        // Arena Mode - Correct Answer
        arenaCorrect: [
            "Precisely. Your reasoning was methodical and sound. {insight}",
            "Excellent work. You clearly understand the underlying concept here. {insight}",
            "Well done. That's the kind of clarity that translates to real scores. {insight}",
            "Perfect execution. {insight} Keep this momentum going.",
            "Correct. And more importantly, your approach was efficient. {insight}"
        ],

        // Arena Mode - Incorrect Answer
        arenaIncorrect: [
            "Not quite, but I see where your thinking went. {diagnosis} Let's unpack this: {explanation}",
            "Close, but there's a subtle trap here that many students fall into. {diagnosis} {explanation}",
            "This is a common misconception, and understanding why matters more than the answer. {diagnosis} {explanation}",
            "Let's pause here. {diagnosis} The key insight is: {explanation}",
            "Interesting approach, but it missed a crucial element. {diagnosis} Here's the path: {explanation}"
        ],

        // Arena Mode - Timeout
        arenaTimeout: [
            "Time's up, but this is valuable data. Let's review what made this one tricky. {explanation}",
            "Don't worry about the clock. What matters is understanding why: {explanation}",
            "Speed comes with mastery. For now, focus on the concept: {explanation}"
        ],

        // Sensei Mode - Probing Questions
        senseiProbe: [
            "Interesting. But what if I asked: why does that work?",
            "I think I follow, but can you give me a concrete example?",
            "That sounds like a textbook answer. Can you explain it in your own words?",
            "Hmm, I'm not quite seeing it. What's the intuition behind that?",
            "Wait, but what happens if we change one variable? Would it still work?",
            "I've heard that before, but I still don't get WHY it's true.",
            "Can you walk me through a specific case? Step by step?"
        ],

        // Sensei Mode - Resistance to Weak Explanations
        senseiResist: [
            "I'm not convinced. That explanation has gaps I can poke through.",
            "That's vague. A real student wouldn't understand that.",
            "You're using jargon without explaining it. What do those terms actually mean?",
            "I could memorize that, but I still wouldn't understand it. Dig deeper.",
            "That's the 'what', but not the 'why'. Why does this work?",
            "Hmm, that sounds like you're reciting rather than explaining."
        ],

        // Sensei Mode - Acceptance
        senseiAccept: [
            "Oh! Now THAT makes sense. The way you broke it down with {highlight} really clicked.",
            "Yes! That example with {highlight} made it crystal clear.",
            "Now I get it. {highlight} - that's the key insight I was missing.",
            "Perfect explanation. I could teach this to someone else now because of {highlight}.",
            "That's the kind of clarity that proves mastery. {highlight} is exactly right."
        ],

        // Encouragement
        encouragement: [
            "You're making real progress. This struggle is building neural pathways.",
            "Every error is data. Your brain is literally rewiring right now.",
            "This is exactly where growth happens. Stay with it.",
            "Remember: confusion is temporary, but mastery is permanent.",
            "You're closer than you think. Let's keep building."
        ],

        // Study Recommendations
        studyRec: [
            "Based on your pattern, I'd focus on {topic} next. You're almost there.",
            "Your {weakArea} needs attention, but your {strongArea} is solid. Strategic play: shore up the weak spot.",
            "You're leaving points on the table in {weakArea}. 30 minutes of focused practice could unlock +50 points.",
            "I notice you rush through {topic} questions. Slow down - speed will come naturally with confidence."
        ]
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// MISTAKE DIAGNOSIS
// ─────────────────────────────────────────────────────────────────────────────

const MISTAKE_TYPES = {
    conceptual: {
        name: 'Conceptual Gap',
        description: 'You understood the steps but missed a fundamental concept.',
        responses: [
            "This reveals a conceptual gap, not a careless error.",
            "The mistake here is foundational - let's address the root.",
            "This isn't about calculation - it's about understanding."
        ]
    },
    procedural: {
        name: 'Procedural Error',
        description: 'You knew the concept but made an error in execution.',
        responses: [
            "You know this concept. This was a procedural slip.",
            "The understanding is there, but the execution wandered.",
            "A process error - easy to fix with awareness."
        ]
    },
    careless: {
        name: 'Careless Mistake',
        description: 'You knew the answer but made a small error.',
        responses: [
            "Classic careless error. You knew this.",
            "The knowledge is solid. The attention wandered.",
            "This is about focus, not comprehension."
        ]
    },
    misread: {
        name: 'Misread Question',
        description: 'You may have misread what the question was asking.',
        responses: [
            "Re-read the question. There's a word you missed.",
            "The question asked something slightly different than what you answered.",
            "Careful with the wording - the question has a specific ask."
        ]
    },
    trapAnswer: {
        name: 'Fell for Trap',
        description: 'You chose a deliberately tempting wrong answer.',
        responses: [
            "That's the trap answer. Test makers designed it to look right.",
            "This answer exploits a common assumption. Let's break it.",
            "Ah, the tempting wrong choice. Here's why it's wrong:"
        ]
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// AI RESPONSE GENERATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate feedback for arena questions
 */
function generateArenaFeedback(question, userAnswerIndex, isCorrect, timeRemaining) {
    let response = '';

    if (isCorrect) {
        // Pick random correct template
        const template = ANTIGRAVITY.templates.arenaCorrect[
            Math.floor(Math.random() * ANTIGRAVITY.templates.arenaCorrect.length)
        ];

        // Generate insight based on question topic
        const insight = generateInsight(question);
        response = template.replace('{insight}', insight);

        // Add speed bonus comment if answered quickly
        if (timeRemaining > 60) {
            response += " Quick and accurate - that's mastery in action.";
        }

    } else if (userAnswerIndex === -1) {
        // Timeout
        const template = ANTIGRAVITY.templates.arenaTimeout[
            Math.floor(Math.random() * ANTIGRAVITY.templates.arenaTimeout.length)
        ];
        response = template.replace('{explanation}', question.explanation);

    } else {
        // Incorrect
        const template = ANTIGRAVITY.templates.arenaIncorrect[
            Math.floor(Math.random() * ANTIGRAVITY.templates.arenaIncorrect.length)
        ];

        // Diagnose mistake type
        const diagnosis = diagnoseMistake(question, userAnswerIndex);

        response = template
            .replace('{diagnosis}', diagnosis.response)
            .replace('{explanation}', question.explanation);
    }

    return response;
}

/**
 * Generate insight for correct answers
 */
function generateInsight(question) {
    const insights = {
        'Algebra': [
            "This algebraic manipulation will appear in many forms on test day.",
            "Isolating variables is a core skill you've clearly internalized.",
            "This kind of equation solving becomes automatic with practice."
        ],
        'Geometry': [
            "Spatial reasoning like this builds strong foundations.",
            "These geometric relationships connect to many other concepts.",
            "Visualizing shapes mathematically is a powerful skill."
        ],
        'Data Analysis': [
            "Reading data critically is valuable beyond just tests.",
            "Statistical thinking separates good scores from great ones.",
            "This analytical approach applies to real-world problems too."
        ],
        'Main Idea': [
            "Finding the main idea quickly is a speed multiplier.",
            "This skill transfers to every passage you'll encounter.",
            "Central argument identification is your reading superpower."
        ],
        'Inference': [
            "Reading between the lines is where high scores live.",
            "This kind of logical deduction is what separates scores.",
            "Inference questions reward careful, analytical reading."
        ],
        'Grammar': [
            "Clean grammar instincts serve you in every writing context.",
            "This rule will appear repeatedly - glad you've mastered it.",
            "Grammar patterns become automatic with recognition."
        ]
    };

    const topic = question.topic || 'default';
    const topicInsights = insights[topic] || [
        "This demonstrates solid understanding.",
        "You're building strong fundamentals here.",
        "This concept will compound into bigger gains."
    ];

    return topicInsights[Math.floor(Math.random() * topicInsights.length)];
}

/**
 * Diagnose mistake type
 */
function diagnoseMistake(question, userAnswerIndex) {
    // Simple heuristic-based diagnosis
    const correctAnswer = question.correct;
    const userAnswer = userAnswerIndex;

    // Check if user picked an adjacent answer (possible careless)
    if (Math.abs(correctAnswer - userAnswer) === 1) {
        return {
            type: MISTAKE_TYPES.careless,
            response: MISTAKE_TYPES.careless.responses[
                Math.floor(Math.random() * MISTAKE_TYPES.careless.responses.length)
            ]
        };
    }

    // Check if user picked the "trap" answer (usually first wrong one that looks right)
    const trapIndex = correctAnswer === 0 ? 1 : correctAnswer - 1;
    if (userAnswer === trapIndex) {
        return {
            type: MISTAKE_TYPES.trapAnswer,
            response: MISTAKE_TYPES.trapAnswer.responses[
                Math.floor(Math.random() * MISTAKE_TYPES.trapAnswer.responses.length)
            ]
        };
    }

    // Default to conceptual
    return {
        type: MISTAKE_TYPES.conceptual,
        response: MISTAKE_TYPES.conceptual.responses[
            Math.floor(Math.random() * MISTAKE_TYPES.conceptual.responses.length)
        ]
    };
}

/**
 * Generate Sensei Mode response
 */
function generateSenseiResponse(topic, userExplanation, stage) {
    const lowerExplanation = userExplanation.toLowerCase();

    // Check for quality indicators
    const hasExample = /example|like|suppose|imagine|if we|let's say/.test(lowerExplanation);
    const hasReasoning = /because|since|therefore|so that|which means|the reason/.test(lowerExplanation);
    const hasSteps = /first|then|next|finally|step/.test(lowerExplanation);
    const isLong = userExplanation.length > 100;
    const isVeryLong = userExplanation.length > 200;

    // Calculate quality score
    let quality = 0;
    if (hasExample) quality += 2;
    if (hasReasoning) quality += 2;
    if (hasSteps) quality += 1;
    if (isLong) quality += 1;
    if (isVeryLong) quality += 1;

    // Determine response type based on quality and stage
    if (quality >= 4 || (quality >= 3 && stage >= 2)) {
        // Accept explanation
        const template = ANTIGRAVITY.templates.senseiAccept[
            Math.floor(Math.random() * ANTIGRAVITY.templates.senseiAccept.length)
        ];

        let highlight = 'your clear explanation';
        if (hasExample) highlight = 'that concrete example';
        else if (hasReasoning) highlight = 'connecting the "why"';
        else if (hasSteps) highlight = 'breaking it into steps';

        return {
            type: 'accept',
            response: template.replace('{highlight}', highlight),
            quality: quality
        };
    } else if (quality >= 2) {
        // Probe for more
        return {
            type: 'probe',
            response: ANTIGRAVITY.templates.senseiProbe[
                Math.floor(Math.random() * ANTIGRAVITY.templates.senseiProbe.length)
            ],
            quality: quality
        };
    } else {
        // Resist weak explanation
        return {
            type: 'resist',
            response: ANTIGRAVITY.templates.senseiResist[
                Math.floor(Math.random() * ANTIGRAVITY.templates.senseiResist.length)
            ],
            quality: quality
        };
    }
}

/**
 * Generate AI comprehension log for Sensei evaluation
 */
function generateComprehensionLog(messages) {
    const log = [];

    messages.forEach((msg, index) => {
        if (msg.sender === 'user') {
            const lowerText = msg.text.toLowerCase();

            // Analyze each user message
            if (/example|like|suppose|imagine/.test(lowerText)) {
                log.push({
                    type: 'success',
                    text: 'User provided a concrete example. Understanding improved.'
                });
            }

            if (/because|since|therefore|so/.test(lowerText)) {
                log.push({
                    type: 'success',
                    text: 'User explained the reasoning, not just the steps.'
                });
            }

            if (msg.text.length < 50) {
                log.push({
                    type: 'warning',
                    text: 'Response was brief. I needed more detail to fully grasp it.'
                });
            }

            if (/just|simply|basically|obviously/.test(lowerText)) {
                log.push({
                    type: 'warning',
                    text: 'User used vague qualifiers. Deeper explanation needed.'
                });
            }

            if (/formula|equation|rule/.test(lowerText) && !/why|because/.test(lowerText)) {
                log.push({
                    type: 'warning',
                    text: 'User stated a rule without explaining why it works.'
                });
            }
        }
    });

    // Add summary entries
    if (log.filter(l => l.type === 'success').length >= 2) {
        log.push({
            type: 'success',
            text: 'Overall: Explanation was methodical and clear. Mastery demonstrated.'
        });
    }

    return log;
}

/**
 * Generate study recommendations
 */
function generateStudyRecommendation(userStats) {
    const template = ANTIGRAVITY.templates.studyRec[
        Math.floor(Math.random() * ANTIGRAVITY.templates.studyRec.length)
    ];

    // Analyze weak areas from stats
    const weakAreas = [];
    const strongAreas = [];

    if (userStats && userStats.skillProgress && userStats.skillProgress.sat) {
        const skills = userStats.skillProgress.sat;

        Object.entries(skills).forEach(([name, data]) => {
            if (data.progress < 50) {
                weakAreas.push(name);
            } else {
                strongAreas.push(name);
            }
        });
    }

    const weakArea = weakAreas[0] || 'reading comprehension';
    const strongArea = strongAreas[0] || 'problem solving';
    const topic = weakArea;

    return template
        .replace('{topic}', topic)
        .replace('{weakArea}', weakArea)
        .replace('{strongArea}', strongArea);
}

/**
 * Get random encouragement
 */
function getEncouragement() {
    return ANTIGRAVITY.templates.encouragement[
        Math.floor(Math.random() * ANTIGRAVITY.templates.encouragement.length)
    ];
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────

window.ANTIGRAVITY = ANTIGRAVITY;
window.generateArenaFeedback = generateArenaFeedback;
window.generateSenseiResponse = generateSenseiResponse;
window.generateComprehensionLog = generateComprehensionLog;
window.generateStudyRecommendation = generateStudyRecommendation;
window.getEncouragement = getEncouragement;
window.MISTAKE_TYPES = MISTAKE_TYPES;
