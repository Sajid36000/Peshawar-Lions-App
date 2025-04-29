// ===== APP INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

function initApp() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Initialize data structures if they don't exist
    initData();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load initial data
    loadDashboard();
    
    // Hide splash screen after animation
    setTimeout(() => {
        document.querySelector('.splash-screen').style.display = 'none';
    }, 2500);
}

// ===== DATA MANAGEMENT =====
function initData() {
    // Initialize localStorage with empty data structures if they don't exist
    if (!localStorage.getItem('players')) {
        localStorage.setItem('players', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('matches')) {
        localStorage.setItem('matches', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('posts')) {
        localStorage.setItem('posts', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('teamSettings')) {
        localStorage.setItem('teamSettings', JSON.stringify({
            teamName: 'Peshawar Lions',
            primaryColor: '#1a5276',
            secondaryColor: '#d35400',
            logo: 'https://drive.google.com/uc?export=view&id=1_XbG-xZq0zkbe1alONlTnT6bltZ-J8Jp'
        }));
    }
}

function getPlayers() {
    return JSON.parse(localStorage.getItem('players')) || [];
}

function savePlayers(players) {
    localStorage.setItem('players', JSON.stringify(players));
}

function getMatches() {
    return JSON.parse(localStorage.getItem('matches')) || [];
}

function saveMatches(matches) {
    localStorage.setItem('matches', JSON.stringify(matches));
}

function getPosts() {
    return JSON.parse(localStorage.getItem('posts')) || [];
}

function savePosts(posts) {
    localStorage.setItem('posts', JSON.stringify(posts));
}

function getTeamSettings() {
    return JSON.parse(localStorage.getItem('teamSettings')) || {};
}

function saveTeamSettings(settings) {
    localStorage.setItem('teamSettings', JSON.stringify(settings));
    updateThemeColors();
}

// ===== THEME MANAGEMENT =====
function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        document.querySelector('.theme-toggle i').className = 'fas fa-sun';
    } else {
        document.body.classList.remove('dark-mode');
        document.querySelector('.theme-toggle i').className = 'fas fa-moon';
    }
    localStorage.setItem('theme', theme);
}

function updateThemeColors() {
    const settings = getTeamSettings();
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);
    
    // Calculate darker/lighter variants
    const primaryDark = shadeColor(settings.primaryColor, -20);
    const primaryLight = shadeColor(settings.primaryColor, 20);
    const secondaryDark = shadeColor(settings.secondaryColor, -20);
    const secondaryLight = shadeColor(settings.secondaryColor, 20);
    
    document.documentElement.style.setProperty('--primary-dark', primaryDark);
    document.documentElement.style.setProperty('--primary-light', primaryLight);
    document.documentElement.style.setProperty('--secondary-dark', secondaryDark);
    document.documentElement.style.setProperty('--secondary-light', secondaryLight);
}

// Helper function to lighten/darken colors
function shadeColor(color, percent) {
    let R = parseInt(color.substring(1,3), 16);
    let G = parseInt(color.substring(3,5), 16);
    let B = parseInt(color.substring(5,7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  

    R = Math.round(R);
    G = Math.round(G);
    B = Math.round(B);

    const RR = ((R.toString(16).length===1)?"0"+R.toString(16):R.toString(16);
    const GG = ((G.toString(16).length===1)?"0"+G.toString(16):G.toString(16);
    const BB = ((B.toString(16).length===1)?"0"+B.toString(16):B.toString(16);

    return "#"+RR+GG+BB;
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Theme toggle
    document.querySelector('.theme-toggle').addEventListener('click', function() {
        const currentTheme = localStorage.getItem('theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });
    
    // Menu toggle for mobile
    document.querySelector('.menu-toggle').addEventListener('click', function() {
        document.querySelector('.sidebar').classList.toggle('active');
    });
    
    // Navigation links
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            showSection(sectionId);
            
            // Update active state
            document.querySelectorAll('.sidebar-menu a').forEach(item => {
                item.classList.remove('active');
            });
            this.classList.add('active');
            
            // Close sidebar on mobile
            document.querySelector('.sidebar').classList.remove('active');
        });
    });
    
    // Add player button
    document.getElementById('add-player-btn').addEventListener('click', function() {
        showAddPlayerModal();
    });
    
    // Player form submission
    document.getElementById('player-form').addEventListener('submit', function(e) {
        e.preventDefault();
        savePlayer();
    });
    
    // Add match button
    document.getElementById('add-match-btn').addEventListener('click', function() {
        showAddMatchModal();
    });
    
    // Match form submission
    document.getElementById('match-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveMatch();
    });
    
    // Create post button
    document.getElementById('create-post-btn').addEventListener('click', function() {
        showCreatePostModal();
    });
    
    // Post form submission
    document.getElementById('post-form').addEventListener('submit', function(e) {
        e.preventDefault();
        savePost();
    });
    
    // Add poll option button
    document.getElementById('add-poll-option').addEventListener('click', function() {
        addPollOption();
    });
    
    // Team settings form submission
    document.getElementById('team-settings-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveTeamSettingsForm();
    });
    
    // Export data button
    document.getElementById('export-data-btn').addEventListener('click', function() {
        exportData();
    });
    
    // Import data button
    document.getElementById('import-data-btn').addEventListener('click', function() {
        document.getElementById('data-file').click();
    });
    
    // Data file input change
    document.getElementById('data-file').addEventListener('change', function(e) {
        importData(e);
    });
    
    // Modal close buttons
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Click outside modal to close
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// ===== UI NAVIGATION =====
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show the requested section
    document.getElementById(sectionId).style.display = 'block';
    
    // Load section-specific content
    switch(sectionId) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'players':
            loadPlayers();
            break;
        case 'matches':
            loadMatches();
            break;
        case 'statistics':
            loadStatistics();
            break;
        case 'leaderboard':
            loadLeaderboard();
            break;
        case 'team-feed':
            loadTeamFeed();
            break;
        case 'admin':
            loadAdminPanel();
            break;
        case 'themes':
            loadThemeSettings();
            break;
    }
    
    // Update page title
    document.querySelector('.header-title h1').textContent = sectionId.charAt(0).toUpperCase() + sectionId.slice(1).replace('-', ' ');
}

// ===== DASHBOARD =====
function loadDashboard() {
    const players = getPlayers();
    const matches = getMatches();
    
    // Update stats cards
    document.getElementById('total-players').textContent = players.length;
    
    const upcomingMatches = matches.filter(match => new Date(match.date) > new Date());
    document.getElementById('upcoming-matches').textContent = upcomingMatches.length;
    
    const playedMatches = matches.filter(match => new Date(match.date) <= new Date());
    document.getElementById('matches-played').textContent = playedMatches.length;
    
    // Find top performers
    if (players.length > 0) {
        const topScorer = [...players].sort((a, b) => (b.runs || 0) - (a.runs || 0))[0];
        document.getElementById('top-scorer').textContent = `${topScorer.name} (${topScorer.runs || 0})`;
        
        const topWicketTaker = [...players].sort((a, b) => (b.wickets || 0) - (a.wickets || 0))[0];
        document.getElementById('top-wicket-taker').textContent = `${topWicketTaker.name} (${topWicketTaker.wickets || 0})`;
    }
    
    // Load recent matches
    const recentMatches = [...matches]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    const matchesTable = document.getElementById('recent-matches');
    matchesTable.innerHTML = '';
    
    recentMatches.forEach(match => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(match.date)}</td>
            <td>${match.opponent}</td>
            <td>${match.venue}</td>
            <td>${match.result || 'Not played yet'}</td>
            <td><button class="btn btn-sm btn-outline">View</button></td>
        `;
        matchesTable.appendChild(row);
    });
    
    // TODO: Initialize performance chart
    // This would typically use a charting library like Chart.js
}

// ===== PLAYER MANAGEMENT =====
function loadPlayers() {
    const players = getPlayers();
    const playersGrid = document.getElementById('players-grid');
    playersGrid.innerHTML = '';
    
    if (players.length === 0) {
        playersGrid.innerHTML = '<p>No players added yet. Click "Add Player" to get started.</p>';
        return;
    }
    
    players.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = 'player-card';
        playerCard.innerHTML = `
            <div class="player-img">
                <img src="${player.photo || 'https://via.placeholder.com/300x200?text=No+Photo'}" alt="${player.name}">
            </div>
            <div class="player-info">
                <h3>${player.name}</h3>
                <p>${player.role} • ${player.battingStyle} batsman</p>
                <p>${player.bowlingStyle !== 'None' ? player.bowlingStyle + ' bowler' : 'Does not bowl'}</p>
                <div class="player-stats">
                    <div class="stat">
                        <h4>Matches</h4>
                        <p>${player.matches || 0}</p>
                    </div>
                    <div class="stat">
                        <h4>Runs</h4>
                        <p>${player.runs || 0}</p>
                    </div>
                    <div class="stat">
                        <h4>Wickets</h4>
                        <p>${player.wickets || 0}</p>
                    </div>
                </div>
            </div>
        `;
        playersGrid.appendChild(playerCard);
    });
}

function showAddPlayerModal() {
    document.getElementById('add-player-modal').style.display = 'flex';
}

function savePlayer() {
    const name = document.getElementById('player-name').value;
    const role = document.getElementById('player-role').value;
    const battingStyle = document.getElementById('batting-style').value;
    const bowlingStyle = document.getElementById('bowling-style').value;
    const photoInput = document.getElementById('player-photo');
    
    // Basic validation
    if (!name || !role || !battingStyle || !photoInput.files[0]) {
        alert('Please fill all required fields');
        return;
    }
    
    // Create player object
    const player = {
        id: Date.now().toString(),
        name,
        role,
        battingStyle,
        bowlingStyle: bowlingStyle || 'None',
        photo: URL.createObjectURL(photoInput.files[0]),
        matches: 0,
        runs: 0,
        wickets: 0,
        createdAt: new Date().toISOString()
    };
    
    // Save to localStorage
    const players = getPlayers();
    players.push(player);
    savePlayers(players);
    
    // Reset form and close modal
    document.getElementById('player-form').reset();
    document.getElementById('add-player-modal').style.display = 'none';
    
    // Refresh players list
    loadPlayers();
}

// ===== MATCH MANAGEMENT =====
function loadMatches() {
    const matches = getMatches();
    const upcomingTable = document.getElementById('upcoming-matches-table');
    upcomingTable.innerHTML = '';
    
    const upcomingMatches = matches.filter(match => new Date(match.date) > new Date());
    const pastMatches = matches.filter(match => new Date(match.date) <= new Date());
    
    if (upcomingMatches.length === 0) {
        upcomingTable.innerHTML = '<tr><td colspan="5">No upcoming matches scheduled</td></tr>';
    } else {
        upcomingMatches.forEach(match => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDate(match.date)}</td>
                <td>${match.opponent}</td>
                <td>${match.venue}</td>
                <td>${match.type}</td>
                <td>
                    <button class="btn btn-sm btn-primary start-match-btn" data-id="${match.id}">Start</button>
                    <button class="btn btn-sm btn-danger delete-match-btn" data-id="${match.id}">Delete</button>
                </td>
            `;
            upcomingTable.appendChild(row);
        });
    }
    
    // Add event listeners to buttons
    document.querySelectorAll('.start-match-btn').forEach(button => {
        button.addEventListener('click', function() {
            const matchId = this.getAttribute('data-id');
            startMatch(matchId);
        });
    });
    
    document.querySelectorAll('.delete-match-btn').forEach(button => {
        button.addEventListener('click', function() {
            const matchId = this.getAttribute('data-id');
            deleteMatch(matchId);
        });
    });
    
    // Load live matches section
    const liveMatchesSection = document.getElementById('live-matches');
    liveMatchesSection.innerHTML = '';
    
    const liveMatches = pastMatches.filter(match => match.status === 'live');
    
    if (liveMatches.length === 0) {
        liveMatchesSection.innerHTML = '<p>No live matches at the moment</p>';
    } else {
        liveMatches.forEach(match => {
            const matchCard = document.createElement('div');
            matchCard.className = 'card';
            matchCard.innerHTML = `
                <div class="card-header">
                    <h3>${match.opponent} - ${match.type}</h3>
                    <button class="btn btn-primary continue-match-btn" data-id="${match.id}">Continue</button>
                </div>
                <div class="card-body">
                    <p>Date: ${formatDate(match.date)}</p>
                    <p>Venue: ${match.venue}</p>
                    <p>Status: ${match.status}</p>
                </div>
            `;
            liveMatchesSection.appendChild(matchCard);
            
            // Add event listener to continue button
            matchCard.querySelector('.continue-match-btn').addEventListener('click', function() {
                const matchId = this.getAttribute('data-id');
                continueMatch(matchId);
            });
        });
    }
}

function showAddMatchModal() {
    document.getElementById('add-match-modal').style.display = 'flex';
}

function saveMatch() {
    const date = document.getElementById('match-date').value;
    const opponent = document.getElementById('opponent-team').value;
    const venue = document.getElementById('match-venue').value;
    const type = document.getElementById('match-type').value;
    
    // Basic validation
    if (!date || !opponent || !venue || !type) {
        alert('Please fill all required fields');
        return;
    }
    
    // Create match object
    const match = {
        id: Date.now().toString(),
        date,
        opponent,
        venue,
        type,
        status: 'scheduled',
        createdAt: new Date().toISOString()
    };
    
    // Save to localStorage
    const matches = getMatches();
    matches.push(match);
    saveMatches(matches);
    
    // Reset form and close modal
    document.getElementById('match-form').reset();
    document.getElementById('add-match-modal').style.display = 'none';
    
    // Refresh matches list
    loadMatches();
}

function startMatch(matchId) {
    const matches = getMatches();
    const matchIndex = matches.findIndex(m => m.id === matchId);
    
    if (matchIndex !== -1) {
        matches[matchIndex].status = 'live';
        matches[matchIndex].startedAt = new Date().toISOString();
        matches[matchIndex].team1 = {
            name: 'Peshawar Lions',
            players: getPlayers().map(p => p.id),
            runs: 0,
            wickets: 0,
            overs: 0,
            balls: 0
        };
        matches[matchIndex].team2 = {
            name: matches[matchIndex].opponent,
            players: [], // Will be added when scoring starts
            runs: 0,
            wickets: 0,
            overs: 0,
            balls: 0
        };
        matches[matchIndex].currentInnings = 1;
        matches[matchIndex].currentBatsmen = [];
        matches[matchIndex].currentBowler = null;
        matches[matchIndex].battingStats = {};
        matches[matchIndex].bowlingStats = {};
        
        saveMatches(matches);
        
        // Open live scoring modal
        openLiveScoringModal(matchId);
    }
}

function continueMatch(matchId) {
    openLiveScoringModal(matchId);
}

function deleteMatch(matchId) {
    if (confirm('Are you sure you want to delete this match?')) {
        const matches = getMatches();
        const updatedMatches = matches.filter(m => m.id !== matchId);
        saveMatches(updatedMatches);
        loadMatches();
    }
}

function openLiveScoringModal(matchId) {
    const matches = getMatches();
    const match = matches.find(m => m.id === matchId);
    
    if (!match) return;
    
    // Update modal title
    document.getElementById('live-match-title').textContent = `${match.team1.name} vs ${match.team2.name}`;
    document.getElementById('live-match-venue').textContent = `${match.venue} - ${formatDate(match.date)}`;
    
    // Update scores
    document.getElementById('team1-score').textContent = 
        `${match.team1.runs}/${match.team1.wickets} (${match.team1.overs}.${match.team1.balls})`;
    document.getElementById('team2-score').textContent = 
        `${match.team2.runs}/${match.team2.wickets} (${match.team2.overs}.${match.team2.balls})`;
    
    // TODO: Update batsmen and bowlers tables
    // This would require more complex logic to track individual performances
    
    // Show modal
    document.getElementById('live-scoring-modal').style.display = 'flex';
    
    // Set up scoring buttons
    document.querySelectorAll('.score-btn').forEach(button => {
        button.addEventListener('click', function() {
            const runs = this.getAttribute('data-runs') || (this.classList.contains('wide') ? 'wd' : 
                       (this.classList.contains('noball') ? 'nb' : 
                       (this.classList.contains('wicket') ? 'w' : '0');
            
            updateMatchScore(matchId, runs);
        });
    });
    
    // Set up innings change button
    document.getElementById('change-innings').addEventListener('click', function() {
        changeInnings(matchId);
    });
}

function updateMatchScore(matchId, runs) {
    const matches = getMatches();
    const matchIndex = matches.findIndex(m => m.id === matchId);
    
    if (matchIndex === -1) return;
    
    const match = matches[matchIndex];
    const currentTeam = match.currentInnings === 1 ? 'team1' : 'team2';
    
    // Update score based on runs
    if (runs === 'wd' || runs === 'nb') {
        // Wide or no-ball - extra run only
        match[currentTeam].runs += 1;
    } else if (runs === 'w') {
        // Wicket
        match[currentTeam].wickets += 1;
        match[currentTeam].balls += 1;
    } else if (runs === 'b' || runs === 'lb') {
        // Bye or leg bye - no ball faced
        match[currentTeam].runs += 1;
    } else {
        // Normal runs
        const runsNum = parseInt(runs);
        match[currentTeam].runs += runsNum;
        match[currentTeam].balls += 1;
    }
    
    // Update overs if needed
    if (match[currentTeam].balls >= 6) {
        match[currentTeam].overs += 1;
        match[currentTeam].balls = 0;
    }
    
    // TODO: Update individual player stats
    
    // Save updated match
    matches[matchIndex] = match;
    saveMatches(matches);
    
    // Update UI
    document.getElementById(`${currentTeam}-score`).textContent = 
        `${match[currentTeam].runs}/${match[currentTeam].wickets} (${match[currentTeam].overs}.${match[currentTeam].balls})`;
}

function changeInnings(matchId) {
    const matches = getMatches();
    const matchIndex = matches.findIndex(m => m.id === matchId);
    
    if (matchIndex === -1) return;
    
    const match = matches[matchIndex];
    
    if (match.currentInnings === 1) {
        match.currentInnings = 2;
    } else {
        // End of match
        match.status = 'completed';
        match.completedAt = new Date().toISOString();
        
        // Determine result
        if (match.team1.runs > match.team2.runs) {
            match.result = `${match.team1.name} won by ${match.team1.runs - match.team2.runs} runs`;
        } else if (match.team2.runs > match.team1.runs) {
            match.result = `${match.team2.name} won by ${10 - match.team2.wickets} wickets`;
        } else {
            match.result = 'Match tied';
        }
    }
    
    // Save updated match
    matches[matchIndex] = match;
    saveMatches(matches);
    
    // Update UI or close modal if match ended
    if (match.status === 'completed') {
        alert(`Match completed: ${match.result}`);
        document.getElementById('live-scoring-modal').style.display = 'none';
        loadMatches();
    } else {
        document.getElementById('team1-score').textContent = 
            `${match.team1.runs}/${match.team1.wickets} (${match.team1.overs}.${match.team1.balls})`;
        document.getElementById('team2-score').textContent = 
            `${match.team2.runs}/${match.team2.wickets} (${match.team2.overs}.${match.team2.balls})`;
    }
}

// ===== STATISTICS =====
function loadStatistics() {
    const players = getPlayers();
    const matches = getMatches();
    
    // Populate player filter dropdown
    const playerFilter = document.getElementById('stats-player-filter');
    playerFilter.innerHTML = '<option value="">All Players</option>';
    
    players.forEach(player => {
        const option = document.createElement('option');
        option.value = player.id;
        option.textContent = player.name;
        playerFilter.appendChild(option);
    });
    
    // Add event listener to filters
    playerFilter.addEventListener('change', updateStatsTable);
    document.getElementById('stats-match-type-filter').addEventListener('change', updateStatsTable);
    
    // Initialize stats table
    updateStatsTable();
}

function updateStatsTable() {
    const players = getPlayers();
    const matches = getMatches();
    const playerFilter = document.getElementById('stats-player-filter').value;
    const matchTypeFilter = document.getElementById('stats-match-type-filter').value;
    
    // Filter players if needed
    let filteredPlayers = players;
    if (playerFilter) {
        filteredPlayers = players.filter(p => p.id === playerFilter);
    }
    
    // Filter matches if needed
    let filteredMatches = matches;
    if (matchTypeFilter) {
        filteredMatches = matches.filter(m => m.type === matchTypeFilter);
    }
    
    // Update stats table
    const statsTable = document.getElementById('player-stats-table');
    statsTable.innerHTML = '';
    
    filteredPlayers.forEach(player => {
        // Calculate stats for this player
        const playerMatches = filteredMatches.filter(m => 
            m.status === 'completed' && 
            (m.team1.players.includes(player.id) || 
            (m.team2 && m.team2.players.includes(player.id))
            .length;
        
        const runs = player.runs || 0;
        const wickets = player.wickets || 0;
        const battingAvg = playerMatches > 0 ? (runs / playerMatches).toFixed(2) : 0;
        const bowlingAvg = wickets > 0 ? (runs / wickets).toFixed(2) : 0;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${player.name}</td>
            <td>${playerMatches}</td>
            <td>${runs}</td>
            <td>${battingAvg}</td>
            <td>${player.strikeRate || 0}</td>
            <td>${player.hundreds || 0}/${player.fifties || 0}</td>
            <td>${wickets}</td>
            <td>${bowlingAvg}</td>
            <td>${player.economy || 0}</td>
            <td>${player.bestBowling || '-'}</td>
        `;
        statsTable.appendChild(row);
    });
    
    // TODO: Update stats chart
}

// ===== LEADERBOARD =====
function loadLeaderboard() {
    const players = getPlayers();
    
    // Batting leaderboard
    const battingLeaderboard = [...players]
        .sort((a, b) => (b.runs || 0) - (a.runs || 0))
        .slice(0, 10);
    
    const battingTable = document.getElementById('batting-leaderboard');
    battingTable.innerHTML = '';
    
    battingLeaderboard.forEach((player, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${player.name}</td>
            <td>${player.matches || 0}</td>
            <td>${player.runs || 0}</td>
            <td>${player.battingAvg || 0}</td>
            <td>${player.strikeRate || 0}</td>
            <td>${player.hundreds || 0}/${player.fifties || 0}</td>
            <td>${player.highestScore || '-'}</td>
        `;
        battingTable.appendChild(row);
    });
    
    // Bowling leaderboard
    const bowlingLeaderboard = [...players]
        .sort((a, b) => (b.wickets || 0) - (a.wickets || 0))
        .slice(0, 10);
    
    const bowlingTable = document.getElementById('bowling-leaderboard');
    bowlingTable.innerHTML = '';
    
    bowlingLeaderboard.forEach((player, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${player.name}</td>
            <td>${player.matches || 0}</td>
            <td>${player.wickets || 0}</td>
            <td>${player.bowlingAvg || 0}</td>
            <td>${player.economy || 0}</td>
            <td>${player.strikeRate || 0}</td>
            <td>${player.bestBowling || '-'}</td>
        `;
        bowlingTable.appendChild(row);
    });
    
    // Awards
    const pomLeaderboard = [...players]
        .sort((a, b) => (b.playerOfMatch || 0) - (a.playerOfMatch || 0))
        .slice(0, 5);
    
    const pomList = document.getElementById('pom-leaderboard');
    pomList.innerHTML = '';
    
    pomLeaderboard.forEach((player, index) => {
        const item = document.createElement('div');
        item.className = 'award-item';
        item.innerHTML = `
            <span>${index + 1}. ${player.name}</span>
            <span>${player.playerOfMatch || 0} awards</span>
        `;
        pomList.appendChild(item);
    });
    
    // MVP would be calculated based on some formula combining batting and bowling
    const mvpLeaderboard = [...players]
        .sort((a, b) => {
            const aPoints = (a.runs || 0) + (a.wickets || 0) * 20;
            const bPoints = (b.runs || 0) + (b.wickets || 0) * 20;
            return bPoints - aPoints;
        })
        .slice(0, 5);
    
    const mvpList = document.getElementById('mvp-leaderboard');
    mvpList.innerHTML = '';
    
    mvpLeaderboard.forEach((player, index) => {
        const item = document.createElement('div');
        item.className = 'award-item';
        item.innerHTML = `
            <span>${index + 1}. ${player.name}</span>
            <span>${(player.runs || 0) + (player.wickets || 0) * 20} points</span>
        `;
        mvpList.appendChild(item);
    });
}

// ===== TEAM FEED =====
function loadTeamFeed() {
    const posts = getPosts();
    const feedContainer = document.getElementById('feed-posts');
    feedContainer.innerHTML = '';
    
    if (posts.length === 0) {
        feedContainer.innerHTML = '<p>No posts yet. Be the first to share something!</p>';
        return;
    }
    
    // Sort by date (newest first)
    const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    sortedPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <div class="post-header">
                <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="Admin">
                <div class="post-user">
                    <h4>Team Admin</h4>
                    <span class="post-time">${formatDateTime(post.createdAt)}</span>
                </div>
            </div>
            <div class="post-content">
                <p>${post.content}</p>
                ${post.image ? `<img src="${post.image}" class="post-image" alt="Post image">` : ''}
                ${post.poll ? renderPoll(post) : ''}
            </div>
            <div class="post-actions">
                <div class="post-action like-post" data-id="${post.id}">
                    <i class="far fa-heart"></i>
                    <span>${post.likes || 0}</span>
                </div>
                <div class="post-action">
                    <i class="far fa-comment"></i>
                    <span>${post.comments ? post.comments.length : 0}</span>
                </div>
                <div class="post-action">
                    <i class="far fa-share-square"></i>
                    <span>Share</span>
                </div>
            </div>
        `;
        feedContainer.appendChild(postElement);
    });
    
    // Add event listeners to like buttons
    document.querySelectorAll('.like-post').forEach(button => {
        button.addEventListener('click', function() {
            const postId = this.getAttribute('data-id');
            likePost(postId);
        });
    });
}

function renderPoll(post) {
    let pollHtml = `<div class="poll"><h5>${post.poll.question}</h5><ul>`;
    
    post.poll.options.forEach(option => {
        const totalVotes = post.poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
        const percentage = totalVotes > 0 ? Math.round((option.votes || 0) / totalVotes * 100) : 0;
        
        pollHtml += `
            <li>
                <div class="poll-option">
                    <span>${option.text}</span>
                    <span>${percentage}% (${option.votes || 0} votes)</span>
                </div>
                <div class="poll-bar" style="width: ${percentage}%"></div>
            </li>
        `;
    });
    
    pollHtml += '</ul></div>';
    return pollHtml;
}

function showCreatePostModal() {
    document.getElementById('create-post-modal').style.display = 'flex';
}

function addPollOption() {
    const pollQuestion = document.getElementById('post-poll').value;
    if (!pollQuestion) {
        alert('Please enter a poll question first');
        return;
    }
    
    const optionText = prompt('Enter poll option:');
    if (optionText) {
        const pollOptions = document.getElementById('poll-options');
        const optionElement = document.createElement('div');
        optionElement.className = 'poll-option-input';
        optionElement.innerHTML = `
            <input type="text" class="form-control" value="${optionText}" readonly>
            <button type="button" class="btn btn-sm btn-danger remove-option">Remove</button>
        `;
        pollOptions.appendChild(optionElement);
        
        // Add event listener to remove button
        optionElement.querySelector('.remove-option').addEventListener('click', function() {
            pollOptions.removeChild(optionElement);
        });
    }
}

function savePost() {
    const content = document.getElementById('post-content').value;
    const imageInput = document.getElementById('post-image');
    const pollQuestion = document.getElementById('post-poll').value;
    
    if (!content) {
        alert('Please enter post content');
        return;
    }
    
    // Get poll options if any
    let poll = null;
    if (pollQuestion) {
        const optionInputs = document.querySelectorAll('.poll-option-input input');
        if (optionInputs.length < 2) {
            alert('Poll must have at least 2 options');
            return;
        }
        
        poll = {
            question: pollQuestion,
            options: Array.from(optionInputs).map(input => ({
                text: input.value,
                votes: 0
            }))
        };
    }
    
    // Create post object
    const post = {
        id: Date.now().toString(),
        content,
        image: imageInput.files[0] ? URL.createObjectURL(imageInput.files[0]) : null,
        poll,
        likes: 0,
        comments: [],
        createdAt: new Date().toISOString()
    };
    
    // Save to localStorage
    const posts = getPosts();
    posts.push(post);
    savePosts(posts);
    
    // Reset form and close modal
    document.getElementById('post-form').reset();
    document.getElementById('poll-options').innerHTML = '';
    document.getElementById('create-post-modal').style.display = 'none';
    
    // Refresh feed
    loadTeamFeed();
}

function likePost(postId) {
    const posts = getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex !== -1) {
        posts[postIndex].likes = (posts[postIndex].likes || 0) + 1;
        savePosts(posts);
        loadTeamFeed();
    }
}

// ===== ADMIN PANEL =====
function loadAdminPanel() {
    const settings = getTeamSettings();
    
    // Populate team settings form
    document.getElementById('team-name').value = settings.teamName;
    document.getElementById('primary-color').value = settings.primaryColor;
    document.getElementById('secondary-color').value = settings.secondaryColor;
    
    // TODO: Load users table
}

function saveTeamSettingsForm() {
    const teamName = document.getElementById('team-name').value;
    const primaryColor = document.getElementById('primary-color').value;
    const secondaryColor = document.getElementById('secondary-color').value;
    const logoInput = document.getElementById('team-logo');
    
    // Create settings object
    const settings = {
        teamName,
        primaryColor,
        secondaryColor,
        logo: logoInput.files[0] ? URL.createObjectURL(logoInput.files[0]) : getTeamSettings().logo
    };
    
    // Save to localStorage
    saveTeamSettings(settings);
    
    // Update UI
    document.querySelector('.sidebar-header h2').textContent = teamName;
    if (settings.logo) {
        document.querySelector('.sidebar-header img').src = settings.logo;
    }
    
    alert('Team settings saved successfully');
}

function exportData() {
    const data = {
        players: getPlayers(),
        matches: getMatches(),
        posts: getPosts(),
        teamSettings: getTeamSettings(),
        exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `peshawar-lions-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (confirm('Importing data will overwrite all current data. Are you sure?')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.players) localStorage.setItem('players', JSON.stringify(data.players));
                if (data.matches) localStorage.setItem('matches', JSON.stringify(data.matches));
                if (data.posts) localStorage.setItem('posts', JSON.stringify(data.posts));
                if (data.teamSettings) localStorage.setItem('teamSettings', JSON.stringify(data.teamSettings));
                
                alert('Data imported successfully');
                location.reload(); // Refresh to show new data
            } catch (error) {
                alert('Error importing data: ' + error.message);
            }
        };
        reader.readAsText(file);
    }
    
    // Reset file input
    event.target.value = '';
}

// ===== THEME SETTINGS =====
function loadThemeSettings() {
    const settings = getTeamSettings();
    
    // Set custom theme form values
    document.getElementById('custom-primary').value = settings.primaryColor;
    document.getElementById('custom-secondary').value = settings.secondaryColor;
    document.getElementById('custom-background').value = '#f5f5f5';
    document.getElementById('custom-text').value = '#333333';
    
    // Add event listeners to theme buttons
    document.querySelectorAll('.apply-theme-btn').forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.closest('.theme-option').getAttribute('data-theme');
            applyPresetTheme(theme);
        });
    });
    
    // Custom theme form submission
    document.getElementById('custom-theme-form').addEventListener('submit', function(e) {
        e.preventDefault();
        applyCustomTheme();
    });
}

function applyPresetTheme(theme) {
    let primary, secondary;
    
    switch(theme) {
        case 'light':
            primary = '#1a5276';
            secondary = '#d35400';
            break;
        case 'dark':
            primary = '#2e86c1';
            secondary = '#e67e22';
            break;
        case 'green':
            primary = '#1e5631';
            secondary = '#4c9a2a';
            break;
        case 'blue':
            primary = '#0a2463';
            secondary = '#3e92cc';
            break;
        default:
            return;
    }
    
    const settings = getTeamSettings();
    settings.primaryColor = primary;
    settings.secondaryColor = secondary;
    saveTeamSettings(settings);
    
    alert(`Theme applied successfully`);
}

function applyCustomTheme() {
    const primary = document.getElementById('custom-primary').value;
    const secondary = document.getElementById('custom-secondary').value;
    const background = document.getElementById('custom-background').value;
    const text = document.getElementById('custom-text').value;
    
    const settings = getTeamSettings();
    settings.primaryColor = primary;
    settings.secondaryColor = secondary;
    saveTeamSettings(settings);
    
    // Apply custom colors
    document.documentElement.style.setProperty('--light-color', background);
    document.documentElement.style.setProperty('--dark-color', text);
    
    alert('Custom theme applied successfully');
}

// ===== UTILITY FUNCTIONS =====
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatDateTime(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Initialize the app
initApp();
