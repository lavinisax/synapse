/* ═══════════════════════════════════════════════════════════════════════════
   SYNAPSE - Core Application Logic
   ═══════════════════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS & CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const SYNAPSE = {
  // XP & Leveling
  XP_PER_LEVEL: 1000,
  XP_GROWTH_RATE: 1.15, // Each level requires 15% more XP
  
  // Economy
  BRAINCELL_REWARDS: {
    arena_correct: 10,
    arena_streak: 5,
    dungeon_clear: 50,
    boss_defeat: 100,
    sensei_success: 75
  },
  
  DARKMATTER_REWARDS: {
    boss_defeat: 1,
    sensei_mastery: 2,
    raid_victory: 1
  },
  
  // Timer
  ARENA_TIME: 90, // seconds per question
  DUNGEON_TIME: 180,
  
  // Storage Keys
  STORAGE_KEY: 'synapse_data'
};

// ─────────────────────────────────────────────────────────────────────────────
// STATE MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

const defaultState = {
  user: {
    name: 'Scholar',
    level: 23,
    xp: 2450,
    braincells: 1250,
    darkmatter: 3
  },
  stats: {
    streak: 7,
    totalQuestions: 347,
    correctAnswers: 289,
    accuracy: 83,
    hoursStudied: 42
  },
  oracle: {
    predictedScore: 1420,
    targetScore: 1500,
    probability: 73,
    daysLeft: 45
  },
  quests: [
    { id: 1, title: 'Arena: Math Challenge', reward: 50, completed: false, type: 'arena' },
    { id: 2, title: 'Dungeon: Grammar Gauntlet', reward: 100, completed: false, type: 'dungeon' },
    { id: 3, title: 'Sensei: Algebra Mastery', reward: 150, completed: false, type: 'sensei' }
  ],
  skillTrees: {
    sat: {
      math: { progress: 65, nodes: 12, unlocked: 8 },
      reading: { progress: 45, nodes: 10, unlocked: 4 },
      writing: { progress: 55, nodes: 8, unlocked: 5 }
    }
  }
};

// Load state from localStorage or use default
function loadState() {
  try {
    const saved = localStorage.getItem(SYNAPSE.STORAGE_KEY);
    return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
  } catch {
    return defaultState;
  }
}

// Save state to localStorage
function saveState(state) {
  try {
    localStorage.setItem(SYNAPSE.STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save state:', e);
  }
}

// Global state
let state = loadState();

// ─────────────────────────────────────────────────────────────────────────────
// XP & LEVELING SYSTEM
// ─────────────────────────────────────────────────────────────────────────────

function getXPForLevel(level) {
  return Math.floor(SYNAPSE.XP_PER_LEVEL * Math.pow(SYNAPSE.XP_GROWTH_RATE, level - 1));
}

function getTotalXPForLevel(level) {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += getXPForLevel(i);
  }
  return total;
}

function getLevelFromXP(totalXP) {
  let level = 1;
  let xpNeeded = 0;
  while (xpNeeded + getXPForLevel(level) <= totalXP) {
    xpNeeded += getXPForLevel(level);
    level++;
  }
  return level;
}

function getLevelProgress(totalXP) {
  const level = getLevelFromXP(totalXP);
  const xpForCurrentLevel = getTotalXPForLevel(level);
  const xpForNextLevel = getTotalXPForLevel(level + 1);
  const xpIntoLevel = totalXP - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  return (xpIntoLevel / xpNeeded) * 100;
}

function addXP(amount) {
  const oldLevel = state.user.level;
  state.user.xp += amount;
  state.user.level = getLevelFromXP(state.user.xp);
  
  if (state.user.level > oldLevel) {
    showLevelUp(state.user.level);
  }
  
  saveState(state);
  updateUI();
}

// ─────────────────────────────────────────────────────────────────────────────
// ECONOMY SYSTEM
// ─────────────────────────────────────────────────────────────────────────────

function addBrainCells(amount) {
  state.user.braincells += amount;
  saveState(state);
  updateUI();
  showReward('🧠', amount);
}

function spendBrainCells(amount) {
  if (state.user.braincells >= amount) {
    state.user.braincells -= amount;
    saveState(state);
    updateUI();
    return true;
  }
  return false;
}

function addDarkMatter(amount) {
  state.user.darkmatter += amount;
  saveState(state);
  updateUI();
  showReward('💎', amount);
}

// ─────────────────────────────────────────────────────────────────────────────
// ORACLE SYSTEM
// ─────────────────────────────────────────────────────────────────────────────

function updateOracle(correctAnswers, totalQuestions) {
  const sessionAccuracy = (correctAnswers / totalQuestions) * 100;
  
  // Simple prediction model (would be more sophisticated with real AI)
  const baseScore = 1000;
  const maxScore = 1600;
  const accuracyWeight = (state.stats.accuracy + sessionAccuracy) / 2;
  
  state.oracle.predictedScore = Math.round(
    baseScore + ((maxScore - baseScore) * (accuracyWeight / 100))
  );
  
  // Update probability based on predicted vs target
  const scoreDiff = state.oracle.targetScore - state.oracle.predictedScore;
  const daysRemaining = state.oracle.daysLeft;
  
  // Simple probability calculation
  if (scoreDiff <= 0) {
    state.oracle.probability = 95;
  } else {
    const improvementNeeded = scoreDiff / daysRemaining;
    state.oracle.probability = Math.max(10, Math.min(90, 
      100 - (improvementNeeded * 5)
    ));
  }
  
  saveState(state);
  updateUI();
}

// ─────────────────────────────────────────────────────────────────────────────
// UI UPDATES
// ─────────────────────────────────────────────────────────────────────────────

function updateUI() {
  // Update XP bars
  const xpBars = document.querySelectorAll('.xp-bar-fill');
  const progress = getLevelProgress(state.user.xp);
  xpBars.forEach(bar => {
    bar.style.width = `${progress}%`;
  });
  
  // Update level badges
  const levelBadges = document.querySelectorAll('.level-value');
  levelBadges.forEach(badge => {
    badge.textContent = state.user.level;
  });
  
  // Update currency displays
  document.querySelectorAll('.braincell-value').forEach(el => {
    el.textContent = state.user.braincells.toLocaleString();
  });
  
  document.querySelectorAll('.darkmatter-value').forEach(el => {
    el.textContent = state.user.darkmatter;
  });
  
  // Update Oracle
  document.querySelectorAll('.oracle-score-value').forEach(el => {
    if (el.id === 'oracle-score') {
      animateNumber(el, parseInt(el.textContent) || 0, state.oracle.predictedScore);
    }
  });
  
  document.querySelectorAll('.oracle-probability-value').forEach(el => {
    if (el.id === 'oracle-prob') {
      el.textContent = `${state.oracle.probability}%`;
    }
  });
  
  // Update streak
  document.querySelectorAll('.streak-value').forEach(el => {
    el.textContent = state.stats.streak;
  });
}

function animateNumber(element, start, end, duration = 1000) {
  const startTime = performance.now();
  const diff = end - start;
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out quad
    const eased = 1 - Math.pow(1 - progress, 2);
    const current = Math.round(start + (diff * eased));
    
    element.textContent = current;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

function showReward(icon, amount) {
  const reward = document.createElement('div');
  reward.className = 'reward-popup';
  reward.innerHTML = `<span>${icon}</span> +${amount}`;
  reward.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--navy-mid);
    border: 1px solid var(--electric-blue);
    padding: 1rem 2rem;
    border-radius: 1rem;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--electric-blue);
    z-index: 1000;
    animation: slideUp 0.3s ease, fadeIn 0.3s ease;
  `;
  
  document.body.appendChild(reward);
  
  setTimeout(() => {
    reward.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => reward.remove(), 300);
  }, 1500);
}

function showLevelUp(newLevel) {
  const modal = document.createElement('div');
  modal.className = 'level-up-modal';
  modal.innerHTML = `
    <div class="level-up-content">
      <div class="level-up-icon">🎉</div>
      <h2>Level Up!</h2>
      <div class="new-level">${newLevel}</div>
      <p>Your brain just evolved.</p>
      <button class="btn btn-primary" onclick="this.closest('.level-up-modal').remove()">Continue</button>
    </div>
  `;
  modal.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(10, 14, 26, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `;
  
  const style = document.createElement('style');
  style.textContent = `
    .level-up-content {
      text-align: center;
      padding: 3rem;
      background: var(--navy-mid);
      border: 2px solid var(--electric-blue);
      border-radius: 1.5rem;
      animation: scaleIn 0.3s ease;
    }
    .level-up-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }
    .level-up-content h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
      color: var(--electric-blue);
    }
    .new-level {
      font-size: 5rem;
      font-weight: 700;
      font-family: var(--font-mono);
      background: linear-gradient(135deg, var(--electric-blue), var(--purple));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 1rem;
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(modal);
}

// ─────────────────────────────────────────────────────────────────────────────
// PARTICLES
// ─────────────────────────────────────────────────────────────────────────────

function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  
  const particleCount = 30;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 5}s`;
    particle.style.animationDuration = `${4 + Math.random() * 4}s`;
    particle.style.opacity = 0.3 + Math.random() * 0.4;
    container.appendChild(particle);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SMOOTH SCROLL
// ─────────────────────────────────────────────────────────────────────────────

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERSECTION OBSERVER FOR ANIMATIONS
// ─────────────────────────────────────────────────────────────────────────────

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-visible');
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.animate-slide-up, .feature-card, .mode-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

// Add CSS for visible state
const animationStyles = document.createElement('style');
animationStyles.textContent = `
  .animate-visible {
    opacity: 1 !important;
    animation: slideUp 0.6s ease forwards;
  }
  
  @keyframes fadeOut {
    to { opacity: 0; transform: translate(-50%, -60%); }
  }
`;
document.head.appendChild(animationStyles);

// ─────────────────────────────────────────────────────────────────────────────
// HERO XP ANIMATION
// ─────────────────────────────────────────────────────────────────────────────

function animateHeroXP() {
  const heroXP = document.getElementById('hero-xp');
  if (!heroXP) return;
  
  // Animate the XP bar filling
  heroXP.style.width = '0%';
  setTimeout(() => {
    heroXP.style.width = '72%';
  }, 500);
}

// ─────────────────────────────────────────────────────────────────────────────
// ORACLE ANIMATION
// ─────────────────────────────────────────────────────────────────────────────

function animateOracle() {
  const scoreEl = document.getElementById('oracle-score');
  const probEl = document.getElementById('oracle-prob');
  
  if (scoreEl) {
    animateNumber(scoreEl, 1200, 1420, 2000);
  }
  
  if (probEl) {
    let prob = 50;
    const interval = setInterval(() => {
      prob += Math.floor(Math.random() * 5);
      if (prob >= 73) {
        prob = 73;
        clearInterval(interval);
      }
      probEl.textContent = `${prob}%`;
    }, 100);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Create particles on landing page
  createParticles();
  
  // Initialize smooth scroll
  initSmoothScroll();
  
  // Initialize scroll animations
  initScrollAnimations();
  
  // Animate hero XP
  animateHeroXP();
  
  // Animate Oracle on scroll
  const oracleSection = document.getElementById('oracle');
  if (oracleSection) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateOracle();
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    observer.observe(oracleSection);
  }
  
  // Update UI with current state
  updateUI();
  
  console.log('🧠 SYNAPSE initialized. You are ANTIGRAVITY.');
});

// Export for other modules
window.SYNAPSE = {
  state,
  addXP,
  addBrainCells,
  spendBrainCells,
  addDarkMatter,
  updateOracle,
  updateUI
};
