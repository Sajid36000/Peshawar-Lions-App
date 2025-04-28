// Main App Controller
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the app
    const app = new PeshawarLionsApp();
    app.init();
});

class PeshawarLionsApp {
    constructor() {
        this.players = [];
        this.matches = [];
        this.stats = [];
        this.currentUser = null;
        this.isDarkMode = false;
        
        // DOM Elements
        this.dom = {
            sidebarLinks: document.querySelectorAll('.sidebar nav li'),
            contentSections: document.querySelectorAll('.content-section'),
            themeToggle: document.querySelector('.theme-toggle'),
            addPlayerBtn: document.getElementById('add-new-player'),
            addMatchBtn: document.getElementById('add-new-match'),
            playerModal: document.getElementById('player-modal'),
            matchModal: document.getElementById('match-modal'),
            scorecardModal: document.getElementById('scorecard-modal'),
            loginModal: document.getElementById('login-modal'),
            playerForm: document.getElementById('player-form'),
            matchForm: document.getElementById('match-form'),
            loginForm: document.getElementById('login-form'),
            playersContainer: document.getElementById('players-container'),
            matchesList: document.getElementById('matches-list'),
            playerSearch: document.getElementById('player-search'),
            playerRoleFilter: document.getElementById('player-role-filter'),
            tabBtns: document.querySelectorAll('.tab-btn'),
            leaderboardTabs: document.querySelectorAll('.leaderboard-tab'),
            leaderboards: document.querySelectorAll('.leaderboard'),
            adminTabBtns: document.querySelectorAll('.admin-tab-btn'),
            adminTabContents: document.querySelectorAll('.admin-tab-content'),
            scorecardTabs: document.querySelectorAll('.scorecard-tab'),
            scorecardTabContents: document.querySelectorAll('.scorecard-tab-content'),
            toast: document.getElementById('notification-toast'),
            statsPlayerSelect: document.getElementById('stats-player-select'),
            battingGraph: document.getElementById('batting-graph'),
            bowlingGraph: document.getElementById('bowling-graph')
        };
        
        // Initialize Chart.js instances
        this.battingChart = null;
        this.bowlingChart = null;
        
        // Current match being scored
        this.currentMatch = null;
        this.currentInnings = 1;
        this.currentBattingTeam = 'peshawar';
        this.currentOver = [];
        this.inningsData = {
            1: { team: 'peshawar', score: 0, wickets: 0, overs: 0, balls: 0, batsmen: {}, bowlers: {} },
            2: { team: 'opponent', score: 0, wickets: 0, overs: 0, balls: 0, batsmen: {}, bowlers: {} }
        };
    }
    
    init() {
        // Load data from localStorage
        this.loadData();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Check if user is logged in
        this.checkAuth();
        
        // Show dashboard by default
        this.showSection('dashboard');
        
        // Render initial data
        this.renderPlayers();
        this.renderMatches();
        this.populatePlayerSelect();
        this.renderLeaderboards();
        this.renderDashboard();
    }
    
    loadData() {
        // Load players
        const savedPlayers = localStorage.getItem('peshawarLionsPlayers');
        if (savedPlayers) {
            this.players = JSON.parse(savedPlayers);
        }
        
        // Load matches
        const savedMatches = localStorage.getItem('peshawarLionsMatches');
        if (savedMatches) {
            this.matches = JSON.parse(savedMatches);
        }
        
        // Load stats
        const savedStats = localStorage.getItem('peshawarLionsStats');
        if (savedStats) {
            this.stats = JSON.parse(savedStats);
        }
        
        // Load user
        const savedUser = localStorage.getItem('peshawarLionsUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
        
        // Load theme preference
        const savedTheme = localStorage.getItem('peshawarLionsTheme');
        if (savedTheme === 'dark') {
            this.toggleDarkMode(true);
        }
    }
    
    saveData() {
        localStorage.setItem('peshawarLionsPlayers', JSON.stringify(this.players));
        localStorage.setItem('peshawarLionsMatches', JSON.stringify(this.matches));
        localStorage.setItem('peshawarLionsStats', JSON.stringify(this.stats));
        localStorage.setItem('peshawarLionsUser', JSON.stringify(this.currentUser));
    }
    
    setupEventListeners() {
        // Sidebar navigation
        this.dom.sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const section = e.currentTarget.getAttribute('data-section');
                this.showSection(section);
                
                // Update active state
                this.dom.sidebarLinks.forEach(l => l.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });
        
        // Theme toggle
        this.dom.themeToggle.addEventListener('click', () => {
            this.toggleDarkMode();
        });
        
        // Player management
        this.dom.addPlayerBtn.addEventListener('click', () => {
            this.showPlayerModal();
        });
        
        this.dom.playerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePlayer();
        });
        
        this.dom.playerSearch.addEventListener('input', () => {
            this.renderPlayers();
        });
        
        this.dom.playerRoleFilter.addEventListener('change', () => {
            this.renderPlayers();
        });
        
        // Match management
        this.dom.addMatchBtn.addEventListener('click', () => {
            this.showMatchModal();
        });
        
        this.dom.matchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveMatch();
        });
        
        // Tabs
        this.dom.tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.getAttribute('data-tab');
                this.switchMatchesTab(tab);
            });
        });
        
        // Leaderboard tabs
        this.dom.leaderboardTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const board = e.currentTarget.getAttribute('data-board');
                this.switchLeaderboardTab(board);
            });
        });
        
        // Admin tabs
        this.dom.adminTabBtns.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.getAttribute('data-admin-tab');
                this.switchAdminTab(tabName);
            });
        });
        
        // Scorecard tabs
        this.dom.scorecardTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.getAttribute('data-scorecard');
                this.switchScorecardTab(tabName);
            });
        });
        
        // Modal close buttons
        document.querySelectorAll('.close-btn, .cancel-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModal(btn.closest('.modal'));
            });
        });
        
        // Quick action buttons
        document.getElementById('add-player-btn').addEventListener('click', () => {
            this.showPlayerModal();
        });
        
        document.getElementById('create-match-btn').addEventListener('click', () => {
            this.showMatchModal();
        });
        
        document.getElementById('record-score-btn').addEventListener('click', () => {
            this.showScorecardModal();
        });
        
        // Stats filters
        document.getElementById('apply-stats-filter').addEventListener('click', () => {
            this.renderPlayerStats();
        });
        
        // Scorecard controls
        document.getElementById('innings-select').addEventListener('change', (e) => {
            this.currentInnings = parseInt(e.target.value);
            this.updateInningsDisplay();
        });
        
        document.getElementById('batting-team-select').addEventListener('change', (e) => {
            this.currentBattingTeam = e.target.value;
            this.updatePlayerSelects();
        });
        
        // Score buttons
        document.querySelectorAll('.score-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const runs = parseInt(e.currentTarget.getAttribute('data-runs'));
                this.recordBall(runs, 'normal');
            });
        });
        
        document.querySelectorAll('.extra-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const extra = e.currentTarget.getAttribute('data-extra');
                this.recordBall(0, extra);
            });
        });
        
        document.querySelectorAll('.wicket-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const wicketType = e.currentTarget.getAttribute('data-wicket');
                this.recordWicket(wicketType);
            });
        });
        
        document.getElementById('undo-ball').addEventListener('click', () => {
            this.undoLastBall();
        });
        
        document.getElementById('end-innings').addEventListener('click', () => {
            this.endInnings();
        });
        
        document.getElementById('save-scorecard').addEventListener('click', () => {
            this.saveScorecard();
        });
        
        // Admin actions
        document.getElementById('edit-players-btn').addEventListener('click', () => {
            this.showSection('players');
        });
        
        document.getElementById('edit-matches-btn').addEventListener('click', () => {
            this.showSection('matches');
        });
        
        document.getElementById('update-stats-btn').addEventListener('click', () => {
            this.calculateAllStats();
            this.showNotification('Player statistics updated successfully');
        });
        
        document.getElementById('import-btn').addEventListener('click', () => {
            this.importData();
        });
        
        document.getElementById('export-btn').addEventListener('click', () => {
            this.exportData();
        });
        
        document.getElementById('save-settings').addEventListener('click', () => {
            this.saveSettings();
        });
        
        // Login form
        if (this.dom.loginForm) {
            this.dom.loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
        
        // Click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });
    }
    
    showSection(sectionId) {
        // Hide all sections
        this.dom.contentSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show the selected section
        document.getElementById(sectionId).classList.add('active');
        
        // Special handling for certain sections
        if (sectionId === 'stats') {
            this.renderPlayerStats();
        } else if (sectionId === 'admin' && !this.currentUser) {
            this.showLoginModal();
            this.showSection('dashboard');
        }
    }
    
    toggleDarkMode(force = null) {
        if (force !== null) {
            this.isDarkMode = force;
        } else {
            this.isDarkMode = !this.isDarkMode;
        }
        
        if (this.isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('peshawarLionsTheme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('peshawarLionsTheme', 'light');
        }
    }
    
    // Player Management
    showPlayerModal(player = null) {
        const modal = this.dom.playerModal;
        const form = this.dom.playerForm;
        
        if (player) {
            // Edit existing player
            document.getElementById('player-modal-title').textContent = 'Edit Player';
            document.getElementById('player-id').value = player.id;
            document.getElementById('player-name').value = player.name;
            document.getElementById('player-role').value = player.role;
            document.getElementById('player-batting-style').value = player.battingStyle || '';
            document.getElementById('player-bowling-style').value = player.bowlingStyle || '';
            document.getElementById('player-jersey').value = player.jerseyNumber || '';
            document.getElementById('player-dob').value = player.dob || '';
            document.getElementById('player-phone').value = player.phone || '';
            document.getElementById('player-email').value = player.email || '';
            
            // Photo preview
            const photoPreview = document.getElementById('player-photo-preview');
            if (player.photo) {
                photoPreview.innerHTML = `<img src="${player.photo}" alt="${player.name}">`;
            } else {
                photoPreview.innerHTML = '<i class="fas fa-user" style="font-size: 3rem;"></i>';
            }
        } else {
            // Add new player
            document.getElementById('player-modal-title').textContent = 'Add New Player';
            form.reset();
            document.getElementById('player-photo-preview').innerHTML = '<i class="fas fa-user" style="font-size: 3rem;"></i>';
        }
        
        this.showModal(modal);
    }
    
    savePlayer() {
        const form = this.dom.playerForm;
        const playerId = document.getElementById('player-id').value;
        const playerData = {
            name: document.getElementById('player-name').value,
            role: document.getElementById('player-role').value,
            battingStyle: document.getElementById('player-batting-style').value,
            bowlingStyle: document.getElementById('player-bowling-style').value,
            jerseyNumber: document.getElementById('player-jersey').value,
            dob: document.getElementById('player-dob').value,
            phone: document.getElementById('player-phone').value,
            email: document.getElementById('player-email').value,
            photo: ''
        };
        
        // Handle photo upload
        const photoInput = document.getElementById('player-photo');
        if (photoInput.files.length > 0) {
            const file = photoInput.files[0];
            const reader = new FileReader();
            
            reader.onload = (e) => {
                playerData.photo = e.target.result;
                this.finalizePlayerSave(playerId, playerData);
            };
            
            reader.readAsDataURL(file);
        } else {
            // Keep existing photo if editing and no new photo uploaded
            if (playerId) {
                const existingPlayer = this.players.find(p => p.id === playerId);
                if (existingPlayer) {
                    playerData.photo = existingPlayer.photo;
                }
            }
            this.finalizePlayerSave(playerId, playerData);
        }
    }
    
    finalizePlayerSave(playerId, playerData) {
        if (playerId) {
            // Update existing player
            const index = this.players.findIndex(p => p.id === playerId);
            if (index !== -1) {
                this.players[index] = { ...this.players[index], ...playerData };
                this.showNotification('Player updated successfully');
            }
        } else {
            // Add new player
            playerData.id = this.generateId();
            playerData.createdAt = new Date().toISOString();
            this.players.push(playerData);
            this.showNotification('Player added successfully');
        }
        
        this.saveData();
        this.renderPlayers();
        this.populatePlayerSelect();
        this.renderLeaderboards();
        this.closeModal(this.dom.playerModal);
    }
    
    deletePlayer(playerId) {
        if (confirm('Are you sure you want to delete this player?')) {
            this.players = this.players.filter(p => p.id !== playerId);
            this.saveData();
            this.renderPlayers();
            this.populatePlayerSelect();
            this.renderLeaderboards();
            this.showNotification('Player deleted successfully');
        }
    }
    
    renderPlayers() {
        const searchTerm = this.dom.playerSearch.value.toLowerCase();
        const roleFilter = this.dom.playerRoleFilter.value;
        
        const filteredPlayers = this.players.filter(player => {
            const matchesSearch = player.name.toLowerCase().includes(searchTerm);
            const matchesRole = roleFilter === 'all' || player.role === roleFilter;
            return matchesSearch && matchesRole;
        });
        
        this.dom.playersContainer.innerHTML = '';
        
        if (filteredPlayers.length === 0) {
            this.dom.playersContainer.innerHTML = '<p class="no-results">No players found. Add a new player to get started.</p>';
            return;
        }
        
        filteredPlayers.forEach(player => {
            const playerCard = document.createElement('div');
            playerCard.className = 'player-card';
            
            // Get player stats
            const playerStats = this.stats.filter(s => s.playerId === player.id)[0] || {};
            const battingStats = playerStats.batting || {};
            const bowlingStats = playerStats.bowling || {};
            
            playerCard.innerHTML = `
                <div class="player-photo">
                    ${player.photo ? `<img src="${player.photo}" alt="${player.name}">` : 
                    '<i class="fas fa-user"></i>'}
                </div>
                <div class="player-details">
                    <h3 class="player-name">${player.name}</h3>
                    <span class="player-role">${this.formatRole(player.role)}</span>
                    <div class="player-stats">
                        <div class="player-stat">
                            <span class="value">${battingStats.runs || 0}</span>
                            <span class="label">Runs</span>
                        </div>
                        <div class="player-stat">
                            <span class="value">${battingStats.average ? battingStats.average.toFixed(2) : '-'}</span>
                            <span class="label">Avg</span>
                        </div>
                        <div class="player-stat">
                            <span class="value">${bowlingStats.wickets || 0}</span>
                            <span class="label">Wkts</span>
                        </div>
                    </div>
                    <div class="player-actions">
                        <button class="player-btn edit-btn" data-id="${player.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="player-btn delete-btn" data-id="${player.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
            
            this.dom.playersContainer.appendChild(playerCard);
        });
        
        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const playerId = e.currentTarget.getAttribute('data-id');
                const player = this.players.find(p => p.id === playerId);
                this.showPlayerModal(player);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const playerId = e.currentTarget.getAttribute('data-id');
                this.deletePlayer(playerId);
            });
        });
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
    
    // Match Management
    showMatchModal(match = null) {
        const modal = this.dom.matchModal;
        const form = this.dom.matchForm;
        
        if (match) {
            // Edit existing match
            document.getElementById('match-modal-title').textContent = 'Edit Match';
            document.getElementById('match-id').value = match.id;
            document.getElementById('match-opponent').value = match.opponent;
            document.getElementById('match-date').value = match.date;
            document.getElementById('match-time').value = match.time;
            document.getElementById('match-location').value = match.location;
            document.getElementById('match-type').value = match.type;
            document.getElementById('match-format').value = match.format;
            document.getElementById('match-notes').value = match.notes || '';
        } else {
            // Add new match
            document.getElementById('match-modal-title').textContent = 'Add New Match';
            form.reset();
            document.getElementById('match-date').value = new Date().toISOString().split('T')[0];
            document.getElementById('match-time').value = '14:00';
        }
        
        this.showModal(modal);
    }
    
    saveMatch() {
        const form = this.dom.matchForm;
        const matchId = document.getElementById('match-id').value;
        const matchData = {
            opponent: document.getElementById('match-opponent').value,
            date: document.getElementById('match-date').value,
            time: document.getElementById('match-time').value,
            location: document.getElementById('match-location').value,
            type: document.getElementById('match-type').value,
            format: document.getElementById('match-format').value,
            notes: document.getElementById('match-notes').value,
            status: 'upcoming',
            createdAt: new Date().toISOString()
        };
        
        if (matchId) {
            // Update existing match
            const index = this.matches.findIndex(m => m.id === matchId);
            if (index !== -1) {
                this.matches[index] = { ...this.matches[index], ...matchData };
                this.showNotification('Match updated successfully');
            }
        } else {
            // Add new match
            matchData.id = this.generateId();
            this.matches.push(matchData);
            this.showNotification('Match added successfully');
        }
        
        this.saveData();
        this.renderMatches();
        this.renderDashboard();
        this.closeModal(this.dom.matchModal);
    }
    
    deleteMatch(matchId) {
        if (confirm('Are you sure you want to delete this match?')) {
            this.matches = this.matches.filter(m => m.id !== matchId);
            this.saveData();
            this.renderMatches();
            this.renderDashboard();
            this.showNotification('Match deleted successfully');
        }
    }
    
    renderMatches() {
        const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
        const now = new Date();
        
        let filteredMatches = [];
        if (activeTab === 'upcoming') {
            filteredMatches = this.matches.filter(match => {
                const matchDate = new Date(`${match.date}T${match.time}`);
                return match.status === 'upcoming' && matchDate > now;
            });
        } else {
            filteredMatches = this.matches.filter(match => {
                const matchDate = new Date(`${match.date}T${match.time}`);
                return match.status === 'completed' || matchDate <= now;
            });
        }
        
        // Sort matches by date (upcoming first for upcoming tab, most recent first for completed)
        filteredMatches.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return activeTab === 'upcoming' ? dateA - dateB : dateB - dateA;
        });
        
        this.dom.matchesList.innerHTML = '';
        
        if (filteredMatches.length === 0) {
            this.dom.matchesList.innerHTML = `
                <p class="no-results">
                    ${activeTab === 'upcoming' ? 
                      'No upcoming matches. Add a new match to get started.' : 
                      'No completed matches yet.'}
                </p>
            `;
            return;
        }
        
        filteredMatches.forEach(match => {
            const matchDate = new Date(`${match.date}T${match.time}`);
            const isCompleted = match.status === 'completed' || matchDate <= now;
            
            const matchCard = document.createElement('div');
            matchCard.className = 'match-card';
            
            matchCard.innerHTML = `
                <div class="match-header">
                    <div class="match-teams">Peshawar Lions vs ${match.opponent}</div>
                    <div class="match-date">${this.formatDate(match.date)} at ${match.time}</div>
                </div>
                <div class="match-details">
                    <div class="match-info">
                        <div class="label">Location:</div>
                        <div class="value">${match.location}</div>
                    </div>
                    <div class="match-info">
                        <div class="label">Type:</div>
                        <div class="value">${this.formatMatchType(match.type)}</div>
                    </div>
                    <div class="match-info">
                        <div class="label">Format:</div>
                        <div class="value">${match.format.toUpperCase()}</div>
                    </div>
                    <span class="match-status ${isCompleted ? 'completed' : 'upcoming'}">
                        ${isCompleted ? 'Completed' : 'Upcoming'}
                    </span>
                    <div class="match-actions">
                        ${isCompleted ? 
                            `<button class="match-btn view-btn" data-id="${match.id}">
                                <i class="fas fa-eye"></i> View
                            </button>` :
                            `<button class="match-btn score-btn" data-id="${match.id}">
                                <i class="fas fa-clipboard-list"></i> Score
                            </button>`
                        }
                        <button class="match-btn edit-btn" data-id="${match.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="match-btn delete-btn" data-id="${match.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
            
            this.dom.matchesList.appendChild(matchCard);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.score-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const matchId = e.currentTarget.getAttribute('data-id');
                const match = this.matches.find(m => m.id === matchId);
                this.startScoring(match);
            });
        });
        
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const matchId = e.currentTarget.getAttribute('data-id');
                const match = this.matches.find(m => m.id === matchId);
                this.viewScorecard(match);
            });
        });
        
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const matchId = e.currentTarget.getAttribute('data-id');
                const match = this.matches.find(m => m.id === matchId);
                this.showMatchModal(match);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const matchId = e.currentTarget.getAttribute('data-id');
                this.deleteMatch(matchId);
            });
        });
    }
    
    switchMatchesTab(tab) {
        this.dom.tabBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tab') === tab) {
                btn.classList.add('active');
            }
        });
        
        this.renderMatches();
    }
    
    formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
    
    formatMatchType(type) {
        const types = {
            'friendly': 'Friendly',
            'league': 'League',
            'tournament': 'Tournament'
        };
        return types[type] || type;
    }
    
    // Statistics
    populatePlayerSelect() {
        const select = this.dom.statsPlayerSelect;
        select.innerHTML = '<option value="">Select Player</option>';
        
        this.players.forEach(player => {
            const option = document.createElement('option');
            option.value = player.id;
            option.textContent = player.name;
            select.appendChild(option);
        });
    }
    
    renderPlayerStats() {
        const playerId = this.dom.statsPlayerSelect.value;
        const matchType = document.getElementById('stats-match-type').value;
        const startDate = document.getElementById('stats-start-date').value;
        const endDate = document.getElementById('stats-end-date').value;
        
        if (!playerId) {
            document.getElementById('player-stats-display').style.display = 'none';
            return;
        }
        
        document.getElementById('player-stats-display').style.display = 'block';
        
        const player = this.players.find(p => p.id === playerId);
        const playerStats = this.stats.filter(s => s.playerId === playerId)[0] || {};
        const battingStats = playerStats.batting || {};
        const bowlingStats = playerStats.bowling || {};
        
        // Filter stats by date and match type if specified
        let filteredBattingStats = {};
        let filteredBowlingStats = {};
        
        if (matchType !== 'all' || startDate || endDate) {
            // Implement filtering logic if needed
            // This would require more detailed stat tracking per match
        } else {
            filteredBattingStats = battingStats;
            filteredBowlingStats = bowlingStats;
        }
        
        // Update player profile
        document.getElementById('stats-player-name').textContent = player.name;
        document.getElementById('stats-player-role').textContent = this.formatRole(player.role);
        
        if (player.photo) {
            document.getElementById('stats-player-img').src = player.photo;
            document.getElementById('stats-player-img').style.display = 'block';
        } else {
            document.getElementById('stats-player-img').style.display = 'none';
        }
        
        // Update batting stats
        document.getElementById('bat-matches').textContent = filteredBattingStats.matches || 0;
        document.getElementById('bat-innings').textContent = filteredBattingStats.innings || 0;
        document.getElementById('bat-runs').textContent = filteredBattingStats.runs || 0;
        document.getElementById('bat-highest').textContent = filteredBattingStats.highest || '-';
        document.getElementById('bat-avg').textContent = filteredBattingStats.average ? filteredBattingStats.average.toFixed(2) : '-';
        document.getElementById('bat-sr').textContent = filteredBattingStats.strikeRate ? filteredBattingStats.strikeRate.toFixed(2) : '-';
        
        // Update bowling stats
        document.getElementById('bowl-matches').textContent = filteredBowlingStats.matches || 0;
        document.getElementById('bowl-innings').textContent = filteredBowlingStats.innings || 0;
        document.getElementById('bowl-wickets').textContent = filteredBowlingStats.wickets || 0;
        document.getElementById('bowl-best').textContent = filteredBowlingStats.best || '-';
        document.getElementById('bowl-avg').textContent = filteredBowlingStats.average ? filteredBowlingStats.average.toFixed(2) : '-';
        document.getElementById('bowl-eco').textContent = filteredBowlingStats.economy ? filteredBowlingStats.economy.toFixed(2) : '-';
        
        // Update charts
        this.updateCharts(playerId);
    }
    
    updateCharts(playerId) {
        // This would be more sophisticated with actual match-by-match data
        // For now, we'll just show some sample data
        
        // Batting chart
        if (this.battingChart) {
            this.battingChart.destroy();
        }
        
        const battingCtx = document.getElementById('batting-graph').getContext('2d');
        this.battingChart = new Chart(battingCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Runs per Match',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: 'rgba(26, 82, 118, 0.2)',
                    borderColor: 'rgba(26, 82, 118, 1)',
                    borderWidth: 2,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Batting Performance Trend'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        
        // Bowling chart
        if (this.bowlingChart) {
            this.bowlingChart.destroy();
        }
        
        const bowlingCtx = document.getElementById('bowling-graph').getContext('2d');
        this.bowlingChart = new Chart(bowlingCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Wickets per Match',
                    data: [1, 2, 1, 1, 3, 0],
                    backgroundColor: 'rgba(243, 156, 18, 0.7)',
                    borderColor: 'rgba(243, 156, 18, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Bowling Performance Trend'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    calculateAllStats() {
        // This would calculate stats for all players based on match data
        // For now, we'll just generate some sample stats
        
        this.stats = [];
        
        this.players.forEach(player => {
            const matchesPlayed = Math.floor(Math.random() * 10) + 1;
            const isBatsman = player.role === 'batsman' || player.role === 'all-rounder' || player.role === 'keeper';
            const isBowler = player.role === 'bowler' || player.role === 'all-rounder';
            
            const playerStats = {
                playerId: player.id,
                batting: {},
                bowling: {}
            };
            
            if (isBatsman) {
                const innings = matchesPlayed;
                const runs = Math.floor(Math.random() * 300) + 50;
                const highest = Math.floor(Math.random() * 50) + 30;
                const average = runs / innings;
                const strikeRate = Math.floor(Math.random() * 50) + 70;
                
                playerStats.batting = {
                    matches: matchesPlayed,
                    innings: innings,
                    runs: runs,
                    highest: highest,
                    average: average,
                    strikeRate: strikeRate
                };
            }
            
            if (isBowler) {
                const innings = matchesPlayed;
                const wickets = Math.floor(Math.random() * 15) + 1;
                const best = `${Math.floor(Math.random() * 3) + 2}/${Math.floor(Math.random() * 30)}`;
                const average = (Math.random() * 30) + 15;
                const economy = (Math.random() * 3) + 4;
                
                playerStats.bowling = {
                    matches: matchesPlayed,
                    innings: innings,
                    wickets: wickets,
                    best: best,
                    average: average,
                    economy: economy
                };
            }
            
            this.stats.push(playerStats);
        });
        
        this.saveData();
    }
    
    // Leaderboard
    switchLeaderboardTab(board) {
        this.dom.leaderboardTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-board') === board) {
                tab.classList.add('active');
            }
        });
        
        this.dom.leaderboards.forEach(lb => {
            lb.classList.remove('active');
            if (lb.id === `${board}-leaderboard`) {
                lb.classList.add('active');
            }
        });
    }
    
    renderLeaderboards() {
        // Batting leaderboard
        const battingBoard = document.getElementById('batting-board');
        battingBoard.innerHTML = '';
        
        // Get players with batting stats, sort by runs
        const battingPlayers = this.players.map(player => {
            const stats = this.stats.filter(s => s.playerId === player.id)[0] || {};
            return {
                ...player,
                batting: stats.batting || {}
            };
        }).filter(p => p.batting.runs > 0)
          .sort((a, b) => b.batting.runs - a.batting.runs);
        
        battingPlayers.forEach((player, index) => {
            const row = document.createElement('div');
            row.className = 'leaderboard-row';
            row.innerHTML = `
                <span class="rank">${index + 1}</span>
                <span class="player">
                    ${player.photo ? `<img src="${player.photo}" alt="${player.name}">` : ''}
                    ${player.name}
                </span>
                <span>${player.batting.runs}</span>
                <span>${player.batting.average ? player.batting.average.toFixed(2) : '-'}</span>
                <span>${player.batting.strikeRate ? player.batting.strikeRate.toFixed(2) : '-'}</span>
            `;
            battingBoard.appendChild(row);
        });
        
        // Bowling leaderboard
        const bowlingBoard = document.getElementById('bowling-board');
        bowlingBoard.innerHTML = '';
        
        // Get players with bowling stats, sort by wickets
        const bowlingPlayers = this.players.map(player => {
            const stats = this.stats.filter(s => s.playerId === player.id)[0] || {};
            return {
                ...player,
                bowling: stats.bowling || {}
            };
        }).filter(p => p.bowling.wickets > 0)
          .sort((a, b) => b.bowling.wickets - a.bowling.wickets);
        
        bowlingPlayers.forEach((player, index) => {
            const row = document.createElement('div');
            row.className = 'leaderboard-row';
            row.innerHTML = `
                <span class="rank">${index + 1}</span>
                <span class="player">
                    ${player.photo ? `<img src="${player.photo}" alt="${player.name}">` : ''}
                    ${player.name}
                </span>
                <span>${player.bowling.wickets}</span>
                <span>${player.bowling.average ? player.bowling.average.toFixed(2) : '-'}</span>
                <span>${player.bowling.economy ? player.bowling.economy.toFixed(2) : '-'}</span>
            `;
            bowlingBoard.appendChild(row);
        });
        
        // All-round leaderboard
        const allRoundBoard = document.getElementById('all-round-board');
        allRoundBoard.innerHTML = '';
        
        // Get all-rounders, calculate points (runs + wickets*20)
        const allRounders = this.players.map(player => {
            const stats = this.stats.filter(s => s.playerId === player.id)[0] || {};
            const batting = stats.batting || {};
            const bowling = stats.bowling || {};
            const points = (batting.runs || 0) + ((bowling.wickets || 0) * 20);
            
            return {
                ...player,
                batting: batting,
                bowling: bowling,
                points: points
            };
        }).filter(p => p.points > 0 && (p.batting.runs > 0 && p.bowling.wickets > 0))
          .sort((a, b) => b.points - a.points);
        
        allRounders.forEach((player, index) => {
            const row = document.createElement('div');
            row.className = 'leaderboard-row';
            row.innerHTML = `
                <span class="rank">${index + 1}</span>
                <span class="player">
                    ${player.photo ? `<img src="${player.photo}" alt="${player.name}">` : ''}
                    ${player.name}
                </span>
                <span>${player.batting.runs || 0}</span>
                <span>${player.bowling.wickets || 0}</span>
                <span>${player.points}</span>
            `;
            allRoundBoard.appendChild(row);
        });
    }
    
    // Dashboard
    renderDashboard() {
        // Upcoming matches
        const now = new Date();
        const upcomingMatches = this.matches
            .filter(match => {
                const matchDate = new Date(`${match.date}T${match.time}`);
                return match.status === 'upcoming' && matchDate > now;
            })
            .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
            .slice(0, 3);
        
        const upcomingList = document.getElementById('upcoming-matches-list');
        upcomingList.innerHTML = '';
        
        if (upcomingMatches.length === 0) {
            upcomingList.innerHTML = '<p class="no-upcoming">No upcoming matches</p>';
        } else {
            upcomingMatches.forEach(match => {
                const item = document.createElement('div');
                item.className = 'match-item';
                item.innerHTML = `
                    <div class="teams">vs ${match.opponent}</div>
                    <div class="date">${this.formatDate(match.date)} at ${match.time}</div>
                `;
                upcomingList.appendChild(item);
            });
        }
        
        // Recent performers
        const recentPerformers = this.players
            .map(player => {
                const stats = this.stats.filter(s => s.playerId === player.id)[0] || {};
                return {
                    ...player,
                    batting: stats.batting || {},
                    bowling: stats.bowling || {}
                };
            })
            .sort((a, b) => {
                // Sort by most runs in last match (simplified for demo)
                return (b.batting.runs || 0) - (a.batting.runs || 0);
            })
            .slice(0, 3);
        
        const performersList = document.getElementById('recent-performers');
        performersList.innerHTML = '';
        
        recentPerformers.forEach(player => {
            const item = document.createElement('div');
            item.className = 'performer-item';
            item.innerHTML = `
                ${player.photo ? `<img src="${player.photo}" alt="${player.name}">` : 
                '<i class="fas fa-user"></i>'}
                <div class="details">
                    <div class="name">${player.name}</div>
                    <div class="performance">
                        ${player.batting.runs ? `${player.batting.runs} runs` : ''}
                        ${player.bowling.wickets ? `${player.bowling.wickets} wkts` : ''}
                    </div>
                </div>
            `;
            performersList.appendChild(item);
        });
        
        // Team stats
        const totalMatches = this.matches.filter(m => m.status === 'completed').length;
        const totalWins = Math.floor(totalMatches * 0.6); // Assuming 60% win rate for demo
        const winPercentage = totalMatches > 0 ? (totalWins / totalMatches * 100) : 0;
        
        document.getElementById('total-matches').textContent = totalMatches;
        document.getElementById('total-wins').textContent = totalWins;
        document.getElementById('win-percentage').textContent = `${winPercentage.toFixed(1)}%`;
    }
    
    // Scorecard Management
    showScorecardModal(match = null) {
        if (match) {
            this.currentMatch = match;
            document.getElementById('scorecard-modal-title').textContent = `${match.opponent} - Scorecard`;
            document.getElementById('opponent-team-name').textContent = match.opponent;
            document.getElementById('match-score-date').textContent = this.formatDate(match.date);
            document.getElementById('match-score-venue').textContent = match.location;
            
            // Reset innings data
            this.currentInnings = 1;
            this.currentBattingTeam = 'peshawar';
            this.currentOver = [];
            this.inningsData = {
                1: { team: 'peshawar', score: 0, wickets: 0, overs: 0, balls: 0, batsmen: {}, bowlers: {} },
                2: { team: 'opponent', score: 0, wickets: 0, overs: 0, balls: 0, batsmen: {}, bowlers: {} }
            };
            
            this.updateInningsDisplay();
            this.updatePlayerSelects();
            this.showModal(this.dom.scorecardModal);
        } else {
            // Show match selection
            alert('Please select a match to score from the Matches section');
        }
    }
    
    startScoring(match) {
        this.showScorecardModal(match);
    }
    
    viewScorecard(match) {
        // In a real app, this would show the saved scorecard
        alert(`Viewing scorecard for match against ${match.opponent} on ${match.date}`);
    }
    
    updateInningsDisplay() {
        const innings = this.inningsData[this.currentInnings];
        const team = innings.team === 'peshawar' ? 'Peshawar Lions' : this.currentMatch.opponent;
        
        if (this.currentInnings === 1) {
            document.getElementById('team1-score').textContent = 
                `${innings.score}/${innings.wickets} (${innings.overs}.${innings.balls} ov)`;
        } else {
            document.getElementById('team2-score').textContent = 
                `${innings.score}/${innings.wickets} (${innings.overs}.${innings.balls} ov)`;
        }
    }
    
    updatePlayerSelects() {
        const strikerSelect = document.getElementById('striker-select');
        const nonStrikerSelect = document.getElementById('non-striker-select');
        const bowlerSelect = document.getElementById('bowler-select');
        
        strikerSelect.innerHTML = '<option value="">Select Batsman</option>';
        nonStrikerSelect.innerHTML = '<option value="">Select Batsman</option>';
        bowlerSelect.innerHTML = '<option value="">Select Bowler</option>';
        
        if (this.currentBattingTeam === 'peshawar') {
            // Peshawar Lions are batting
            this.players.forEach(player => {
                if (player.role === 'batsman' || player.role === 'all-rounder' || player.role === 'keeper') {
                    const option = document.createElement('option');
                    option.value = player.id;
                    option.textContent = player.name;
                    strikerSelect.appendChild(option.cloneNode(true));
                    nonStrikerSelect.appendChild(option);
                }
                
                if (player.role === 'bowler' || player.role === 'all-rounder') {
                    const option = document.createElement('option');
                    option.value = player.id;
                    option.textContent = player.name;
                    bowlerSelect.appendChild(option);
                }
            });
        } else {
            // Opponent is batting - we don't have their players, so just use generic options
            for (let i = 1; i <= 11; i++) {
                const option = document.createElement('option');
                option.value = `opponent-${i}`;
                option.textContent = `Player ${i}`;
                strikerSelect.appendChild(option.cloneNode(true));
                nonStrikerSelect.appendChild(option.cloneNode(true));
                
                if (i <= 5) {
                    const bowlerOption = document.createElement('option');
                    bowlerOption.value = `opponent-${i}`;
                    bowlerOption.textContent = `Player ${i}`;
                    bowlerSelect.appendChild(bowlerOption);
                }
            }
        }
    }
    
    recordBall(runs, type) {
        const strikerSelect = document.getElementById('striker-select');
        const bowlerSelect = document.getElementById('bowler-select');
        
        const strikerId = strikerSelect.value;
        const bowlerId = bowlerSelect.value;
        
        if (!strikerId || !bowlerId) {
            alert('Please select batsmen and bowler');
            return;
        }
        
        const innings = this.inningsData[this.currentInnings];
        const isWicket = type === 'bowled' || type === 'caught' || type === 'lbw' || type === 'runout' || type === 'stumped';
        
        // Update innings totals
        if (type === 'wide' || type === 'noball') {
            innings.score += 1; // Extra run
        } else if (type === 'bye' || type === 'legbye') {
            innings.score += runs; // Byes/leg byes don't count to bowler
        } else {
            innings.score += runs;
        }
        
        if (isWicket) {
            innings.wickets += 1;
        }
        
        // Update balls/overs
        if (type !== 'wide' && type !== 'noball') {
            innings.balls += 1;
            if (innings.balls === 6) {
                innings.overs += 1;
                innings.balls = 0;
            }
        }
        
        // Update batsman stats
        if (!innings.batsmen[strikerId]) {
            innings.batsmen[strikerId] = { runs: 0, balls: 0, fours: 0, sixes: 0 };
        }
        
        if (type === 'bye' || type === 'legbye') {
            // Don't count to batsman
        } else if (type === 'wide' || type === 'noball') {
            // Don't count as ball faced
        } else {
            innings.batsmen[strikerId].balls += 1;
            innings.batsmen[strikerId].runs += runs;
            
            if (runs === 4) innings.batsmen[strikerId].fours += 1;
            if (runs === 6) innings.batsmen[strikerId].sixes += 1;
        }
        
        // Update bowler stats
        if (!innings.bowlers[bowlerId]) {
            innings.bowlers[bowlerId] = { runs: 0, balls: 0, wickets: 0, extras: 0 };
        }
        
        if (type === 'wide' || type === 'noball') {
            innings.bowlers[bowlerId].extras += 1;
        } else if (type === 'bye' || type === 'legbye') {
            // Don't count to bowler
        } else {
            innings.bowlers[bowlerId].balls += 1;
            innings.bowlers[bowlerId].runs += runs;
            
            if (isWicket) {
                innings.bowlers[bowlerId].wickets += 1;
            }
        }
        
        // Add to current over display
        let ballClass = '';
        let ballText = '';
        
        if (type === 'wide') {
            ballClass = 'ball-wd';
            ballText = 'Wd';
        } else if (type === 'noball') {
            ballClass = 'ball-nb';
            ballText = 'Nb';
        } else if (isWicket) {
            ballClass = 'ball-w';
            ballText = 'W';
        } else {
            ballClass = `ball-${runs}`;
            ballText = runs.toString();
        }
        
        const ballElement = document.createElement('div');
        ballElement.className = `ball ${ballClass}`;
        ballElement.textContent = ballText;
        document.getElementById('current-over').appendChild(ballElement);
        
        // Update display
        this.updateInningsDisplay();
    }
    
    recordWicket(type) {
        this.recordBall(0, type);
    }
    
    undoLastBall() {
        const innings = this.inningsData[this.currentInnings];
        const currentOver = document.getElementById('current-over');
        
        if (currentOver.children.length === 0) {
            alert('No balls to undo');
            return;
        }
        
        // Remove last ball from display
        currentOver.removeChild(currentOver.lastChild);
        
        // In a real app, we would properly reverse the stats updates
        // For this demo, we'll just decrement the score by 1
        innings.score = Math.max(0, innings.score - 1);
        
        this.updateInningsDisplay();
    }
    
    endInnings() {
        if (this.currentInnings === 1) {
            this.currentInnings = 2;
            this.currentBattingTeam = 'opponent';
            this.currentOver = [];
            document.getElementById('current-over').innerHTML = '';
            this.updatePlayerSelects();
            this.updateInningsDisplay();
            
            // Set target for 2nd innings
            const firstInningsScore = this.inningsData[1].score;
            document.getElementById('team1-score').textContent += ` (Target: ${firstInningsScore + 1})`;
        } else {
            alert('Match completed!');
        }
    }
    
    saveScorecard() {
        // In a real app, this would save the detailed scorecard
        this.currentMatch.status = 'completed';
        this.saveData();
        this.renderMatches();
        this.renderDashboard();
        this.closeModal(this.dom.scorecardModal);
        this.showNotification('Scorecard saved successfully');
    }
    
    switchScorecardTab(tab) {
        this.dom.scorecardTabs.forEach(tabEl => {
            tabEl.classList.remove('active');
            if (tabEl.getAttribute('data-scorecard') === tab) {
                tabEl.classList.add('active');
            }
        });
        
        this.dom.scorecardTabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tab}-scoring`) {
                content.classList.add('active');
            }
        });
    }
    
    // Admin Panel
    switchAdminTab(tab) {
        this.dom.adminTabBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-admin-tab') === tab) {
                btn.classList.add('active');
            }
        });
        
        this.dom.adminTabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tab}-tab`) {
                content.classList.add('active');
            }
        });
    }
    
    importData() {
        const importType = document.getElementById('import-type').value;
        const fileInput = document.getElementById('import-file');
        
        if (fileInput.files.length === 0) {
            alert('Please select a file to import');
            return;
        }
        
        const file = fileInput.files[0];
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                switch (importType) {
                    case 'players':
                        this.players = data;
                        break;
                    case 'matches':
                        this.matches = data;
                        break;
                    case 'stats':
                        this.stats = data;
                        break;
                }
                
                this.saveData();
                this.showNotification(`${importType} data imported successfully`);
                
                // Refresh relevant views
                if (importType === 'players') {
                    this.renderPlayers();
                    this.populatePlayerSelect();
                    this.renderLeaderboards();
                } else if (importType === 'matches') {
                    this.renderMatches();
                    this.renderDashboard();
                } else if (importType === 'stats') {
                    this.renderLeaderboards();
                }
            } catch (error) {
                alert('Error parsing file: ' + error.message);
            }
        };
        
        reader.readAsText(file);
    }
    
    exportData() {
        const exportType = document.getElementById('export-type').value;
        const exportFormat = document.getElementById('export-format').value;
        
        let data;
        let fileName;
        
        switch (exportType) {
            case 'players':
                data = this.players;
                fileName = 'peshawar-lions-players';
                break;
            case 'matches':
                data = this.matches;
                fileName = 'peshawar-lions-matches';
                break;
            case 'stats':
                data = this.stats;
                fileName = 'peshawar-lions-stats';
                break;
        }
        
        if (exportFormat === 'json') {
            this.downloadJSON(data, fileName);
        } else if (exportFormat === 'csv') {
            this.convertToCSV(data, fileName);
        } else {
            // PDF export would require a library like jsPDF
            alert('PDF export would be implemented with a library like jsPDF');
        }
    }
    
    downloadJSON(data, fileName) {
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    convertToCSV(data, fileName) {
        if (data.length === 0) {
            alert('No data to export');
            return;
        }
        
        // Extract headers
        const headers = Object.keys(data[0]);
        
        // Create CSV content
        let csv = headers.join(',') + '\n';
        
        data.forEach(item => {
            const row = headers.map(header => {
                // Handle nested objects
                if (typeof item[header] === 'object') {
                    return JSON.stringify(item[header]);
                }
                return `"${item[header]}"`;
            }).join(',');
            
            csv += row + '\n';
        });
        
        // Download CSV
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    saveSettings() {
        // In a real app, this would save settings to localStorage
        this.showNotification('Settings saved successfully');
    }
    
    // Authentication
    checkAuth() {
        if (!this.currentUser && window.location.hash !== '#login') {
            // Show login modal if not authenticated
            this.showLoginModal();
        }
    }
    
    showLoginModal() {
        this.showModal(this.dom.loginModal);
    }
    
    handleLogin() {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        // In a real app, this would validate against a server
        if (username === 'admin' && password === 'peshawar123') {
            this.currentUser = { username: 'admin', role: 'admin' };
            this.saveData();
            this.closeModal(this.dom.loginModal);
            this.showNotification('Login successful');
        } else {
            alert('Invalid username or password');
        }
    }
    
    // Utility Methods
    showModal(modal) {
        modal.classList.add('active');
    }
    
    closeModal(modal) {
        modal.classList.remove('active');
    }
    
    showNotification(message) {
        const toast = this.dom.toast;
        document.getElementById('toast-message').textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
}