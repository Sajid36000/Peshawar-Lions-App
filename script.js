// ===== MAIN APP CONTROLLER =====
class PeshawarLionsApp {
  constructor() {
    // Data Properties
    this.players = [];
    this.matches = [];
    this.stats = [];
    this.feedPosts = [];
    this.currentUser = null;
    this.isDarkMode = false;
    
    // Match Scoring
    this.currentMatch = null;
    this.currentInnings = 1;
    this.currentBattingTeam = 'peshawar';
    this.currentOver = [];
    this.inningsData = {
      1: { team: 'peshawar', score: 0, wickets: 0, overs: 0, balls: 0, batsmen: {}, bowlers: {} },
      2: { team: 'opponent', score: 0, wickets: 0, overs: 0, balls: 0, batsmen: {}, bowlers: {} }
    };

    // DOM Elements
    this.dom = {
      splashScreen: document.getElementById('splash-screen'),
      appContainer: document.querySelector('.app-container'),
      sidebarLinks: document.querySelectorAll('.sidebar nav li'),
      contentSections: document.querySelectorAll('.content-section'),
      themeToggle: document.querySelector('.theme-toggle'),
      mobileNavItems: document.querySelectorAll('.mobile-navbar .nav-item')
    };
  }

  // ===== CORE METHODS =====
  init() {
    this.loadData();
    this.setupEventListeners();
    this.checkAuth();
    this.showSection('dashboard');
    this.renderPlayers();
    this.renderMatches();
    this.renderLeaderboards();
    this.renderDashboard();
    this.setupMobileNav();
    this.hideSplashScreen();
  }

  hideSplashScreen() {
    setTimeout(() => {
      this.dom.splashScreen.style.opacity = '0';
      this.dom.appContainer.style.display = 'flex';
      setTimeout(() => {
        this.dom.splashScreen.style.display = 'none';
        this.playRoarSound();
      }, 1000);
    }, 3500);
  }

  playRoarSound() {
    // Implementation for sound effect
    console.log("Lion roar sound would play here");
    // const roar = new Audio('assets/lion-roar.mp3');
    // roar.volume = 0.3;
    // roar.play().catch(e => console.log("Sound prevented:", e));
  }

  // ===== DATA MANAGEMENT =====
  loadData() {
    this.players = JSON.parse(localStorage.getItem('peshawarLionsPlayers')) || [];
    this.matches = JSON.parse(localStorage.getItem('peshawarLionsMatches')) || [];
    this.stats = JSON.parse(localStorage.getItem('peshawarLionsStats')) || [];
    this.feedPosts = JSON.parse(localStorage.getItem('peshawarLionsFeed')) || [];
    this.currentUser = JSON.parse(localStorage.getItem('peshawarLionsUser'));
    
    const savedTheme = localStorage.getItem('peshawarLionsTheme');
    if (savedTheme === 'dark') this.toggleDarkMode(true);
  }

  saveData() {
    localStorage.setItem('peshawarLionsPlayers', JSON.stringify(this.players));
    localStorage.setItem('peshawarLionsMatches', JSON.stringify(this.matches));
    localStorage.setItem('peshawarLionsStats', JSON.stringify(this.stats));
    localStorage.setItem('peshawarLionsFeed', JSON.stringify(this.feedPosts));
    localStorage.setItem('peshawarLionsUser', JSON.stringify(this.currentUser));
    localStorage.setItem('peshawarLionsTheme', this.isDarkMode ? 'dark' : 'light');
  }

  // ===== PLAYER MANAGEMENT =====
  addPlayer(playerData) {
    const newPlayer = {
      id: this.generateId(),
      ...playerData,
      createdAt: new Date().toISOString()
    };
    this.players.push(newPlayer);
    this.initializePlayerStats(newPlayer.id);
    this.saveData();
    this.renderPlayers();
    this.showNotification('Player added successfully!');
  }

  initializePlayerStats(playerId) {
    this.stats.push({
      playerId,
      batting: { matches: 0, innings: 0, runs: 0, highest: 0, average: 0, strikeRate: 0 },
      bowling: { matches: 0, innings: 0, wickets: 0, best: "0/0", average: 0, economy: 0 }
    });
  }

  // ===== MATCH MANAGEMENT =====
  startNewMatch(matchData) {
    const newMatch = {
      id: this.generateId(),
      ...matchData,
      status: 'upcoming',
      createdAt: new Date().toISOString(),
      opponentSquad: []
    };
    this.matches.push(newMatch);
    this.saveData();
    this.renderMatches();
    this.showNotification('Match scheduled successfully!');
  }

  recordMatchScore(matchId, scorecard) {
    const match = this.matches.find(m => m.id === matchId);
    if (match) {
      match.scorecard = scorecard;
      match.status = 'completed';
      match.completedAt = new Date().toISOString();
      this.updatePlayerStatsFromMatch(match);
      this.saveData();
      this.renderMatches();
      this.renderLeaderboards();
      this.showNotification('Scorecard saved successfully!');
    }
  }

  // ===== STATISTICS CALCULATION =====
  updatePlayerStatsFromMatch(match) {
    if (!match.scorecard) return;

    // Process batting stats
    match.scorecard.batsmen.forEach(batsman => {
      const playerStats = this.getPlayerStats(batsman.playerId);
      if (playerStats) {
        playerStats.batting.matches = this.countPlayerMatches(batsman.playerId);
        playerStats.batting.innings += 1;
        playerStats.batting.runs += batsman.runs || 0;
        if (batsman.runs > playerStats.batting.highest) {
          playerStats.batting.highest = batsman.runs;
        }
        this.calculateBattingAverages(playerStats);
      }
    });

    // Process bowling stats
    match.scorecard.bowlers.forEach(bowler => {
      const playerStats = this.getPlayerStats(bowler.playerId);
      if (playerStats) {
        playerStats.bowling.matches = this.countPlayerMatches(bowler.playerId, true);
        playerStats.bowling.innings += 1;
        playerStats.bowling.wickets += bowler.wickets || 0;
        this.updateBestBowlingFigures(playerStats, bowler.wickets, bowler.runs);
        this.calculateBowlingAverages(playerStats);
      }
    });
  }

  // ===== UI RENDERING =====
  renderPlayers() {
    const container = document.getElementById('players-container');
    container.innerHTML = this.players.map(player => {
      const stats = this.getPlayerStats(player.id);
      return `
        <div class="player-card">
          <div class="player-photo">
            ${player.photo ? `<img src="${player.photo}" alt="${player.name}">` : ''}
          </div>
          <div class="player-details">
            <h3>${player.name}</h3>
            <span class="player-role role-${player.role}">${this.formatRole(player.role)}</span>
            ${this.renderPlayerStats(stats)}
          </div>
        </div>
      `;
    }).join('');
  }

  renderPlayerStats(stats) {
    return `
      <div class="player-stats">
        <div class="stat">
          <span class="value">${stats?.batting?.runs || 0}</span>
          <span class="label">Runs</span>
        </div>
        <div class="stat">
          <span class="value">${stats?.bowling?.wickets || 0}</span>
          <span class="label">Wickets</span>
        </div>
      </div>
    `;
  }

  // ===== UTILITIES =====
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  showNotification(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  formatRole(role) {
    const roles = {
      'batsman': 'Batsman',
      'bowler': 'Bowler',
      'all-rounder': 'All-Rounder',
      'keeper': 'Wicket Keeper'
    };
    return roles[role] || role;
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new PeshawarLionsApp();
  app.init();
  window.app = app; // Make available globally for debugging
});
