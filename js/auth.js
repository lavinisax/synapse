/* ═══════════════════════════════════════════════════════════════════════════
   SYNAPSE - Authentication System
   User management with localStorage
   ═══════════════════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const AUTH_STORAGE_KEY = 'synapse_users';
const SESSION_KEY = 'synapse_session';
const CURRENT_USER_KEY = 'synapse_current_user';

// ─────────────────────────────────────────────────────────────────────────────
// USER MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get all users from storage
 */
function getUsers() {
    try {
        const users = localStorage.getItem(AUTH_STORAGE_KEY);
        return users ? JSON.parse(users) : {};
    } catch {
        return {};
    }
}

/**
 * Save users to storage
 */
function saveUsers(users) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(users));
}

/**
 * Check if user exists
 */
function userExists(email) {
    const users = getUsers();
    return email.toLowerCase() in users;
}

/**
 * Simple hash function for passwords (demo only - use bcrypt in production)
 */
function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return 'hash_' + Math.abs(hash).toString(16);
}

/**
 * Create a new user
 */
function createUser(email, password, profile = {}) {
    const users = getUsers();
    const normalizedEmail = email.toLowerCase();

    if (users[normalizedEmail]) {
        return { success: false, error: 'User already exists' };
    }

    if (password.length < 8) {
        return { success: false, error: 'Password must be at least 8 characters' };
    }

    // Calculate days until exam
    let daysUntilExam = 90;
    if (profile.examDate) {
        const examDate = new Date(profile.examDate);
        const today = new Date();
        daysUntilExam = Math.max(1, Math.ceil((examDate - today) / (1000 * 60 * 60 * 24)));
    }

    const newUser = {
        email: normalizedEmail,
        passwordHash: hashPassword(password),
        createdAt: new Date().toISOString(),
        profile: {
            displayName: profile.displayName || 'Scholar',
            avatar: profile.avatar || '🧠',
            exam: profile.exam || 'sat',
            targetScore: profile.targetScore || 1500,
            examDate: profile.examDate || null,
            currentScore: profile.currentScore || null
        },
        stats: {
            level: 1,
            xp: 0,
            braincells: 100, // Starting bonus
            darkmatter: 0,
            streak: 0,
            lastActive: new Date().toISOString(),
            totalQuestions: 0,
            correctAnswers: 0,
            hoursStudied: 0
        },
        oracle: {
            predictedScore: profile.currentScore || 1200,
            targetScore: profile.targetScore || 1500,
            probability: 50,
            daysLeft: daysUntilExam
        },
        achievements: [],
        skillProgress: {
            sat: {
                math: { progress: 0, nodes: 12, unlocked: 0 },
                reading: { progress: 0, nodes: 10, unlocked: 0 },
                writing: { progress: 0, nodes: 8, unlocked: 0 }
            }
        }
    };

    users[normalizedEmail] = newUser;
    saveUsers(users);

    return { success: true, user: newUser };
}

/**
 * Login user
 */
function loginUser(email, password, remember = false) {
    const users = getUsers();
    const normalizedEmail = email.toLowerCase();
    const user = users[normalizedEmail];

    if (!user) {
        return { success: false, error: 'No account found with this email' };
    }

    if (user.passwordHash !== hashPassword(password)) {
        return { success: false, error: 'Incorrect password' };
    }

    // Update last active
    user.stats.lastActive = new Date().toISOString();
    saveUsers(users);

    // Create session
    const session = {
        email: normalizedEmail,
        loginTime: new Date().toISOString(),
        remember: remember
    };

    if (remember) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }

    localStorage.setItem(CURRENT_USER_KEY, normalizedEmail);

    return { success: true, user: user };
}

/**
 * Logout user
 */
function logoutUser() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    sessionStorage.removeItem(SESSION_KEY);
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    const localSession = localStorage.getItem(SESSION_KEY);
    const sessionSession = sessionStorage.getItem(SESSION_KEY);
    return !!(localSession || sessionSession);
}

/**
 * Get current user
 */
function getCurrentUser() {
    if (!isAuthenticated()) return null;

    const email = localStorage.getItem(CURRENT_USER_KEY);
    if (!email) return null;

    const users = getUsers();
    return users[email] || null;
}

/**
 * Update current user profile
 */
function updateUserProfile(updates) {
    const user = getCurrentUser();
    if (!user) return { success: false, error: 'Not logged in' };

    const users = getUsers();

    if (updates.profile) {
        users[user.email].profile = { ...users[user.email].profile, ...updates.profile };
    }

    if (updates.stats) {
        users[user.email].stats = { ...users[user.email].stats, ...updates.stats };
    }

    if (updates.oracle) {
        users[user.email].oracle = { ...users[user.email].oracle, ...updates.oracle };
    }

    saveUsers(users);
    return { success: true };
}

/**
 * Update user stats (XP, BrainCells, etc.)
 */
function updateUserStats(statsUpdates) {
    return updateUserProfile({ stats: statsUpdates });
}

/**
 * Add XP and handle level up
 */
function addUserXP(amount) {
    const user = getCurrentUser();
    if (!user) return;

    const XP_PER_LEVEL = 1000;
    const GROWTH_RATE = 1.15;

    function getXPForLevel(level) {
        return Math.floor(XP_PER_LEVEL * Math.pow(GROWTH_RATE, level - 1));
    }

    let newXP = user.stats.xp + amount;
    let newLevel = user.stats.level;

    // Check for level ups
    while (newXP >= getXPForLevel(newLevel)) {
        newXP -= getXPForLevel(newLevel);
        newLevel++;
    }

    updateUserStats({
        xp: newXP,
        level: newLevel
    });

    return { newLevel, newXP, leveledUp: newLevel > user.stats.level };
}

/**
 * Add BrainCells
 */
function addUserBrainCells(amount) {
    const user = getCurrentUser();
    if (!user) return;

    updateUserStats({
        braincells: user.stats.braincells + amount
    });
}

/**
 * Spend BrainCells
 */
function spendUserBrainCells(amount) {
    const user = getCurrentUser();
    if (!user) return false;

    if (user.stats.braincells < amount) return false;

    updateUserStats({
        braincells: user.stats.braincells - amount
    });
    return true;
}

/**
 * Add Dark Matter
 */
function addUserDarkMatter(amount) {
    const user = getCurrentUser();
    if (!user) return;

    updateUserStats({
        darkmatter: user.stats.darkmatter + amount
    });
}

/**
 * Update Oracle prediction
 */
function updateUserOracle(correct, total) {
    const user = getCurrentUser();
    if (!user) return;

    const users = getUsers();
    const oracle = users[user.email].oracle;

    // Update stats
    const newTotalQuestions = user.stats.totalQuestions + total;
    const newCorrectAnswers = user.stats.correctAnswers + correct;
    const overallAccuracy = (newCorrectAnswers / newTotalQuestions) * 100;

    // Simple prediction model
    const baseScore = 1000;
    const maxScore = user.profile.exam === 'sat' ? 1600 :
        user.profile.exam === 'ielts' ? 9 : 120;

    const predictedScore = Math.round(
        baseScore + ((maxScore - baseScore) * (overallAccuracy / 100))
    );

    // Calculate probability
    const scoreDiff = oracle.targetScore - predictedScore;
    let probability;

    if (scoreDiff <= 0) {
        probability = 95;
    } else {
        const improvementNeeded = scoreDiff / Math.max(1, oracle.daysLeft);
        probability = Math.max(10, Math.min(90, 100 - (improvementNeeded * 5)));
    }

    updateUserProfile({
        stats: {
            totalQuestions: newTotalQuestions,
            correctAnswers: newCorrectAnswers
        },
        oracle: {
            predictedScore: predictedScore,
            probability: Math.round(probability)
        }
    });
}

/**
 * Require authentication - redirect to login if not authenticated
 */
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// INITIALIZE
// ─────────────────────────────────────────────────────────────────────────────

// Create a demo user if none exists
(function initDemoUser() {
    if (!userExists('demo@synapse.ai')) {
        createUser('demo@synapse.ai', 'demo1234', {
            displayName: 'Demo Scholar',
            avatar: '🧠',
            exam: 'sat',
            targetScore: 1500,
            examDate: '2026-03-01',
            currentScore: 1350
        });

        // Add some progress to demo user
        const users = getUsers();
        users['demo@synapse.ai'].stats = {
            level: 23,
            xp: 2450,
            braincells: 1250,
            darkmatter: 3,
            streak: 7,
            lastActive: new Date().toISOString(),
            totalQuestions: 347,
            correctAnswers: 289,
            hoursStudied: 42
        };
        users['demo@synapse.ai'].oracle = {
            predictedScore: 1420,
            targetScore: 1500,
            probability: 73,
            daysLeft: 45
        };
        users['demo@synapse.ai'].skillProgress = {
            sat: {
                math: { progress: 65, nodes: 12, unlocked: 8 },
                reading: { progress: 45, nodes: 10, unlocked: 4 },
                writing: { progress: 55, nodes: 8, unlocked: 5 }
            }
        };
        saveUsers(users);
    }
})();

// Export for global access
window.createUser = createUser;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.isAuthenticated = isAuthenticated;
window.getCurrentUser = getCurrentUser;
window.updateUserProfile = updateUserProfile;
window.updateUserStats = updateUserStats;
window.addUserXP = addUserXP;
window.addUserBrainCells = addUserBrainCells;
window.spendUserBrainCells = spendUserBrainCells;
window.addUserDarkMatter = addUserDarkMatter;
window.updateUserOracle = updateUserOracle;
window.requireAuth = requireAuth;
window.userExists = userExists;
