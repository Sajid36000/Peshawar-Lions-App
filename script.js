// ========== APP CONSTANTS ==========
const ADMIN_CREDENTIALS = {
  username: "Peshawar Lions",
  password: "Peshawar123"
};

const THEMES = [
  { name: "default", primary: "#0056B3", secondary: "#FFD700" },
  { name: "dark", primary: "#121212", secondary: "#333333" },
  { name: "classic", primary: "#0056B3", secondary: "#FFD700" },
  { name: "modern", primary: "#002D62", secondary: "#FFC72C" },
  { name: "green", primary: "#1E4D2B", secondary: "#D4AF37" },
  { name: "red", primary: "#9B2335", secondary: "#FFD700" },
  { name: "purple", primary: "#5B5EA6", secondary: "#FFD700" },
  { name: "orange", primary: "#DD4124", secondary: "#FFD700" },
  { name: "pink", primary: "#D65076", secondary: "#FFD700" },
  { name: "teal", primary: "#45B8AC", secondary: "#FFD700" },
  { name: "yellow", primary: "#EFC050", secondary: "#FFD700" },
  { name: "mono", primary: "#333333", secondary: "#888888" }
];

// ========== STATE MANAGEMENT ==========
let currentUser = null;
let isAdmin = false;
let selectedTheme = 'default';
let players = JSON.parse(localStorage.getItem('players')) || [];
let matches = JSON.parse(localStorage.getItem('matches')) || [];
let posts = JSON.parse(localStorage.getItem('posts')) || [];
let currentMatch = null;

// ========== DOM ELEMENTS ==========
const splashScreen = document.getElementById('splash-screen');
const appContainer = document.getElementById('app-container');
const loginScreen = document.getElementById('login-screen');
const mainInterface = document.getElementById('main-interface');
const loginForm = document.getElementById('login-form');
const adminControls = document.getElementById('admin-controls');
const themeToggle = document.getElementById('theme-toggle');
const themePalette = document.createElement('div');
themePalette.className = 'theme-palette';

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme selector
  themeToggle.addEventListener('click', toggleThemePalette);
  createThemePalette();
  
  // Initialize login form
  loginForm.addEventListener('submit', handleLogin);
  
  // Initialize tab system
  initTabSystem();
  
  // Check if user is already logged in
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    isAdmin = currentUser.username === ADMIN_CREDENTIALS.username;
    initializeApp();
  } else {
    // Show splash screen then login
    setTimeout(() => {
      splashScreen.classList.remove('active');
      setTimeout(() => {
        loginScreen.classList.remove('hidden');
      }, 500);
    }, 3000);
  }
  
  // Initialize service worker for offline functionality
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  }
  
  // Monitor online status
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
});

// ========== CORE FUNCTIONS ==========
function initializeApp() {
  splashScreen.classList.remove('active');
  loginScreen.classList.add('hidden');
  appContainer.classList.remove('hidden');
  mainInterface.classList.remove('hidden');
  
  if (isAdmin) {
    document.body.classList.add('admin');
    adminControls.classList.remove('hidden');
    initAdminControls();
  }
  
  loadUserTheme();
  renderAllSections();
  setupEventListeners();
}

function renderAllSections() {
  renderMatches();
  renderPlayers();
  renderLeaderboards();
  renderSocialFeed();
  renderUserProfile();
}

// ========== AUTHENTICATION ==========
function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    currentUser = { username, isAdmin: true };
    isAdmin = true;
  } else {
    // In a real app, you would verify against player credentials
    currentUser = { username, isAdmin: false };
    isAdmin = false;
  }
  
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  initializeApp();
}

function handleLogout() {
  localStorage.removeItem('currentUser');
  currentUser = null;
  isAdmin = false;
  location.reload();
}

// ========== THEME MANAGEMENT ==========
function createThemePalette() {
  THEMES.forEach(theme => {
    const colorBtn = document.createElement('div');
    colorBtn.className = `theme-color ${theme.name === selectedTheme ? 'active' : ''}`;
    colorBtn.dataset.theme = theme.name;
    colorBtn.style.background = `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`;
    colorBtn.addEventListener('click', () => changeTheme(theme.name));
    themePalette.appendChild(colorBtn);
  });
  
  themeToggle.parentNode.appendChild(themePalette);
}

function toggleThemePalette() {
  themePalette.classList.toggle('active');
}

function changeTheme(themeName) {
  selectedTheme = themeName;
  localStorage.setItem('selectedTheme', themeName);
  
  // Update active state in palette
  document.querySelectorAll('.theme-color').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === themeName);
  });
  
  // Apply theme to body
  document.body.className = '';
  if (themeName !== 'default') {
    document.body.classList.add(`theme-${themeName}`);
  }
  
  themePalette.classList.remove('active');
}

function loadUserTheme() {
  const savedTheme = localStorage.getItem('selectedTheme') || 'default';
  changeTheme(savedTheme);
}

// ========== TAB SYSTEM ==========
function initTabSystem() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.dataset.tab;
      switchTab(tabName);
    });
  });
}

function switchTab(tabName) {
  // Update active tab button
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  
  // Show corresponding tab content
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.toggle('active', pane.id === `${tabName}-tab`);
  });
  
  // Special rendering for certain tabs
  if (tabName === 'leaderboards') {
    renderLeaderboards();
  } else if (tabName === 'social') {
    renderSocialFeed();
  }
}

// ========== MATCH MANAGEMENT ==========
function renderMatches() {
  const matchesList = document.querySelector('.matches-list');
  
  if (matches.length === 0) {
    matchesList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-calendar-times"></i>
        <p>No matches recorded yet</p>
        ${isAdmin ? '<p class="admin-notice">Admin can add matches using the + button</p>' : ''}
      </div>
    `;
    return;
  }
  
  matchesList.innerHTML = matches.map(match => `
    <div class="card match-card ${match.status === 'live' ? 'live' : ''}">
      <div class="card-header">
        <h3>${match.type} Match</h3>
        <span class="match-date">${formatDate(match.date)}</span>
      </div>
      <div class="card-body">
        <div class="match-teams">
          <div class="match-team">
            <div class="match-team logo">
              <i class="fas fa-lion"></i>
            </div>
            <span class="match-team name">Peshawar Lions</span>
            <span class="match-score">${match.scores?.home || '-'}/${match.wickets?.home || '-'}</span>
          </div>
          <span class="match-vs">vs</span>
          <div class="match-team">
            <span class="match-team name">${match.opponent}</span>
            <span class="match-score">${match.scores?.away || '-'}/${match.wickets?.away || '-'}</span>
          </div>
        </div>
        <div class="match-details">
          <span>${match.venue}</span>
          <span>${match.status === 'completed' ? 'Completed' : match.status === 'live' ? 'In Progress' : 'Scheduled'}</span>
        </div>
        <div class="match-actions">
          ${match.status === 'live' ? `
            <button class="btn btn-primary" onclick="continueScoring('${match.id}')">
              <i class="fas fa-play"></i> Continue
            </button>
          ` : match.status === 'scheduled' ? `
            <button class="btn btn-primary" onclick="startMatch('${match.id}')">
              <i class="fas fa-play"></i> Start
            </button>
          ` : `
            <button class="btn btn-secondary" onclick="viewMatchDetails('${match.id}')">
              <i class="fas fa-info-circle"></i> Details
            </button>
          `}
          ${isAdmin ? `
            <button class="btn btn-outline" onclick="editMatch('${match.id}')">
              <i class="fas fa-edit"></i> Edit
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

function initNewMatchForm() {
  const form = document.getElementById('new-match-form');
  form.reset();
  form.onsubmit = function(e) {
    e.preventDefault();
    createNewMatch();
  };
  showModal('new-match-modal');
}

function createNewMatch() {
  const form = document.getElementById('new-match-form');
  const matchType = form.elements['match-type'].value;
  const opponent = form.elements['opponent'].value;
  const date = form.elements['match-date'].value;
  const venue = form.elements['match-venue'].value || 'Home Ground';
  
  const newMatch = {
    id: generateId(),
    type: matchType,
    opponent,
    date,
    venue,
    status: 'scheduled',
    created: new Date().toISOString(),
    createdBy: currentUser.username
  };
  
  matches.unshift(newMatch);
  saveMatches();
  hideModal();
  renderMatches();
}

function startMatch(matchId) {
  const match = matches.find(m => m.id === matchId);
  if (!match) return;
  
  match.status = 'live';
  match.startTime = new Date().toISOString();
  match.players = players.map(p => ({ 
    id: p.id, 
    name: p.name,
    role: p.role,
    batting: { runs: 0, balls: 0, fours: 0, sixes: 0, out: false },
    bowling: { overs: 0, maidens: 0, runs: 0, wickets: 0 }
  }));
  match.scores = { home: 0, away: 0 };
  match.wickets = { home: 0, away: 0 };
  match.currentInnings = 1;
  match.currentBatters = [];
  match.currentBowlers = [];
  
  saveMatches();
  renderMatches();
  showScoringInterface(match);
}

function continueScoring(matchId) {
  const match = matches.find(m => m.id === matchId);
  if (!match) return;
  
  showScoringInterface(match);
}

// ========== PLAYER MANAGEMENT ==========
function renderPlayers() {
  const playersList = document.querySelector('.players-list');
  
  if (players.length === 0) {
    playersList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-user-slash"></i>
        <p>No players added yet</p>
        ${isAdmin ? '<p class="admin-notice">Admin can add players using the + button</p>' : ''}
      </div>
    `;
    return;
  }
  
  playersList.innerHTML = players.map(player => `
    <div class="card player-card">
      <div class="player-avatar ${player.capHolder ? 'cap-holder' : ''}">
        ${player.avatar || player.name.charAt(0).toUpperCase()}
      </div>
      <div class="player-info">
        <div class="player-name">
          ${player.name}
          <span class="role">${player.role}</span>
        </div>
        <div class="player-stats">
          <div class="player-stat">
            <i class="fas fa-bat"></i>
            ${player.battingStyle || 'N/A'}
          </div>
          <div class="player-stat">
            <i class="fas fa-ball"></i>
            ${player.bowlingStyle || 'N/A'}
          </div>
          <div class="player-stat">
            <i class="fas fa-tshirt"></i>
            ${player.jerseyNumber || '--'}
          </div>
        </div>
      </div>
      <div class="player-actions">
        ${isAdmin ? `
          <button class="btn btn-icon" onclick="editPlayer('${player.id}')">
            <i class="fas fa-edit"></i>
          </button>
        ` : ''}
        <button class="btn btn-icon" onclick="viewPlayerStats('${player.id}')">
          <i class="fas fa-chart-line"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function initAddPlayerForm() {
  const form = document.getElementById('add-player-form');
  form.reset();
  form.onsubmit = function(e) {
    e.preventDefault();
    addNewPlayer();
  };
  showModal('add-player-modal');
}

function addNewPlayer() {
  const form = document.getElementById('add-player-form');
  const name = form.elements['player-name'].value;
  const role = form.elements['player-role'].value;
  const battingStyle = form.elements['player-batting'].value;
  const bowlingStyle = form.elements['player-bowling'].value;
  const jerseyNumber = form.elements['player-jersey'].value;
  
  const newPlayer = {
    id: generateId(),
    name,
    role,
    battingStyle,
    bowlingStyle,
    jerseyNumber,
    matchesPlayed: 0,
    runs: 0,
    wickets: 0,
    created: new Date().toISOString(),
    createdBy: currentUser.username
  };
  
  players.unshift(newPlayer);
  savePlayers();
  hideModal();
  renderPlayers();
  renderLeaderboards();
}

// ========== LEADERBOARDS ==========
function renderLeaderboards() {
  renderBatsmenLeaderboard();
  renderBowlersLeaderboard();
  renderCapHolders();
}

function renderBatsmenLeaderboard() {
  const board = document.getElementById('batsmen-board');
  
  // Sort players by runs (descending)
  const topBatsmen = [...players]
    .filter(p => p.matchesPlayed > 0)
    .sort((a, b) => (b.runs || 0) - (a.runs || 0))
    .slice(0, 10);
  
  if (topBatsmen.length === 0) {
    board.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-chart-line"></i>
        <p>Batting stats will appear after matches are played</p>
      </div>
    `;
    return;
  }
  
  board.innerHTML = `
    <div class="card">
      <div class="card-header">
        <h3>Top Batsmen 🔵</h3>
        <span>By Runs</span>
      </div>
      <div class="card-body">
        ${topBatsmen.map((player, index) => `
          <div class="leaderboard-item">
            <div class="leaderboard-rank">${index + 1}</div>
            <div class="leaderboard-player">
              <div class="leaderboard-avatar">
                ${player.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div class="player-name">${player.name}</div>
                <div class="player-role">${player.role}</div>
              </div>
            </div>
            <div class="leaderboard-stats">
              <div class="primary-stat">${player.runs || 0} runs</div>
              <div class="secondary-stat">${player.matchesPlayed} matches</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderBowlersLeaderboard() {
  const board = document.getElementById('bowlers-board');
  
  // Sort players by wickets (descending)
  const topBowlers = [...players]
    .filter(p => p.matchesPlayed > 0 && p.wickets > 0)
    .sort((a, b) => (b.wickets || 0) - (a.wickets || 0))
    .slice(0, 10);
  
  if (topBowlers.length === 0) {
    board.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-chart-line"></i>
        <p>Bowling stats will appear after matches are played</p>
      </div>
    `;
    return;
  }
  
  board.innerHTML = `
    <div class="card">
      <div class="card-header">
        <h3>Top Bowlers 🔴</h3>
        <span>By Wickets</span>
      </div>
      <div class="card-body">
        ${topBowlers.map((player, index) => `
          <div class="leaderboard-item">
            <div class="leaderboard-rank">${index + 1}</div>
            <div class="leaderboard-player">
              <div class="leaderboard-avatar">
                ${player.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div class="player-name">${player.name}</div>
                <div class="player-role">${player.role}</div>
              </div>
            </div>
            <div class="leaderboard-stats">
              <div class="primary-stat">${player.wickets || 0} wickets</div>
              <div class="secondary-stat">${player.bowlingAvg || '-'} avg</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderCapHolders() {
  const board = document.getElementById('caps-board');
  const capHolders = players.filter(p => p.capHolder);
  
  if (capHolders.length === 0) {
    board.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-award"></i>
        <p>No cap holders assigned yet</p>
        ${isAdmin ? '<p class="admin-notice">Admin can assign caps from player profiles</p>' : ''}
      </div>
    `;
    return;
  }
  
  board.innerHTML = `
    <div class="card">
      <div class="card-header">
        <h3>Cap Holders 🏏</h3>
        <span>Team Legends</span>
      </div>
      <div class="card-body">
        ${capHolders.map(player => `
          <div class="leaderboard-item">
            <div class="leaderboard-player">
              <div class="leaderboard-avatar cap-holder">
                ${player.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div class="player-name">${player.name}</div>
                <div class="player-role">${player.role}</div>
              </div>
            </div>
            <div class="leaderboard-stats">
              <div class="primary-stat">${player.capType || 'Team Cap'}</div>
              <div class="secondary-stat">Since ${formatDate(player.capSince)}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ========== SOCIAL FEED ==========
function renderSocialFeed() {
  const feedContainer = document.querySelector('.feed-container');
  
  if (posts.length === 0) {
    feedContainer.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-comment-alt"></i>
        <p>No posts yet</p>
        ${isAdmin ? '<p class="admin-notice">Admin can post updates using the + button</p>' : ''}
      </div>
    `;
    return;
  }
  
  feedContainer.innerHTML = posts.map(post => `
    <div class="card post-card">
      <div class="post-header">
        <div class="post-avatar verified">
          <i class="fas fa-lion"></i>
        </div>
        <div class="post-user">
          <div class="name">
            Peshawar Lions
            <i class="fas fa-check-circle verified-badge"></i>
          </div>
          <div class="time">${timeAgo(post.created)}</div>
        </div>
      </div>
      <div class="post-content">
        <p>${post.content}</p>
        ${post.media ? `
          <div class="post-media">
            ${post.media.type === 'image' ? `
              <img src="${post.media.url}" alt="Team post">
            ` : post.media.type === 'video' ? `
              <video controls>
                <source src="${post.media.url}" type="video/mp4">
              </video>
            ` : ''}
          </div>
        ` : ''}
      </div>
      <div class="post-actions">
        <div class="post-action ${post.likes?.includes(currentUser.username) ? 'liked' : ''}" 
             onclick="toggleLike('${post.id}')">
          <i class="fas fa-heart"></i>
          <span>${post.likes?.length || 0}</span>
        </div>
        <div class="post-action" onclick="focusCommentInput('${post.id}')">
          <i class="fas fa-comment"></i>
          <span>${post.comments?.length || 0}</span>
        </div>
        <div class="post-action" onclick="sharePost('${post.id}')">
          <i class="fas fa-share"></i>
          <span>Share</span>
        </div>
      </div>
      ${post.comments?.length > 0 ? `
        <div class="post-comments">
          ${post.comments.slice(0, 3).map(comment => `
            <div class="comment">
              <div class="comment-avatar">${comment.user.charAt(0).toUpperCase()}</div>
              <div class="comment-content">
                <div class="comment-user">${comment.user}</div>
                <div class="comment-text">${comment.text}</div>
              </div>
            </div>
          `).join('')}
          ${post.comments.length > 3 ? `
            <div class="view-more-comments">+ ${post.comments.length - 3} more comments</div>
          ` : ''}
        </div>
      ` : ''}
      <div class="post-comment-input">
        <input type="text" placeholder="Add a comment..." id="comment-${post.id}">
        <button onclick="addComment('${post.id}')">Post</button>
      </div>
    </div>
  `).join('');
}

function initNewPostForm() {
  const form = document.getElementById('new-post-form');
  form.reset();
  form.onsubmit = function(e) {
    e.preventDefault();
    createNewPost();
  };
  showModal('new-post-modal');
}

function createNewPost() {
  const form = document.getElementById('new-post-form');
  const content = form.elements['post-content'].value;
  
  const newPost = {
    id: generateId(),
    content,
    created: new Date().toISOString(),
    createdBy: currentUser.username,
    likes: [],
    comments: []
  };
  
  // Handle media if added (implementation depends on your media upload system)
  
  posts.unshift(newPost);
  savePosts();
  hideModal();
  renderSocialFeed();
}

// ========== USER PROFILE ==========
function renderUserProfile() {
  const profileContent = document.querySelector('.profile-content');
  
  if (isAdmin) {
    profileContent.innerHTML = `
      <div class="profile-header">
        <div class="profile-avatar verified">
          <i class="fas fa-lion"></i>
        </div>
        <div class="profile-info">
          <div class="profile-name">Peshawar Lions Admin</div>
          <div class="profile-role">Team Administrator</div>
          <div class="profile-stats">
            <div class="profile-stat">
              <div class="value">${players.length}</div>
              <div class="label">Players</div>
            </div>
            <div class="profile-stat">
              <div class="value">${matches.length}</div>
              <div class="label">Matches</div>
            </div>
            <div class="profile-stat">
              <div class="value">${posts.length}</div>
              <div class="label">Posts</div>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <h3>Admin Controls</h3>
        </div>
        <div class="card-body">
          <button class="btn btn-secondary" onclick="initAddPlayerForm()">
            <i class="fas fa-user-plus"></i> Add Player
          </button>
          <button class="btn btn-secondary" onclick="initNewMatchForm()">
            <i class="fas fa-plus"></i> Add Match
          </button>
          <button class="btn btn-secondary" onclick="initNewPostForm()">
            <i class="fas fa-plus"></i> Create Post
          </button>
          <button class="btn btn-outline" onclick="exportTeamData()">
            <i class="fas fa-file-export"></i> Export Data
          </button>
        </div>
      </div>
    `;
  } else {
    // Player profile would show their stats
    profileContent.innerHTML = `
      <div class="profile-header">
        <div class="profile-avatar">
          ${currentUser.username.charAt(0).toUpperCase()}
        </div>
        <div class="profile-info">
          <div class="profile-name">${currentUser.username}</div>
          <div class="profile-stats">
            <div class="profile-stat">
              <div class="value">0</div>
              <div class="label">Matches</div>
            </div>
            <div class="profile-stat">
              <div class="value">0</div>
              <div class="label">Runs</div>
            </div>
            <div class="profile-stat">
              <div class="value">0</div>
              <div class="label">Wickets</div>
            </div>
          </div>
        </div>
      </div>
      <div class="empty-state">
        <i class="fas fa-info-circle"></i>
        <p>Your stats will appear here after you play matches</p>
        <p>Contact admin to update your player profile</p>
      </div>
    `;
  }
}

// ========== SCORING INTERFACE ==========
function showScoringInterface(match) {
  currentMatch = match;
  const interface = document.getElementById('scoring-interface');
  
  // Update match info
  document.getElementById('opponent-name').textContent = match.opponent;
  document.getElementById('match-format').textContent = match.type;
  document.getElementById('match-status').textContent = 'In Progress';
  
  // Update score summary
  updateScoreDisplay();
  
  // Set up scoring buttons
  setupScoringButtons();
  
  interface.classList.add('active');
}

function updateScoreDisplay() {
  if (!currentMatch) return;
  
  const homeScore = document.querySelector('.score-summary .batting-team .team-score');
  const homeWickets = document.querySelector('.score-summary .batting-team .team-overs');
  const batters = document.querySelectorAll('.current-batters .batter');
  
  homeScore.textContent = `${currentMatch.scores.home}/${currentMatch.wickets.home}`;
  homeWickets.textContent = `(${calculateOvers(currentMatch.ballsBowled)} ov)`;
  
  // Update batter stats
  currentMatch.currentBatters.forEach((batterId, index) => {
    if (index < 2) {
      const player = currentMatch.players.find(p => p.id === batterId);
      if (player) {
        batters[index].querySelector('.name').textContent = player.name;
        batters[index].querySelector('.runs').textContent = player.batting.runs;
        batters[index].querySelector('.balls').textContent = player.batting.balls;
        
        // Add strike indicator
        batters[index].classList.toggle('on-strike', currentMatch.striker === batterId);
      }
    }
  });
  
  // Update bowler stats
  if (currentMatch.currentBowler) {
    const bowler = currentMatch.players.find(p => p.id === currentMatch.currentBowler);
    if (bowler) {
      const bowlerElement = document.querySelector('.current-bowler');
      bowlerElement.querySelector('.name').textContent = bowler.name;
      bowlerElement.querySelector('.overs').textContent = calculateOvers(bowler.bowling.overs);
      bowlerElement.querySelector('.figures').textContent = 
        `${bowler.bowling.wickets}/${bowler.bowling.runs}`;
    }
  }
}

function setupScoringButtons() {
  // Runs buttons
  document.querySelectorAll('.runs-buttons button').forEach(button => {
    button.onclick = () => recordRun(parseInt(button.dataset.runs));
  });
  
  // Extras buttons
  document.querySelectorAll('.extras-buttons button').forEach(button => {
    button.onclick = () => recordExtra(button.dataset.extra);
  });
  
  // Wicket buttons
  document.querySelectorAll('.wicket-buttons button').forEach(button => {
    button.onclick = () => recordWicket(button.dataset.wicket);
  });
  
  // Action buttons
  document.getElementById('undo-ball').onclick = undoLastBall;
  document.getElementById('end-innings').onclick = endInnings;
  document.getElementById('view-scorecard').onclick = viewScorecard;
}

function recordRun(runs) {
  if (!currentMatch || !currentMatch.striker) return;
  
  const striker = currentMatch.players.find(p => p.id === currentMatch.striker);
  if (!striker) return;
  
  // Update batsman stats
  striker.batting.runs += runs;
  striker.batting.balls += 1;
  if (runs === 4) striker.batting.fours += 1;
  if (runs === 6) striker.batting.sixes += 1;
  
  // Update team score
  currentMatch.scores.home += runs;
  currentMatch.ballsBowled += 1;
  
  // Update bowler stats if there's a current bowler
  if (currentMatch.currentBowler) {
    const bowler = currentMatch.players.find(p => p.id === currentMatch.currentBowler);
    if (bowler) {
      bowler.bowling.runs += runs;
      bowler.bowling.overs = Math.floor(currentMatch.ballsBowled / 6) + 
                             (currentMatch.ballsBowled % 6) / 10;
    }
  }
  
  // Rotate strike if odd number of runs (except last ball of over)
  if (runs % 2 !== 0 && currentMatch.ballsBowled % 6 !== 0) {
    rotateStrike();
  }
  
  // Check if over is completed
  if (currentMatch.ballsBowled % 6 === 0) {
    rotateStrike(); // Always rotate strike at the end of over
    // You might want to change bowler here in a real implementation
  }
  
  updateScoreDisplay();
  saveMatches();
}

// ========== UTILITY FUNCTIONS ==========
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function timeAgo(dateString) {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `${interval} year${interval === 1 ? '' : 's'} ago`;
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `${interval} month${interval === 1 ? '' : 's'} ago`;
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval} day${interval === 1 ? '' : 's'} ago`;
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval} hour${interval === 1 ? '' : 's'} ago`;
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `${interval} minute${interval === 1 ? '' : 's'} ago`;
  
  return 'just now';
}

function calculateOvers(balls) {
  const overs = Math.floor(balls / 6);
  const ballsInOver = balls % 6;
  return ballsInOver === 0 ? overs : `${overs}.${ballsInOver}`;
}

function showModal(modalId) {
  document.getElementById('modal-overlay').classList.remove('hidden');
  document.getElementById(modalId).classList.remove('hidden');
}

function hideModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
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

function updateOnlineStatus() {
  const status = document.getElementById('offline-notification');
  if (navigator.onLine) {
    status.classList.add('hidden');
    // Sync any pending changes here
  } else {
    status.classList.remove('hidden');
  }
}

// ========== EVENT LISTENERS ==========
function setupEventListeners() {
  // Logout button
  document.getElementById('logout-btn').addEventListener('click', handleLogout);
  
  // Close modals
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', hideModal);
  });
  
  // Modal overlay click
  document.getElementById('modal-overlay').addEventListener('click', hideModal);
  
  // Close scoring interface
  document.querySelector('.close-scoring').addEventListener('click', () => {
    document.getElementById('scoring-interface').classList.remove('active');
    currentMatch = null;
  });
  
  // Admin controls
  if (isAdmin) {
    document.getElementById('new-match-btn').addEventListener('click', initNewMatchForm);
    document.getElementById('add-player-btn').addEventListener('click', initAddPlayerForm);
    document.getElementById('new-post-btn').addEventListener('click', initNewPostForm);
  }
  
  // Leaderboard tabs
  document.querySelectorAll('.leaderboard-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const board = tab.dataset.board;
      document.querySelectorAll('.leaderboard-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.board').forEach(b => b.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`${board}-board`).classList.add('active');
    });
  });
}

// Initialize the app
setupEventListeners();