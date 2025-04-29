// DOM Elements
const splashScreen = document.getElementById('splashScreen');
const appContainer = document.getElementById('appContainer');
const themeToggle = document.getElementById('themeToggle');
const mainNav = document.getElementById('mainNav');
const mobileNavToggle = document.getElementById('mobileNavToggle');
const mainContent = document.getElementById('mainContent');
const navLinks = document.querySelectorAll('.main-nav a');
const contentSections = document.querySelectorAll('.content-section');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const leaderboardTabs = document.querySelectorAll('.leaderboard-tab');

// Data Storage
let players = JSON.parse(localStorage.getItem('players')) || [];
let matches = JSON.parse(localStorage.getItem('matches')) || [];
let posts = JSON.parse(localStorage.getItem('posts')) || [];
let adminCredentials = JSON.parse(localStorage.getItem('adminCredentials')) || { username: 'admin', password: 'peshawarlions123' };
let currentUser = null;
let currentTheme = localStorage.getItem('theme') || 'light';

// Initialize the app
function initApp() {
    // Hide splash screen after 3 seconds
    setTimeout(() => {
        splashScreen.classList.add('fade-out');
        setTimeout(() => {
            splashScreen.style.display = 'none';
            appContainer.style.display = 'block';
            applyTheme(currentTheme);
            loadDashboard();
        }, 500);
    }, 3000);

    // Set up event listeners
    setupEventListeners();
    
    // Load initial data
    if (players.length === 0) {
        // Add sample admin player if no players exist
        const adminPlayer = {
            id: generateId(),
            name: 'Team Admin',
            battingStyle: 'Right-hand',
            bowlingStyle: 'None',
            role: 'Wicketkeeper',
            photo: '',
            matchesPlayed: 0,
            runs: 0,
            wickets: 0
        };
        players.push(adminPlayer);
        savePlayers();
    }
    
    // Check if admin credentials exist
    if (!localStorage.getItem('adminCredentials')) {
        localStorage.setItem('adminCredentials', JSON.stringify(adminCredentials));
    }
}

// Set up event listeners
function setupEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Mobile nav toggle
    mobileNavToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
    });
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href');
            
            // Update active nav link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
            
            // Show corresponding section
            contentSections.forEach(section => section.classList.remove('active'));
            document.querySelector(sectionId).classList.add('active');
            
            // Load section data
            switch(sectionId) {
                case '#dashboard':
                    loadDashboard();
                    break;
                case '#players':
                    loadPlayers();
                    break;
                case '#matches':
                    loadMatches();
                    break;
                case '#statistics':
                    loadStatistics();
                    break;
                case '#leaderboard':
                    loadLeaderboard('runs');
                    break;
                case '#team-feed':
                    loadTeamFeed();
                    break;
                case '#admin':
                    checkAdminLogin();
                    break;
            }
            
            // Close mobile nav if open
            if (window.innerWidth <= 768) {
                mainNav.classList.remove('active');
            }
        });
    });
    
    // Tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show corresponding tab content
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(`${tabId}MatchesTab`).classList.add('active');
            
            // Load tab data
            if (tabId === 'upcoming') loadUpcomingMatches();
            if (tabId === 'live') loadLiveMatches();
            if (tabId === 'completed') loadCompletedMatches();
        });
    });
    
    // Leaderboard tabs
    leaderboardTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const boardType = tab.getAttribute('data-board');
            loadLeaderboard(boardType);
            
            // Update active tab
            leaderboardTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
    
    // Player management
    document.getElementById('addNewPlayerBtn').addEventListener('click', () => openPlayerModal());
    document.getElementById('addPlayerBtn').addEventListener('click', () => openPlayerModal());
    document.getElementById('playerForm').addEventListener('submit', handlePlayerFormSubmit);
    document.getElementById('closePlayerModal').addEventListener('click', () => closeModal('playerModal'));
    document.getElementById('cancelPlayerBtn').addEventListener('click', () => closeModal('playerModal'));
    document.getElementById('playerSearch').addEventListener('input', filterPlayers);
    document.getElementById('playerRoleFilter').addEventListener('change', filterPlayers);
    
    // Match management
    document.getElementById('addNewMatchBtn').addEventListener('click', () => openMatchModal());
    document.getElementById('createMatchBtn').addEventListener('click', () => openMatchModal());
    document.getElementById('matchForm').addEventListener('submit', handleMatchFormSubmit);
    document.getElementById('closeMatchModal').addEventListener('click', () => closeModal('matchModal'));
    document.getElementById('cancelMatchBtn').addEventListener('click', () => closeModal('matchModal'));
    
    // Admin panel
    document.getElementById('adminLoginForm').addEventListener('submit', handleAdminLogin);
    document.getElementById('managePlayersCard').addEventListener('click', () => {
        document.querySelector('.main-nav a[href="#players"]').click();
    });
    document.getElementById('manageMatchesCard').addEventListener('click', () => {
        document.querySelector('.main-nav a[href="#matches"]').click();
    });
    document.getElementById('importDataCard').addEventListener('click', () => openModal('importModal'));
    document.getElementById('teamSettingsCard').addEventListener('click', () => openModal('settingsModal'));
    
    // Import data
    document.getElementById('importForm').addEventListener('submit', handleImportData);
    document.getElementById('closeImportModal').addEventListener('click', () => closeModal('importModal'));
    document.getElementById('cancelImportBtn').addEventListener('click', () => closeModal('importModal'));
    
    // Team settings
    document.getElementById('settingsForm').addEventListener('submit', handleTeamSettings);
    document.getElementById('closeSettingsModal').addEventListener('click', () => closeModal('settingsModal'));
    document.getElementById('cancelSettingsBtn').addEventListener('click', () => closeModal('settingsModal'));
    
    // Team feed
    document.getElementById('addNewPostBtn').addEventListener('click', () => openModal('postModal'));
    document.getElementById('postForm').addEventListener('submit', handlePostSubmit);
    document.getElementById('closePostModal').addEventListener('click', () => closeModal('postModal'));
    document.getElementById('cancelPostBtn').addEventListener('click', () => closeModal('postModal'));
    document.getElementById('addPollOptionBtn').addEventListener('click', addPollOption);
    
    // Statistics
    document.getElementById('applyStatsFilter').addEventListener('click', loadPlayerStats);
    document.getElementById('viewStatsBtn').addEventListener('click', () => {
        document.querySelector('.main-nav a[href="#statistics"]').click();
    });
}

// Theme functions
function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    if (currentTheme === 'light') {
        currentTheme = 'dark';
    } else {
        currentTheme = 'light';
    }
    applyTheme(currentTheme);
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function openPlayerModal(player = null) {
    const modal = document.getElementById('playerModal');
    const form = document.getElementById('playerForm');
    
    if (player) {
        document.getElementById('playerModalTitle').textContent = 'Edit Player';
        document.getElementById('playerId').value = player.id;
        document.getElementById('playerName').value = player.name;
        document.getElementById('battingStyle').value = player.battingStyle;
        document.getElementById('bowlingStyle').value = player.bowlingStyle;
        document.getElementById('playerRole').value = player.role;
    } else {
        document.getElementById('playerModalTitle').textContent = 'Add New Player';
        form.reset();
    }
    
    openModal('playerModal');
}

function openMatchModal(match = null) {
    const modal = document.getElementById('matchModal');
    const form = document.getElementById('matchForm');
    
    if (match) {
        document.getElementById('matchModalTitle').textContent = 'Edit Match';
        document.getElementById('matchId').value = match.id;
        document.getElementById('opponentTeam').value = match.opponent;
        document.getElementById('matchVenue').value = match.venue;
        document.getElementById('matchDate').value = match.date;
        document.getElementById('matchType').value = match.type;
    } else {
        document.getElementById('matchModalTitle').textContent = 'Add New Match';
        form.reset();
        document.getElementById('matchDate').valueAsDate = new Date();
    }
    
    openModal('matchModal');
}

// Data handling functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function savePlayers() {
    localStorage.setItem('players', JSON.stringify(players));
}

function saveMatches() {
    localStorage.setItem('matches', JSON.stringify(matches));
}

function savePosts() {
    localStorage.setItem('posts', JSON.stringify(posts));
}

// Dashboard functions
function loadDashboard() {
    loadUpcomingMatches();
    loadRecentPerformance();
    loadTopPerformers();
}

function loadUpcomingMatches() {
    const upcomingMatchesList = document.getElementById('upcomingMatchesList');
    const upcomingMatchesContainer = document.getElementById('upcomingMatchesContainer');
    
    const now = new Date();
    const upcoming = matches.filter(match => new Date(match.date) > now && match.status !== 'completed');
    
    if (upcoming.length === 0) {
        upcomingMatchesList.innerHTML = '<p>No upcoming matches scheduled.</p>';
        upcomingMatchesContainer.innerHTML = '<p>No upcoming matches scheduled.</p>';
        return;
    }
    
    // Sort by date
    upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // For dashboard widget
    let dashboardHTML = '';
    upcoming.slice(0, 3).forEach(match => {
        dashboardHTML += `
            <div class="match-item">
                <h4>vs ${match.opponent}</h4>
                <p>${formatDate(match.date)} at ${match.venue}</p>
                <p>${match.type} Match</p>
            </div>
        `;
    });
    upcomingMatchesList.innerHTML = dashboardHTML;
    
    // For matches section
    let matchesHTML = '';
    upcoming.forEach(match => {
        matchesHTML += `
            <div class="match-card">
                <div class="match-teams">
                    <h3>Peshawar Lions vs ${match.opponent}</h3>
                    <p class="match-details">${formatDate(match.date)} | ${match.venue} | ${match.type}</p>
                </div>
                <div class="match-status upcoming">Upcoming</div>
                <div class="match-actions">
                    <button class="match-action-btn" data-match-id="${match.id}" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="match-action-btn" data-match-id="${match.id}" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    });
    upcomingMatchesContainer.innerHTML = matchesHTML;
    
    // Add event listeners to action buttons
    document.querySelectorAll('.match-action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const matchId = btn.getAttribute('data-match-id');
            const match = matches.find(m => m.id === matchId);
            
            if (btn.querySelector('.fa-edit')) {
                openMatchModal(match);
            } else if (btn.querySelector('.fa-trash')) {
                if (confirm('Are you sure you want to delete this match?')) {
                    matches = matches.filter(m => m.id !== matchId);
                    saveMatches();
                    loadUpcomingMatches();
                    if (document.getElementById('upcomingMatchesList')) {
                        loadDashboard();
                    }
                }
            }
        });
    });
}

function loadLiveMatches() {
    const liveMatchesContainer = document.getElementById('liveMatchesContainer');
    
    const live = matches.filter(match => match.status === 'live');
    
    if (live.length === 0) {
        liveMatchesContainer.innerHTML = '<p>No live matches currently.</p>';
        return;
    }
    
    let matchesHTML = '';
    live.forEach(match => {
        matchesHTML += `
            <div class="match-card">
                <div class="match-teams">
                    <h3>Peshawar Lions vs ${match.opponent}</h3>
                    <p class="match-details">${formatDate(match.date)} | ${match.venue} | ${match.type}</p>
                </div>
                <div class="match-status live">Live</div>
                <div class="match-actions">
                    <button class="match-action-btn score-match-btn" data-match-id="${match.id}">Score Match</button>
                </div>
            </div>
        `;
    });
    liveMatchesContainer.innerHTML = matchesHTML;
    
    // Add event listeners to score buttons
    document.querySelectorAll('.score-match-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const matchId = btn.getAttribute('data-match-id');
            startScoring(matchId);
        });
    });
}

function loadCompletedMatches() {
    const completedMatchesContainer = document.getElementById('completedMatchesContainer');
    
    const completed = matches.filter(match => match.status === 'completed');
    
    if (completed.length === 0) {
        completedMatchesContainer.innerHTML = '<p>No completed matches yet.</p>';
        return;
    }
    
    // Sort by date (newest first)
    completed.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let matchesHTML = '';
    completed.forEach(match => {
        const result = match.result || 'Match completed';
        matchesHTML += `
            <div class="match-card">
                <div class="match-teams">
                    <h3>Peshawar Lions vs ${match.opponent}</h3>
                    <p class="match-details">${formatDate(match.date)} | ${match.venue} | ${match.type}</p>
                    <p class="match-result">${result}</p>
                </div>
                <div class="match-status completed">Completed</div>
                <div class="match-actions">
                    <button class="match-action-btn view-scorecard-btn" data-match-id="${match.id}">View Scorecard</button>
                </div>
            </div>
        `;
    });
    completedMatchesContainer.innerHTML = matchesHTML;
    
    // Add event listeners to view scorecard buttons
    document.querySelectorAll('.view-scorecard-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const matchId = btn.getAttribute('data-match-id');
            viewScorecard(matchId);
        });
    });
}

function loadRecentPerformance() {
    const recentPerformance = document.getElementById('recentPerformance');
    
    const completed = matches.filter(match => match.status === 'completed');
    if (completed.length === 0) {
        recentPerformance.innerHTML = '<p>No match data available.</p>';
        return;
    }
    
    // Get last 5 matches
    const recentMatches = completed.slice(-5).reverse();
    
    let wins = 0;
    let losses = 0;
    recentMatches.forEach(match => {
        if (match.result && match.result.includes('Peshawar Lions won')) wins++;
        else if (match.result && match.result.includes('lost')) losses++;
    });
    
    recentPerformance.innerHTML = `
        <div class="performance-stats">
            <div class="stat-card">
                <h3>${wins + losses}</h3>
                <p>Matches</p>
            </div>
            <div class="stat-card">
                <h3>${wins}</h3>
                <p>Wins</p>
            </div>
            <div class="stat-card">
                <h3>${losses}</h3>
                <p>Losses</p>
            </div>
        </div>
        <div class="recent-matches">
            <h4>Recent Matches</h4>
            <ul>
                ${recentMatches.map(match => `
                    <li>
                        <strong>vs ${match.opponent}</strong>: 
                        ${match.result || 'Match completed'}
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
}

function loadTopPerformers() {
    const topPerformers = document.getElementById('topPerformers');
    
    if (players.length === 0) {
        topPerformers.innerHTML = '<p>No player data available.</p>';
        return;
    }
    
    // Get top 3 run scorers
    const topRunScorers = [...players]
        .filter(p => p.runs > 0)
        .sort((a, b) => b.runs - a.runs)
        .slice(0, 3);
    
    // Get top 3 wicket takers
    const topWicketTakers = [...players]
        .filter(p => p.wickets > 0)
        .sort((a, b) => b.wickets - a.wickets)
        .slice(0, 3);
    
    topPerformers.innerHTML = `
        <div class="top-performers-grid">
            <div class="top-performers-card">
                <h4>Top Run Scorers</h4>
                ${topRunScorers.length > 0 ? `
                    <ol>
                        ${topRunScorers.map(player => `
                            <li>${player.name} - ${player.runs} runs</li>
                        `).join('')}
                    </ol>
                ` : '<p>No runs scored yet.</p>'}
            </div>
            <div class="top-performers-card">
                <h4>Top Wicket Takers</h4>
                ${topWicketTakers.length > 0 ? `
                    <ol>
                        ${topWicketTakers.map(player => `
                            <li>${player.name} - ${player.wickets} wickets</li>
                        `).join('')}
                    </ol>
                ` : '<p>No wickets taken yet.</p>'}
            </div>
        </div>
    `;
}

// Player functions
function loadPlayers() {
    const playersGrid = document.getElementById('playersGrid');
    
    if (players.length === 0) {
        playersGrid.innerHTML = '<p>No players added yet.</p>';
        return;
    }
    
    // Populate player select for stats
    const statsPlayerSelect = document.getElementById('statsPlayerSelect');
    statsPlayerSelect.innerHTML = '<option value="">Select Player</option>';
    players.forEach(player => {
        statsPlayerSelect.innerHTML += `<option value="${player.id}">${player.name}</option>`;
    });
    
    let playersHTML = '';
    players.forEach(player => {
        playersHTML += `
            <div class="player-card">
                <div class="player-photo">
                    ${player.photo ? `
                        <img src="${player.photo}" alt="${player.name}">
                    ` : `
                        <div class="photo-placeholder">
                            <i class="fas fa-user"></i>
                        </div>
                    `}
                </div>
                <div class="player-info">
                    <h3 class="player-name">${player.name}</h3>
                    <p class="player-details"><strong>Batting:</strong> ${player.battingStyle}</p>
                    <p class="player-details"><strong>Bowling:</strong> ${player.bowlingStyle}</p>
                    <p class="player-details"><strong>Matches:</strong> ${player.matchesPlayed || 0}</p>
                    <p class="player-details"><strong>Runs:</strong> ${player.runs || 0}</p>
                    <p class="player-details"><strong>Wickets:</strong> ${player.wickets || 0}</p>
                    <span class="player-role">${player.role}</span>
                </div>
                <div class="player-actions">
                    <button class="action-btn edit-player-btn" data-player-id="${player.id}">Edit</button>
                    <button class="action-btn delete-player-btn" data-player-id="${player.id}">Delete</button>
                </div>
            </div>
        `;
    });
    playersGrid.innerHTML = playersHTML;
    
    // Add event listeners to action buttons
    document.querySelectorAll('.edit-player-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const playerId = btn.getAttribute('data-player-id');
            const player = players.find(p => p.id === playerId);
            openPlayerModal(player);
        });
    });
    
    document.querySelectorAll('.delete-player-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const playerId = btn.getAttribute('data-player-id');
            if (confirm('Are you sure you want to delete this player?')) {
                players = players.filter(p => p.id !== playerId);
                savePlayers();
                loadPlayers();
            }
        });
    });
}

function filterPlayers() {
    const searchTerm = document.getElementById('playerSearch').value.toLowerCase();
    const roleFilter = document.getElementById('playerRoleFilter').value;
    
    const filtered = players.filter(player => {
        const nameMatch = player.name.toLowerCase().includes(searchTerm);
        const roleMatch = roleFilter === 'all' || player.role === roleFilter;
        return nameMatch && roleMatch;
    });
    
    const playersGrid = document.getElementById('playersGrid');
    
    if (filtered.length === 0) {
        playersGrid.innerHTML = '<p>No players match the search criteria.</p>';
        return;
    }
    
    let playersHTML = '';
    filtered.forEach(player => {
        playersHTML += `
            <div class="player-card">
                <div class="player-photo">
                    ${player.photo ? `
                        <img src="${player.photo}" alt="${player.name}">
                    ` : `
                        <div class="photo-placeholder">
                            <i class="fas fa-user"></i>
                        </div>
                    `}
                </div>
                <div class="player-info">
                    <h3 class="player-name">${player.name}</h3>
                    <p class="player-details"><strong>Batting:</strong> ${player.battingStyle}</p>
                    <p class="player-details"><strong>Bowling:</strong> ${player.bowlingStyle}</p>
                    <p class="player-details"><strong>Matches:</strong> ${player.matchesPlayed || 0}</p>
                    <p class="player-details"><strong>Runs:</strong> ${player.runs || 0}</p>
                    <p class="player-details"><strong>Wickets:</strong> ${player.wickets || 0}</p>
                    <span class="player-role">${player.role}</span>
                </div>
                <div class="player-actions">
                    <button class="action-btn edit-player-btn" data-player-id="${player.id}">Edit</button>
                    <button class="action-btn delete-player-btn" data-player-id="${player.id}">Delete</button>
                </div>
            </div>
        `;
    });
    playersGrid.innerHTML = playersHTML;
}

function handlePlayerFormSubmit(e) {
    e.preventDefault();
    
    const playerId = document.getElementById('playerId').value;
    const name = document.getElementById('playerName').value;
    const battingStyle = document.getElementById('battingStyle').value;
    const bowlingStyle = document.getElementById('bowlingStyle').value;
    const role = document.getElementById('playerRole').value;
    const photoFile = document.getElementById('playerPhoto').files[0];
    
    if (!name || !battingStyle || !bowlingStyle || !role) {
        alert('Please fill all required fields');
        return;
    }
    
    // Handle photo upload
    let photoUrl = '';
    if (photoFile) {
        photoUrl = URL.createObjectURL(photoFile);
    } else if (playerId) {
        const existingPlayer = players.find(p => p.id === playerId);
        if (existingPlayer) photoUrl = existingPlayer.photo || '';
    }
    
    if (playerId) {
        // Update existing player
        const index = players.findIndex(p => p.id === playerId);
        if (index !== -1) {
            players[index] = {
                ...players[index],
                name,
                battingStyle,
                bowlingStyle,
                role,
                photo: photoUrl
            };
        }
    } else {
        // Add new player
        const newPlayer = {
            id: generateId(),
            name,
            battingStyle,
            bowlingStyle,
            role,
            photo: photoUrl,
            matchesPlayed: 0,
            runs: 0,
            wickets: 0,
            stats: []
        };
        players.push(newPlayer);
    }
    
    savePlayers();
    closeModal('playerModal');
    loadPlayers();
    if (document.querySelector('.content-section.active').id === 'dashboard') {
        loadTopPerformers();
    }
}

// Match functions
function loadMatches() {
    loadUpcomingMatches();
    loadLiveMatches();
    loadCompletedMatches();
}

function handleMatchFormSubmit(e) {
    e.preventDefault();
    
    const matchId = document.getElementById('matchId').value;
    const opponent = document.getElementById('opponentTeam').value;
    const venue = document.getElementById('matchVenue').value;
    const date = document.getElementById('matchDate').value;
    const type = document.getElementById('matchType').value;
    
    if (!opponent || !venue || !date || !type) {
        alert('Please fill all required fields');
        return;
    }
    
    if (matchId) {
        // Update existing match
        const index = matches.findIndex(m => m.id === matchId);
        if (index !== -1) {
            matches[index] = {
                ...matches[index],
                opponent,
                venue,
                date,
                type
            };
        }
    } else {
        // Add new match
        const newMatch = {
            id: generateId(),
            opponent,
            venue,
            date,
            type,
            status: 'upcoming',
            squad: [],
            opponentSquad: [],
            toss: null,
            innings: [],
            result: null
        };
        matches.push(newMatch);
    }
    
    saveMatches();
    closeModal('matchModal');
    loadMatches();
    if (document.querySelector('.content-section.active').id === 'dashboard') {
        loadDashboard();
    }
}

// Scoring functions
function startScoring(matchId) {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;
    
    // Open scoring modal
    const modal = document.getElementById('scoringModal');
    document.getElementById('scoringModalTitle').textContent = `Live Scoring: vs ${match.opponent}`;
    
    // Display match info
    document.getElementById('liveMatchInfo').innerHTML = `
        <h3>Peshawar Lions vs ${match.opponent}</h3>
        <p>${match.type} Match | ${formatDate(match.date)} | ${match.venue}</p>
    `;
    
    // Initialize match if not already
    if (match.innings.length === 0) {
        match.innings.push({
            number: 1,
            battingTeam: 'Peshawar Lions',
            bowlingTeam: match.opponent,
            runs: 0,
            wickets: 0,
            overs: 0,
            balls: 0,
            extras: 0,
            batsmen: [],
            bowlers: [],
            fallOfWickets: [],
            currentBatters: [],
            currentBowler: null
        });
        
        // Add all players to squad if empty
        if (match.squad.length === 0) {
            match.squad = players.map(p => p.id);
        }
    }
    
    // Update scorecard
    updateScorecard(match);
    
    // Set up event listeners for scoring buttons
    setupScoringControls(match);
    
    openModal('scoringModal');
}

function updateScorecard(match) {
    const currentInnings = match.innings[match.innings.length - 1];
    
    // Update innings summary
    document.getElementById('inningsSummary').innerHTML = `
        <h4>${currentInnings.battingTeam} Innings</h4>
        <p>${currentInnings.runs}/${currentInnings.wickets} (${currentInnings.overs}.${currentInnings.balls})</p>
        <p>Extras: ${currentInnings.extras}</p>
    `;
    
    // Update batting scorecard
    const battingTableBody = document.getElementById('battingTableBody');
    battingTableBody.innerHTML = '';
    
    currentInnings.batsmen.forEach(batsman => {
        const player = players.find(p => p.id === batsman.playerId) || { name: 'Unknown' };
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${player.name} ${batsman.out ? '(out)' : batsman.onStrike ? '*' : ''}</td>
            <td>${batsman.runs}</td>
            <td>${batsman.balls}</td>
            <td>${batsman.fours}</td>
            <td>${batsman.sixes}</td>
            <td>${batsman.balls > 0 ? ((batsman.runs / batsman.balls) * 100).toFixed(2) : '-'}</td>
        `;
        battingTableBody.appendChild(row);
    });
    
    // Update bowling scorecard
    const bowlingTableBody = document.getElementById('bowlingTableBody');
    bowlingTableBody.innerHTML = '';
    
    currentInnings.bowlers.forEach(bowler => {
        const player = players.find(p => p.id === bowler.playerId) || { name: 'Unknown' };
        const overs = Math.floor(bowler.balls / 6);
        const balls = bowler.balls % 6;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${player.name} ${bowler.current ? '*' : ''}</td>
            <td>${overs}.${balls}</td>
            <td>${bowler.maidens}</td>
            <td>${bowler.runs}</td>
            <td>${bowler.wickets}</td>
            <td>${bowler.balls > 0 ? (bowler.runs / (bowler.balls / 6)).toFixed(2) : '-'}</td>
        `;
        bowlingTableBody.appendChild(row);
    });
    
    // Update current batters
    const currentBattersDiv = document.getElementById('currentBatters');
    currentBattersDiv.innerHTML = '';
    
    currentInnings.currentBatters.forEach(batterId => {
        const batter = currentInnings.batsmen.find(b => b.playerId === batterId);
        const player = players.find(p => p.id === batterId) || { name: 'Unknown' };
        
        if (batter) {
            const batterDiv = document.createElement('div');
            batterDiv.className = 'batter-info';
            batterDiv.innerHTML = `
                <h4>${player.name} ${batter.onStrike ? '(Striker)' : ''}</h4>
                <p>${batter.runs} (${batter.balls})</p>
                <button class="action-btn change-strike-btn" data-player-id="${batterId}">Change Strike</button>
            `;
            currentBattersDiv.appendChild(batterDiv);
            
            // Add event listener to change strike button
            batterDiv.querySelector('.change-strike-btn').addEventListener('click', () => {
                currentInnings.batsmen.forEach(b => {
                    if (b.playerId === batterId) b.onStrike = true;
                    else if (b.onStrike) b.onStrike = false;
                });
                updateScorecard(match);
            });
        }
    });
    
    // Update current bowler
    const currentBowlerDiv = document.getElementById('currentBowler');
    currentBowlerDiv.innerHTML = '';
    
    if (currentInnings.currentBowler) {
        const bowler = currentInnings.bowlers.find(b => b.playerId === currentInnings.currentBowler);
        const player = players.find(p => p.id === currentInnings.currentBowler) || { name: 'Unknown' };
        
        if (bowler) {
            const overs = Math.floor(bowler.balls / 6);
            const balls = bowler.balls % 6;
            currentBowlerDiv.innerHTML = `
                <div class="bowler-info">
                    <h4>${player.name}</h4>
                    <p>${overs}.${balls} - ${bowler.runs}/${bowler.wickets}</p>
                    <button class="action-btn change-bowler-btn">Change Bowler</button>
                </div>
            `;
            
            // Add event listener to change bowler button
            currentBowlerDiv.querySelector('.change-bowler-btn').addEventListener('click', () => {
                // Implement bowler change logic
                alert('Bowler change functionality to be implemented');
            });
        }
    }
}

function setupScoringControls(match) {
    const currentInnings = match.innings[match.innings.length - 1];
    
    // Runs buttons
    document.querySelectorAll('.run-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const runs = parseInt(btn.getAttribute('data-runs'));
            recordBall(match, 'runs', runs);
        });
    });
    
    // Extras buttons
    document.querySelectorAll('.extra-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const extraType = btn.getAttribute('data-extra');
            recordBall(match, extraType);
        });
    });
    
    // Wicket buttons
    document.querySelectorAll('.wicket-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const wicketType = btn.getAttribute('data-wicket');
            recordWicket(match, wicketType);
        });
    });
    
    // End innings button
    document.getElementById('endInningsBtn').addEventListener('click', () => {
        endInnings(match);
    });
    
    // End match button
    document.getElementById('endMatchBtn').addEventListener('click', () => {
        endMatch(match);
    });
}

function recordBall(match, type, runs = 0) {
    const currentInnings = match.innings[match.innings.length - 1];
    
    // Update innings totals
    currentInnings.balls++;
    if (currentInnings.balls % 6 === 0) {
        currentInnings.overs++;
        currentInnings.balls = 0;
    }
    
    // Update bowler stats
    if (currentInnings.currentBowler) {
        const bowler = currentInnings.bowlers.find(b => b.playerId === currentInnings.currentBowler);
        if (bowler) {
            bowler.balls++;
            if (type === 'runs') {
                bowler.runs += runs;
                currentInnings.runs += runs;
            } else if (type === 'wide' || type === 'noball') {
                bowler.runs += 1;
                currentInnings.runs += 1;
                currentInnings.extras += 1;
            }
            
            // Check for maiden over
            if (bowler.balls % 6 === 0 && bowler.runs === 0) {
                bowler.maidens++;
            }
        }
    }
    
    // Update batsman stats
    const striker = currentInnings.batsmen.find(b => b.onStrike);
    if (striker) {
        if (type === 'runs') {
            striker.runs += runs;
            striker.balls++;
            currentInnings.runs += runs;
            
            if (runs === 4) striker.fours++;
            if (runs === 6) striker.sixes++;
            
            // Change strike for odd runs (except last ball of over)
            if (runs % 2 !== 0 && !(currentInnings.balls === 0 && currentInnings.balls % 6 === 0)) {
                currentInnings.batsmen.forEach(b => {
                    b.onStrike = !b.onStrike;
                });
            }
        } else if (type === 'bye' || type === 'legbye') {
            currentInnings.runs += 1;
            currentInnings.extras += 1;
        }
    }
    
    // Save and update UI
    saveMatches();
    updateScorecard(match);
}

function recordWicket(match, type) {
    const currentInnings = match.innings[match.innings.length - 1];
    
    // Update innings totals
    currentInnings.wickets++;
    currentInnings.balls++;
    if (currentInnings.balls % 6 === 0) {
        currentInnings.overs++;
        currentInnings.balls = 0;
    }
    
    // Update bowler stats
    if (currentInnings.currentBowler) {
        const bowler = currentInnings.bowlers.find(b => b.playerId === currentInnings.currentBowler);
        if (bowler) {
            bowler.balls++;
            bowler.wickets++;
        }
    }
    
    // Update batsman stats
    const striker = currentInnings.batsmen.find(b => b.onStrike);
    if (striker) {
        striker.out = true;
        striker.onStrike = false;
        striker.dismissal = type;
        striker.balls++;
        
        // Record fall of wicket
        currentInnings.fallOfWickets.push({
            batsmanId: striker.playerId,
            score: currentInnings.runs,
            wicket: currentInnings.wickets,
            overs: currentInnings.overs,
            balls: currentInnings.balls
        });
    }
    
    // Find next batsman
    const nextBatsmanId = match.squad.find(playerId => 
        !currentInnings.batsmen.some(b => b.playerId === playerId)
    );
    
    if (nextBatsmanId) {
        currentInnings.batsmen.push({
            playerId: nextBatsmanId,
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            out: false,
            onStrike: true,
            dismissal: null
        });
        currentInnings.currentBatters = currentInnings.batsmen
            .filter(b => !b.out)
            .map(b => b.playerId);
    } else {
        // All out
        endInnings(match);
    }
    
    // Save and update UI
    saveMatches();
    updateScorecard(match);
}

function endInnings(match) {
    const currentInnings = match.innings[match.innings.length - 1];
    currentInnings.completed = true;
    
    // Check if match should continue (second innings)
    if (match.innings.length < 2) {
        const nextInnings = {
            number: 2,
            battingTeam: match.opponent,
            bowlingTeam: 'Peshawar Lions',
            runs: 0,
            wickets: 0,
            overs: 0,
            balls: 0,
            extras: 0,
            batsmen: [],
            bowlers: [],
            fallOfWickets: [],
            currentBatters: [],
            currentBowler: null
        };
        match.innings.push(nextInnings);
        alert('First innings completed. Starting second innings.');
    } else {
        // Match completed
        endMatch(match);
    }
    
    saveMatches();
    updateScorecard(match);
}

function endMatch(match) {
    match.status = 'completed';
    
    // Determine result
    if (match.innings.length === 2) {
        const firstInnings = match.innings[0];
        const secondInnings = match.innings[1];
        
        if (firstInnings.runs > secondInnings.runs) {
            match.result = `Peshawar Lions won by ${firstInnings.runs - secondInnings.runs} runs`;
        } else if (secondInnings.runs > firstInnings.runs) {
            const wicketsLeft = 10 - secondInnings.wickets;
            match.result = `${match.opponent} won by ${wicketsLeft} wickets`;
        } else {
            match.result = 'Match tied';
        }
    } else {
        match.result = 'Match completed (single innings)';
    }
    
    // Update player stats
    match.innings.forEach(innings => {
        if (innings.battingTeam === 'Peshawar Lions') {
            innings.batsmen.forEach(batsman => {
                const player = players.find(p => p.id === batsman.playerId);
                if (player) {
                    player.matchesPlayed = (player.matchesPlayed || 0) + 1;
                    player.runs = (player.runs || 0) + batsman.runs;
                    
                    // Add match stats
                    player.stats = player.stats || [];
                    player.stats.push({
                        matchId: match.id,
                        runs: batsman.runs,
                        balls: batsman.balls,
                        wickets: null,
                        overs: null,
                        maidens: null,
                        runsConceded: null
                    });
                }
            });
        }
        
        if (innings.bowlingTeam === 'Peshawar Lions') {
            innings.bowlers.forEach(bowler => {
                const player = players.find(p => p.id === bowler.playerId);
                if (player) {
                    player.matchesPlayed = (player.matchesPlayed || 0) + 1;
                    player.wickets = (player.wickets || 0) + bowler.wickets;
                    
                    // Add match stats
                    const playerStats = player.stats.find(s => s.matchId === match.id);
                    if (playerStats) {
                        playerStats.wickets = bowler.wickets;
                        playerStats.overs = bowler.balls / 6;
                        playerStats.maidens = bowler.maidens;
                        playerStats.runsConceded = bowler.runs;
                    } else {
                        player.stats.push({
                            matchId: match.id,
                            runs: null,
                            balls: null,
                            wickets: bowler.wickets,
                            overs: bowler.balls / 6,
                            maidens: bowler.maidens,
                            runsConceded: bowler.runs
                        });
                    }
                }
            });
        }
    });
    
    savePlayers();
    saveMatches();
    closeModal('scoringModal');
    loadMatches();
    if (document.querySelector('.content-section.active').id === 'dashboard') {
        loadDashboard();
    }
}

function viewScorecard(matchId) {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;
    
    // Open scoring modal in view-only mode
    const modal = document.getElementById('scoringModal');
    document.getElementById('scoringModalTitle').textContent = `Scorecard: vs ${match.opponent}`;
    
    // Display match info
    document.getElementById('liveMatchInfo').innerHTML = `
        <h3>Peshawar Lions vs ${match.opponent}</h3>
        <p>${match.type} Match | ${formatDate(match.date)} | ${match.venue}</p>
        <p class="match-result">${match.result || 'Match completed'}</p>
    `;
    
    // Display all innings
    let inningsHTML = '';
    match.innings.forEach(innings => {
        inningsHTML += `
            <div class="innings-summary">
                <h4>${innings.battingTeam} Innings - ${innings.runs}/${innings.wickets} (${innings.overs}.${innings.balls})</h4>
                <p>Extras: ${innings.extras}</p>
            </div>
        `;
    });
    document.getElementById('inningsSummary').innerHTML = inningsHTML;
    
    // Display batting scorecard for Peshawar Lions
    const lionsInnings = match.innings.find(i => i.battingTeam === 'Peshawar Lions');
    if (lionsInnings) {
        const battingTableBody = document.getElementById('battingTableBody');
        battingTableBody.innerHTML = '';
        
        lionsInnings.batsmen.forEach(batsman => {
            const player = players.find(p => p.id === batsman.playerId) || { name: 'Unknown' };
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${player.name} ${batsman.out ? `(${batsman.dismissal || 'out'})` : batsman.onStrike ? '*' : ''}</td>
                <td>${batsman.runs}</td>
                <td>${batsman.balls}</td>
                <td>${batsman.fours}</td>
                <td>${batsman.sixes}</td>
                <td>${batsman.balls > 0 ? ((batsman.runs / batsman.balls) * 100).toFixed(2) : '-'}</td>
            `;
            battingTableBody.appendChild(row);
        });
    }
    
    // Display bowling scorecard for Peshawar Lions
    const lionsBowling = match.innings.find(i => i.bowlingTeam === 'Peshawar Lions');
    if (lionsBowling) {
        const bowlingTableBody = document.getElementById('bowlingTableBody');
        bowlingTableBody.innerHTML = '';
        
        lionsBowling.bowlers.forEach(bowler => {
            const player = players.find(p => p.id === bowler.playerId) || { name: 'Unknown' };
            const overs = Math.floor(bowler.balls / 6);
            const balls = bowler.balls % 6;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${player.name}</td>
                <td>${overs}.${balls}</td>
                <td>${bowler.maidens}</td>
                <td>${bowler.runs}</td>
                <td>${bowler.wickets}</td>
                <td>${bowler.balls > 0 ? (bowler.runs / (bowler.balls / 6)).toFixed(2) : '-'}</td>
            `;
            bowlingTableBody.appendChild(row);
        });
    }
    
    // Hide scoring controls
    document.querySelector('.scoring-controls').style.display = 'none';
    
    openModal('scoringModal');
}

// Statistics functions
function loadStatistics() {
    // Populate player select
    const statsPlayerSelect = document.getElementById('statsPlayerSelect');
    statsPlayerSelect.innerHTML = '<option value="">Select Player</option>';
    players.forEach(player => {
        statsPlayerSelect.innerHTML += `<option value="${player.id}">${player.name}</option>`;
    });
    
    // Load stats if player is selected
    const urlParams = new URLSearchParams(window.location.search);
    const playerId = urlParams.get('playerId');
    if (playerId) {
        statsPlayerSelect.value = playerId;
        loadPlayerStats();
    }
}

function loadPlayerStats() {
    const playerId = document.getElementById('statsPlayerSelect').value;
    const matchType = document.getElementById('statsMatchType').value;
    
    if (!playerId) {
        document.getElementById('playerStatsContainer').innerHTML = '<p>Please select a player to view statistics.</p>';
        return;
    }
    
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    
    // Filter stats by match type if specified
    let filteredStats = player.stats || [];
    if (matchType !== 'all') {
        filteredStats = filteredStats.filter(stat => {
            const match = matches.find(m => m.id === stat.matchId);
            return match && match.type === matchType;
        });
    }
    
    // Calculate career stats
    const matchesPlayed = player.matchesPlayed || 0;
    const totalRuns = player.runs || 0;
    const totalWickets = player.wickets || 0;
    
    // Batting average
    const battingInnings = filteredStats.filter(s => s.runs !== null).length;
    const dismissals = filteredStats.filter(s => s.runs !== null && s.runs !== undefined).length;
    const battingAverage = dismissals > 0 ? (totalRuns / dismissals).toFixed(2) : '-';
    
    // Batting strike rate
    const totalBalls = filteredStats.reduce((sum, stat) => sum + (stat.balls || 0), 0);
    const battingStrikeRate = totalBalls > 0 ? ((totalRuns / totalBalls) * 100).toFixed(2) : '-';
    
    // Hundreds and fifties
    const hundreds = filteredStats.filter(s => s.runs >= 100).length;
    const fifties = filteredStats.filter(s => s.runs >= 50 && s.runs < 100).length;
    
    // Bowling average
    const bowlingAverage = totalWickets > 0 ? (filteredStats.reduce((sum, stat) => sum + (stat.runsConceded || 0), 0) / totalWickets).toFixed(2) : '-';
    
    // Bowling economy
    const totalOvers = filteredStats.reduce((sum, stat) => sum + (stat.overs || 0), 0);
    const bowlingEconomy = totalOvers > 0 ? (filteredStats.reduce((sum, stat) => sum + (stat.runsConceded || 0), 0) / totalOvers).toFixed(2) : '-';
    
    // Best bowling
    let bestBowling = null;
    filteredStats.forEach(stat => {
        if (stat.wickets > 0) {
            if (!bestBowling || stat.wickets > bestBowling.wickets || 
                (stat.wickets === bestBowling.wickets && stat.runsConceded < bestBowling.runsConceded)) {
                bestBowling = stat;
            }
        }
    });
    
    // Display stats overview
    document.getElementById('statsOverview').innerHTML = `
        <div class="stats-overview-grid">
            <div class="stat-card">
                <h3>${matchesPlayed}</h3>
                <p>Matches</p>
            </div>
            <div class="stat-card">
                <h3>${totalRuns}</h3>
                <p>Runs</p>
            </div>
            <div class="stat-card">
                <h3>${battingAverage}</h3>
                <p>Batting Avg</p>
            </div>
            <div class="stat-card">
                <h3>${battingStrikeRate}</h3>
                <p>Strike Rate</p>
            </div>
            <div class="stat-card">
                <h3>${hundreds}/${fifties}</h3>
                <p>100s/50s</p>
            </div>
            <div class="stat-card">
                <h3>${totalWickets}</h3>
                <p>Wickets</p>
            </div>
            <div class="stat-card">
                <h3>${bowlingAverage}</h3>
                <p>Bowling Avg</p>
            </div>
            <div class="stat-card">
                <h3>${bowlingEconomy}</h3>
                <p>Economy</p>
            </div>
            <div class="stat-card">
                <h3>${bestBowling ? `${bestBowling.wickets}/${bestBowling.runsConceded}` : '-'}</h3>
                <p>Best Bowling</p>
            </div>
        </div>
    `;
    
    // Prepare data for graphs
    const matchRuns = [];
    const matchWickets = [];
    const matchLabels = [];
    
    filteredStats.forEach(stat => {
        const match = matches.find(m => m.id === stat.matchId);
        if (match) {
            matchLabels.push(`vs ${match.opponent} (${formatDate(match.date)})`);
            matchRuns.push(stat.runs || 0);
            matchWickets.push(stat.wickets || 0);
        }
    });
    
    // Create runs graph
    const runsCtx = document.getElementById('runsGraph').getContext('2d');
    new Chart(runsCtx, {
        type: 'bar',
        data: {
            labels: matchLabels,
            datasets: [{
                label: 'Runs',
                data: matchRuns,
                backgroundColor: 'rgba(52, 152, 219, 0.7)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Create wickets graph
    const wicketsCtx = document.getElementById('wicketsGraph').getContext('2d');
    new Chart(wicketsCtx, {
        type: 'bar',
        data: {
            labels: matchLabels,
            datasets: [{
                label: 'Wickets',
                data: matchWickets,
                backgroundColor: 'rgba(231, 76, 60, 0.7)',
                borderColor: 'rgba(231, 76, 60, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Leaderboard functions
function loadLeaderboard(type = 'runs') {
    const leaderboardBody = document.getElementById('leaderboardBody');
    const leaderboardStatHeader = document.getElementById('leaderboardStatHeader');
    
    // Sort players based on the selected leaderboard type
    let sortedPlayers = [];
    let statName = '';
    
    switch(type) {
        case 'runs':
            sortedPlayers = [...players].sort((a, b) => (b.runs || 0) - (a.runs || 0));
            statName = 'Runs';
            break;
        case 'wickets':
            sortedPlayers = [...players].sort((a, b) => (b.wickets || 0) - (a.wickets || 0));
            statName = 'Wickets';
            break;
        case 'economy':
            // Filter players who have bowled at least 10 overs
            sortedPlayers = [...players].filter(p => {
                const totalOvers = (p.stats || []).reduce((sum, stat) => sum + (stat.overs || 0), 0);
                return totalOvers >= 10;
            }).sort((a, b) => {
                const aRuns = (a.stats || []).reduce((sum, stat) => sum + (stat.runsConceded || 0), 0);
                const aOvers = (a.stats || []).reduce((sum, stat) => sum + (stat.overs || 0), 0);
                const aEcon = aOvers > 0 ? aRuns / aOvers : 0;
                
                const bRuns = (b.stats || []).reduce((sum, stat) => sum + (stat.runsConceded || 0), 0);
                const bOvers = (b.stats || []).reduce((sum, stat) => sum + (stat.overs || 0), 0);
                const bEcon = bOvers > 0 ? bRuns / bOvers : 0;
                
                return aEcon - bEcon;
            });
            statName = 'Economy';
            break;
        case 'strike-rate':
            // Filter players who have faced at least 50 balls
            sortedPlayers = [...players].filter(p => {
                const totalBalls = (p.stats || []).reduce((sum, stat) => sum + (stat.balls || 0), 0);
                return totalBalls >= 50;
            }).sort((a, b) => {
                const aRuns = a.runs || 0;
                const aBalls = (a.stats || []).reduce((sum, stat) => sum + (stat.balls || 0), 0);
                const aSR = aBalls > 0 ? (aRuns / aBalls) * 100 : 0;
                
                const bRuns = b.runs || 0;
                const bBalls = (b.stats || []).reduce((sum, stat) => sum + (stat.balls || 0), 0);
                const bSR = bBalls > 0 ? (bRuns / bBalls) * 100 : 0;
                
                return bSR - aSR;
            });
            statName = 'Strike Rate';
            break;
    }
    
    leaderboardStatHeader.textContent = statName;
    
    if (sortedPlayers.length === 0) {
        leaderboardBody.innerHTML = '<tr><td colspan="4">No data available for this leaderboard.</td></tr>';
        return;
    }
    
    let leaderboardHTML = '';
    sortedPlayers.slice(0, 10).forEach((player, index) => {
        let statValue = '';
        
        switch(type) {
            case 'runs':
                statValue = player.runs || 0;
                break;
            case 'wickets':
                statValue = player.wickets || 0;
                break;
            case 'economy':
                const runsConceded = (player.stats || []).reduce((sum, stat) => sum + (stat.runsConceded || 0), 0);
                const oversBowled = (player.stats || []).reduce((sum, stat) => sum + (stat.overs || 0), 0);
                statValue = oversBowled > 0 ? (runsConceded / oversBowled).toFixed(2) : '-';
                break;
            case 'strike-rate':
                const runsScored = player.runs || 0;
                const ballsFaced = (player.stats || []).reduce((sum, stat) => sum + (stat.balls || 0), 0);
                statValue = ballsFaced > 0 ? ((runsScored / ballsFaced) * 100).toFixed(2) : '-';
                break;
        }
        
        leaderboardHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${player.name}</td>
                <td>${player.matchesPlayed || 0}</td>
                <td>${statValue}</td>
            </tr>
        `;
    });
    
    leaderboardBody.innerHTML = leaderboardHTML;
}

// Team Feed functions
function loadTeamFeed() {
    const feedContainer = document.getElementById('teamFeedContainer');
    
    if (posts.length === 0) {
        feedContainer.innerHTML = '<p>No posts yet. Be the first to post!</p>';
        return;
    }
    
    // Sort posts by date (newest first)
    const sortedPosts = [...posts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    let feedHTML = '';
    sortedPosts.forEach(post => {
        feedHTML += `
            <div class="feed-post">
                <div class="post-header">
                    <div class="post-user">Peshawar Lions</div>
                    <div class="post-time">${formatDateTime(post.timestamp)}</div>
                </div>
                <div class="post-content">
                    <p>${post.content}</p>
                </div>
                ${post.media ? `
                    <div class="post-media">
                        <img src="${post.media}" alt="Post media">
                    </div>
                ` : ''}
                ${post.poll ? `
                    <div class="post-poll">
                        <div class="poll-question">${post.poll.question}</div>
                        ${post.poll.options.map(option => `
                            <div class="poll-option" data-post-id="${post.id}" data-option="${option.text}">
                                ${option.text}
                                <div class="poll-results">
                                    <span>${option.votes} votes (${post.poll.totalVotes > 0 ? Math.round((option.votes / post.poll.totalVotes) * 100) : 0}%)</span>
                                    <div class="poll-bar">
                                        <div class="poll-fill" style="width: ${post.poll.totalVotes > 0 ? (option.votes / post.poll.totalVotes) * 100 : 0}%"></div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="post-actions">
                    <button class="post-action like-btn" data-post-id="${post.id}">
                        <i class="fas fa-thumbs-up"></i> Like (${post.likes || 0})
                    </button>
                    <button class="post-action comment-btn" data-post-id="${post.id}">
                        <i class="fas fa-comment"></i> Comment (${post.comments?.length || 0})
                    </button>
                </div>
                ${post.comments?.length > 0 ? `
                    <div class="post-comments">
                        ${post.comments.map(comment => `
                            <div class="comment">
                                <span class="comment-user">${comment.user}</span>
                                <span class="comment-text">${comment.text}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="comment-input" data-post-id="${post.id}" style="display: none;">
                    <input type="text" placeholder="Write a comment...">
                    <button class="comment-submit-btn">Post</button>
                </div>
            </div>
        `;
    });
    
    feedContainer.innerHTML = feedHTML;
    
    // Add event listeners
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const postId = btn.getAttribute('data-post-id');
            const post = posts.find(p => p.id === postId);
            if (post) {
                post.likes = (post.likes || 0) + 1;
                savePosts();
                loadTeamFeed();
            }
        });
    });
    
    document.querySelectorAll('.comment-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const postId = btn.getAttribute('data-post-id');
            document.querySelector(`.comment-input[data-post-id="${postId}"]`).style.display = 'flex';
        });
    });
    
    document.querySelectorAll('.comment-submit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const postId = btn.parentElement.getAttribute('data-post-id');
            const input = btn.previousElementSibling;
            const commentText = input.value.trim();
            
            if (commentText) {
                const post = posts.find(p => p.id === postId);
                if (post) {
                    post.comments = post.comments || [];
                    post.comments.push({
                        user: 'You',
                        text: commentText,
                        timestamp: new Date().toISOString()
                    });
                    savePosts();
                    loadTeamFeed();
                }
            }
        });
    });
    
    document.querySelectorAll('.poll-option').forEach(option => {
        option.addEventListener('click', () => {
            const postId = option.getAttribute('data-post-id');
            const optionText = option.getAttribute('data-option');
            
            const post = posts.find(p => p.id === postId);
            if (post && post.poll) {
                // Check if user already voted
                if (post.poll.voters && post.poll.voters.includes('user1')) {
                    alert('You have already voted in this poll');
                    return;
                }
                
                // Update poll results
                const pollOption = post.poll.options.find(o => o.text === optionText);
                if (pollOption) {
                    pollOption.votes += 1;
                    post.poll.totalVotes += 1;
                    post.poll.voters = post.poll.voters || [];
                    post.poll.voters.push('user1');
                    savePosts();
                    loadTeamFeed();
                }
            }
        });
    });
}

function handlePostSubmit(e) {
    e.preventDefault();
    
    const content = document.getElementById('postContent').value;
    const mediaFile = document.getElementById('postMedia').files[0];
    const pollQuestion = document.getElementById('postPollQuestion').value;
    const pollOptions = Array.from(document.querySelectorAll('.poll-option')).map(input => input.value);
    
    if (!content) {
        alert('Please enter post content');
        return;
    }
    
    // Handle media upload
    let mediaUrl = '';
    if (mediaFile) {
        mediaUrl = URL.createObjectURL(mediaFile);
    }
    
    // Handle poll creation
    let poll = null;
    if (pollQuestion && pollOptions.length >= 2) {
        poll = {
            question: pollQuestion,
            options: pollOptions.map(option => ({
                text: option,
                votes: 0
            })),
            totalVotes: 0
        };
    }
    
    // Create new post
    const newPost = {
        id: generateId(),
        content,
        media: mediaUrl,
        poll,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: []
    };
    
    posts.push(newPost);
    savePosts();
    closeModal('postModal');
    loadTeamFeed();
}

function addPollOption() {
    const container = document.getElementById('pollOptionsContainer');
    const optionCount = container.querySelectorAll('.poll-option').length;
    
    if (optionCount >= 5) {
        alert('Maximum 5 poll options allowed');
        return;
    }
    
    const newOption = document.createElement('input');
    newOption.type = 'text';
    newOption.className = 'poll-option';
    newOption.placeholder = `Option ${optionCount + 1}`;
    container.appendChild(newOption);
}

// Admin functions
function checkAdminLogin() {
    const adminPanelSection = document.getElementById('adminPanelSection');
    const adminLoginSection = document.getElementById('adminLoginSection');
    
    if (currentUser) {
        adminLoginSection.style.display = 'none';
        adminPanelSection.style.display = 'block';
    } else {
        adminLoginSection.style.display = 'block';
        adminPanelSection.style.display = 'none';
    }
}

function handleAdminLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    if (username === adminCredentials.username && password === adminCredentials.password) {
        currentUser = { username };
        checkAdminLogin();
        document.getElementById('adminLoginForm').reset();
    } else {
        alert('Invalid username or password');
    }
}

function handleImportData(e) {
    e.preventDefault();
    
    const importType = document.getElementById('importType').value;
    const fileInput = document.getElementById('importFile');
    
    if (!importType || !fileInput.files.length) {
        alert('Please select import type and file');
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (importType === 'players') {
                if (Array.isArray(data)) {
                    players = data;
                    savePlayers();
                    alert('Players imported successfully!');
                    loadPlayers();
                } else {
                    alert('Invalid players data format');
                }
            } else if (importType === 'matches') {
                if (Array.isArray(data)) {
                    matches = data;
                    saveMatches();
                    alert('Matches imported successfully!');
                    loadMatches();
                } else {
                    alert('Invalid matches data format');
                }
            }
            
            closeModal('importModal');
        } catch (error) {
            alert('Error parsing file: ' + error.message);
        }
    };
    
    reader.readAsText(file);
}

function handleTeamSettings(e) {
    e.preventDefault();
    
    const primaryColor = document.getElementById('primaryColor').value;
    const secondaryColor = document.getElementById('secondaryColor').value;
    const logoFile = document.getElementById('teamLogo').files[0];
    const jerseyFile = document.getElementById('jerseyDesign').files[0];
    
    // Update theme colors
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
    
    // Update logo if provided
    if (logoFile) {
        const logoUrl = URL.createObjectURL(logoFile);
        document.querySelector('.header-logo').src = logoUrl;
        document.querySelector('.logo-animation').src = logoUrl;
    }
    
    // TODO: Handle jersey design
    
    alert('Team settings updated successfully!');
    closeModal('settingsModal');
}

// Utility functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatDateTime(dateTimeString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateTimeString).toLocaleDateString(undefined, options);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);