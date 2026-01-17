/* ═══════════════════════════════════════════════════════════════════════════
   SYNAPSE - Shared UI Components
   Inject consistent navbar, footer, and toast notifications across all pages
   ═══════════════════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────────────────────

function injectNavbar() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    const navHTML = `
        <nav class="navbar">
            <div class="nav-container">
                <a href="index.html" class="nav-logo">
                    <span class="logo-icon">🧠</span>
                    <span class="logo-text">SYNAPSE</span>
                </a>
                
                <div class="nav-links">
                    <a href="dashboard.html" class="nav-link ${currentPage === 'dashboard.html' ? 'active' : ''}">
                        <span class="nav-icon">📊</span>
                        <span>Dashboard</span>
                    </a>
                    <a href="arena.html" class="nav-link ${currentPage === 'arena.html' ? 'active' : ''}">
                        <span class="nav-icon">🏟️</span>
                        <span>Arena</span>
                    </a>
                    <a href="sensei.html" class="nav-link ${currentPage === 'sensei.html' ? 'active' : ''}">
                        <span class="nav-icon">🧙‍♂️</span>
                        <span>Sensei</span>
                    </a>
                    <a href="profile.html" class="nav-link ${currentPage === 'profile.html' ? 'active' : ''}">
                        <span class="nav-icon">👤</span>
                        <span>Profile</span>
                    </a>
                </div>
                
                <div class="nav-actions">
                    <div class="nav-currency">
                        <span class="currency-item" title="BrainCells">
                            <span class="currency-icon">🧠</span>
                            <span class="currency-value" id="nav-braincells">--</span>
                        </span>
                        <span class="currency-item" title="Dark Matter">
                            <span class="currency-icon">💠</span>
                            <span class="currency-value" id="nav-darkmatter">--</span>
                        </span>
                    </div>
                    <div class="nav-user">
                        <span class="user-level" id="nav-level">LVL --</span>
                        <span class="user-xp-bar">
                            <span class="user-xp-fill" id="nav-xp-fill" style="width: 0%"></span>
                        </span>
                    </div>
                </div>
                
                <button class="nav-mobile-toggle" onclick="toggleMobileNav()">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>
    `;

    // Insert at the beginning of body
    document.body.insertAdjacentHTML('afterbegin', navHTML);

    // Update currency display from state
    updateNavbarFromState();
}

function updateNavbarFromState() {
    try {
        const state = JSON.parse(localStorage.getItem('synapse_state') || '{}');

        if (state.user) {
            const braincells = document.getElementById('nav-braincells');
            const darkmatter = document.getElementById('nav-darkmatter');
            const level = document.getElementById('nav-level');
            const xpFill = document.getElementById('nav-xp-fill');

            if (braincells) braincells.textContent = formatNumber(state.user.braincells || 0);
            if (darkmatter) darkmatter.textContent = state.user.darkmatter || 0;
            if (level) level.textContent = `LVL ${state.user.level || 1}`;

            // Calculate XP progress
            if (xpFill && state.user.xp !== undefined) {
                const xpForCurrentLevel = 1000 * Math.pow(1.15, (state.user.level || 1) - 1);
                const progress = ((state.user.xp % xpForCurrentLevel) / xpForCurrentLevel) * 100;
                xpFill.style.width = `${Math.min(progress, 100)}%`;
            }
        }
    } catch (e) {
        console.warn('Could not load state for navbar:', e);
    }
}

function toggleMobileNav() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('mobile-open');
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────────────────

function injectFooter() {
    const footerHTML = `
        <footer class="site-footer">
            <div class="footer-container">
                <div class="footer-brand">
                    <span class="footer-logo">🧠 SYNAPSE</span>
                    <span class="footer-tagline">Study Like a Game</span>
                </div>
                <div class="footer-links">
                    <a href="https://github.com/lavinisax/synapse" target="_blank">GitHub</a>
                    <span class="footer-divider">•</span>
                    <a href="index.html#features">Features</a>
                    <span class="footer-divider">•</span>
                    <a href="index.html#oracle">The Oracle</a>
                </div>
                <div class="footer-version">
                    <span>v1.0.0 Beta</span>
                </div>
            </div>
        </footer>
    `;

    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

// ─────────────────────────────────────────────────────────────────────────────
// TOAST NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────

let toastContainer = null;

function initToasts() {
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
}

function showToast(icon, message, type = 'success', duration = 3000) {
    initToasts();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('toast-show');
    });

    // Auto-remove
    setTimeout(() => {
        toast.classList.remove('toast-show');
        toast.classList.add('toast-hide');
        setTimeout(() => toast.remove(), 300);
    }, duration);

    return toast;
}

// Convenience functions
function showXPToast(amount) {
    showToast('⚡', `+${amount} XP`, 'xp');
}

function showBrainCellToast(amount) {
    showToast('🧠', `+${amount} BrainCells`, 'success');
}

function showStreakToast(count) {
    showToast('🔥', `Streak x${count}!`, 'streak');
}

function showErrorToast(message) {
    showToast('❌', message, 'error');
}

function showSuccessToast(message) {
    showToast('✅', message, 'success');
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTO-INIT
// ─────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    // Check if we should inject components (skip on landing page header)
    const skipNavPages = ['index.html', 'login.html', 'signup.html'];
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    if (!skipNavPages.includes(currentPage)) {
        injectNavbar();
        injectFooter();
    }

    // Always init toasts
    initToasts();

    console.log('🧩 Shared components initialized');
});

// Export for global access
window.showToast = showToast;
window.showXPToast = showXPToast;
window.showBrainCellToast = showBrainCellToast;
window.showStreakToast = showStreakToast;
window.showErrorToast = showErrorToast;
window.showSuccessToast = showSuccessToast;
window.updateNavbarFromState = updateNavbarFromState;
