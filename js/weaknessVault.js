/* ═══════════════════════════════════════════════════════════════════════════
   SYNAPSE - Weakness Vault System
   Save, track, and review missed questions
   ═══════════════════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────────────────────
// VAULT STORAGE
// ─────────────────────────────────────────────────────────────────────────────

const VAULT_KEY = 'synapse_weakness_vault';

function getVault() {
    try {
        return JSON.parse(localStorage.getItem(VAULT_KEY) || '[]');
    } catch (e) {
        console.error('Failed to load vault:', e);
        return [];
    }
}

function saveVault(vault) {
    try {
        localStorage.setItem(VAULT_KEY, JSON.stringify(vault));
    } catch (e) {
        console.error('Failed to save vault:', e);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// VAULT OPERATIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Save a missed question to the vault
 */
function saveToVault(question, userAnswer) {
    const vault = getVault();

    // Check if already in vault
    if (vault.find(item => item.id === question.id)) {
        console.log('Question already in vault:', question.id);
        return false;
    }

    const vaultItem = {
        id: question.id,
        question: question.question,
        topic: question.topic,
        difficulty: question.difficulty,
        options: question.options,
        correct: question.correct,
        explanation: question.explanation,
        passage: question.passage || null,
        userAnswer: userAnswer,
        savedAt: new Date().toISOString(),
        attempts: 1,
        mastered: false
    };

    vault.push(vaultItem);
    saveVault(vault);

    // Show toast
    if (window.showToast) {
        window.showToast('📥', 'Saved to Weakness Vault', 'error');
    }

    console.log('Saved to vault:', question.id);
    return true;
}

/**
 * Get all items in the vault
 */
function getVaultItems() {
    return getVault().filter(item => !item.mastered);
}

/**
 * Get vault count (non-mastered)
 */
function getVaultCount() {
    return getVaultItems().length;
}

/**
 * Mark a question as mastered and remove from active vault
 */
function markMastered(questionId) {
    const vault = getVault();
    const item = vault.find(v => v.id === questionId);

    if (item) {
        item.mastered = true;
        item.masteredAt = new Date().toISOString();
        saveVault(vault);

        if (window.showToast) {
            window.showToast('🎉', 'Weakness conquered!', 'success');
        }
        return true;
    }
    return false;
}

/**
 * Remove a question from the vault entirely
 */
function removeFromVault(questionId) {
    const vault = getVault();
    const newVault = vault.filter(v => v.id !== questionId);
    saveVault(newVault);
    return newVault.length !== vault.length;
}

/**
 * Record another attempt at a vault question
 */
function recordAttempt(questionId, isCorrect) {
    const vault = getVault();
    const item = vault.find(v => v.id === questionId);

    if (item) {
        item.attempts = (item.attempts || 0) + 1;
        item.lastAttempt = new Date().toISOString();

        // Auto-master after 3 correct attempts
        if (isCorrect) {
            item.correctAttempts = (item.correctAttempts || 0) + 1;
            if (item.correctAttempts >= 3) {
                markMastered(questionId);
            }
        }

        saveVault(vault);
    }
}

/**
 * Get vault items for a specific topic
 */
function getVaultByTopic(topic) {
    return getVaultItems().filter(item =>
        item.topic.toLowerCase().includes(topic.toLowerCase())
    );
}

/**
 * Get the most recent vault items
 */
function getRecentVaultItems(count = 3) {
    return getVaultItems()
        .sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
        .slice(0, count);
}

/**
 * Get vault statistics
 */
function getVaultStats() {
    const vault = getVault();
    const active = vault.filter(v => !v.mastered);
    const mastered = vault.filter(v => v.mastered);

    // Group by topic
    const topicCounts = {};
    active.forEach(item => {
        topicCounts[item.topic] = (topicCounts[item.topic] || 0) + 1;
    });

    // Find weakest topic
    let weakestTopic = null;
    let maxCount = 0;
    for (const [topic, count] of Object.entries(topicCounts)) {
        if (count > maxCount) {
            weakestTopic = topic;
            maxCount = count;
        }
    }

    return {
        active: active.length,
        mastered: mastered.length,
        total: vault.length,
        topicCounts,
        weakestTopic
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// UI RENDERING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Render vault cards for dashboard
 */
function renderVaultCards(containerId, limit = 3) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const items = getRecentVaultItems(limit);

    if (items.length === 0) {
        container.innerHTML = `
            <div class="vault-empty">
                <span class="vault-empty-icon">✨</span>
                <p>No weaknesses yet! Keep battling in the Arena.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = items.map(item => `
        <div class="vault-card" data-id="${item.id}">
            <span class="vault-icon">📌</span>
            <div class="vault-content">
                <div class="vault-topic">${item.topic}</div>
                <div class="vault-question">${truncateText(item.question, 80)}</div>
                <div class="vault-date">Saved ${formatRelativeTime(item.savedAt)}</div>
            </div>
            <button class="vault-action" onclick="trainVaultItem('${item.id}')">
                Train
            </button>
        </div>
    `).join('');
}

/**
 * Navigate to train a specific vault item
 */
function trainVaultItem(questionId) {
    // Store the selected question ID and go to Sensei
    sessionStorage.setItem('sensei_vault_question', questionId);
    window.location.href = 'sensei.html?from=vault';
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function formatRelativeTime(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
}

// ─────────────────────────────────────────────────────────────────────────────
// DEMO DATA SEEDING
// ─────────────────────────────────────────────────────────────────────────────

function seedVaultDemo() {
    const vault = getVault();

    // Only seed if vault is empty
    if (vault.length > 0) return;

    const demoItems = [
        {
            id: 'm002',
            question: 'If 2(x - 3) = 4x + 10, what is the value of x?',
            topic: 'Algebra',
            difficulty: 3,
            options: ['-8', '-4', '4', '8'],
            correct: 0,
            explanation: 'First distribute: 2x - 6 = 4x + 10. Subtract 2x from both sides: -6 = 2x + 10. Subtract 10: -16 = 2x. Divide by 2: x = -8.',
            userAnswer: 1,
            savedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            attempts: 1,
            mastered: false
        },
        {
            id: 'r002',
            question: 'What can be inferred about the library?',
            topic: 'Inference',
            difficulty: 3,
            options: ['It was recently built', 'It is currently thriving', 'It has fallen into disuse', 'It is being renovated'],
            correct: 2,
            explanation: 'The description of dark windows, dust, weeds, and a tilted sign all suggest neglect and abandonment.',
            passage: 'The old library stood on the corner of Main Street, its windows dark and dusty...',
            userAnswer: 1,
            savedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            attempts: 2,
            mastered: false
        },
        {
            id: 'w003',
            question: 'Which revision eliminates the dangling modifier?',
            topic: 'Sentence Structure',
            difficulty: 3,
            options: [
                'Walking through the park, the beautiful flowers.',
                'The flowers were beautiful, walking through the park.',
                'Walking through the park, I found the flowers beautiful.',
                'The flowers walking through the park were beautiful.'
            ],
            correct: 2,
            explanation: 'The original sentence implies the flowers were walking. By adding "I" as the subject, it\'s clear who was walking.',
            userAnswer: 0,
            savedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
            attempts: 1,
            mastered: false
        }
    ];

    saveVault(demoItems);
    console.log('🗃️ Seeded demo vault with', demoItems.length, 'items');
}

// Auto-seed on load
document.addEventListener('DOMContentLoaded', seedVaultDemo);

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

window.WeaknessVault = {
    save: saveToVault,
    get: getVaultItems,
    getCount: getVaultCount,
    getRecent: getRecentVaultItems,
    getByTopic: getVaultByTopic,
    getStats: getVaultStats,
    markMastered,
    remove: removeFromVault,
    recordAttempt,
    render: renderVaultCards,
    train: trainVaultItem
};
