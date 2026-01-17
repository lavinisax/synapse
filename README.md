<p align="center">
  <img src="https://img.shields.io/badge/Status-Beta-blueviolet?style=for-the-badge" alt="Status: Beta">
  <img src="https://img.shields.io/badge/Stack-Vanilla%20JS-yellow?style=for-the-badge&logo=javascript" alt="Vanilla JS">
  <img src="https://img.shields.io/badge/Deploy-Firebase-orange?style=for-the-badge&logo=firebase" alt="Firebase">
</p>

<h1 align="center">🧠 SYNAPSE</h1>
<h3 align="center">Study Like a Game. Win Real Scores.</h3>

<p align="center">
  An AI-powered educational RPG that turns SAT prep into an addictive adventure.<br>
  <strong>🎮 Gamified Learning • 🔥 Streak System • 🧙‍♂️ Sensei Mode</strong>
</p>

<p align="center">
  <a href="https://edu-synapse.web.app"><strong>🌐 Live Demo</strong></a> •
  <a href="#features"><strong>✨ Features</strong></a> •
  <a href="#getting-started"><strong>🚀 Get Started</strong></a>
</p>

---

## 🎯 What is SYNAPSE?

SYNAPSE transforms standardized test prep from a chore into a game you actually want to play. Built with vanilla JavaScript and zero frameworks — because constraints breed creativity.

**The Core Loop:**
```
Arena Battle → Instant Feedback → Weakness Vault → Sensei Explanation → XP & Streaks
```

---

## ✨ Features

### 🏟️ Arena Mode
Battle through SAT questions in timed rounds. Get instant feedback, earn XP, and build streaks.
- **Streak Multiplier**: 3+ correct in a row = bonus XP
- **Hint System**: Spend BrainCells to eliminate wrong answers
- **End Screen**: See exactly why you got questions wrong

### 🧙‍♂️ Sensei Mode (Feynman Learning)
Explain concepts like you're teaching a 10-year-old. Sensei evaluates your explanation with:
- Clarity & Correctness scores
- One compliment, one correction
- A follow-up question to deepen understanding

### 📊 The Oracle
Your AI-powered score predictor. Tracks accuracy, estimates your SAT score, and highlights weak topics.

### 💎 Economy System
- **BrainCells** 🧠 — Earned from correct answers, spent on hints
- **Dark Matter** 💠 — Premium currency for special features
- **XP & Levels** — Progress through an RPG-style leveling system

### 🎯 Weakness Vault
Missed questions aren't lost — they're saved. Train on your weak spots until you master them.

---

## 🚀 Getting Started

### Live Demo
👉 **https://edu-synapse.web.app**

### Run Locally
```bash
# Clone the repo
git clone https://github.com/lavinisax/synapse.git
cd synapse

# Open in browser (no build step needed!)
open index.html
# or use a local server
npx serve .
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vanilla HTML/CSS/JS |
| Styling | Custom CSS Design System |
| State | localStorage |
| Hosting | Firebase Hosting |
| CI/CD | GitHub Actions |

**Why vanilla?** Because a polished vanilla app is more impressive than a messy React one. No frameworks, no excuses.

---

## 📁 Project Structure

```
synapse/
├── index.html          # Landing page
├── dashboard.html      # User dashboard
├── arena.html          # Question battles
├── sensei.html         # Feynman learning mode
├── profile.html        # Player stats & skill tree
├── login.html          # Authentication
├── signup.html         # Registration
├── css/
│   ├── design-system.css   # Variables, tokens, utilities
│   ├── components.css      # Reusable UI components
│   └── pages.css           # Page-specific styles
└── js/
    ├── app.js              # Core game state & XP system
    ├── arena.js            # Arena battle logic
    ├── sensei.js           # Sensei dialogue system
    ├── auth.js             # Authentication logic
    ├── antigravity.js      # AI integration
    └── data/
        └── questions.js    # SAT question bank
```

---

## 🗺️ Roadmap

### ✅ Done
- [x] Multi-page static site
- [x] XP & Leveling system
- [x] Arena with timer & hints
- [x] Sensei Feynman mode
- [x] BrainCells economy
- [x] Firebase hosting + GitHub CI/CD

### 🔨 In Progress
- [ ] Weakness Vault (save missed Qs)
- [ ] Streak multiplier bonus
- [ ] Dashboard "Next Action" card
- [ ] Shared navbar/footer injection

### 🔮 Future
- [ ] OpenAI/Gemini API integration for Sensei
- [ ] Leaderboards
- [ ] Daily challenges
- [ ] Mobile app (PWA)

---

## 🤝 Contributing

This is a portfolio project, but feedback is welcome! Open an issue or PR.

---

## 📄 License

MIT License — do whatever you want with it.

---

<p align="center">
  Built with 🧠 by <a href="https://github.com/lavinisax">@lavinisax</a>
</p>
