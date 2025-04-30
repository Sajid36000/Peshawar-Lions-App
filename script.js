// ===== FIREBASE INITIALIZATION =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  getDocs,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  enableIndexedDbPersistence,
  query,
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { 
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDA3oighdyQuuoauoNDYdBUMbFx6yKYTc",
  authDomain: "plapp-e9737.firebaseapp.com",
  projectId: "plapp-e9737",
  storageBucket: "plapp-e9737.appspot.com",
  messagingSenderId: "674359231540",
  appId: "1:674359231540:web:20be424163e48d63c37661",
  measurementId: "G-19DDLP62P0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn("Offline persistence can only be enabled in one tab at a time.");
  } else if (err.code === 'unimplemented') {
    console.warn("The current browser does not support offline persistence.");
  }
});

// ===== GLOBAL VARIABLES =====
let currentUser = null;
let activeMatch = null;
let players = [];
let matches = [];
let tournaments = [];

// ===== DOM ELEMENTS =====
const elements = {
  // Auth elements
  authBtn: document.getElementById('auth-btn'),
  userProfile: document.getElementById('user-profile'),
  userName: document.getElementById('user-name'),
  userAvatar: document.getElementById('user-avatar'),
  
  // Navigation
  navTabs: document.querySelectorAll('.nav-tabs li'),
  appSections: document.querySelectorAll('.app-section'),
  
  // Dashboard
  totalMatches: document.getElementById('total-matches'),
  matchesWon: document.getElementById('matches-won'),
  matchesLost: document.getElementById('matches-lost'),
  winPercentage: document.getElementById('win-percentage'),
  upcomingMatch: document.getElementById('upcoming-match'),
  performanceChart: document.getElementById('performance-chart'),
  
  // Players section
  playersList: document.getElementById('players-list'),
  addPlayerBtn: document.getElementById('add-player-btn'),
  
  // Matches section
  matchesList: document.getElementById('matches-list'),
  addMatchBtn: document.getElementById('add-match-btn'),
  
  // Tournaments section
  tournamentsList: document.getElementById('tournaments-list'),
  createTournamentBtn: document.getElementById('create-tournament-btn'),
  pointsTableContainer: document.getElementById('points-table-container'),
  pointsTable: document.getElementById('points-table'),
  
  // Scorekeeper section
  battingTeam: document.getElementById('batting-team'),
  bowlingTeam: document.getElementById('bowling-team'),
  battingScore: document.getElementById('batting-score'),
  bowlingStats: document.getElementById('bowling-stats'),
  currentBatsmen: document.getElementById('current-batsmen'),
  currentBowler: document.getElementById('current-bowler'),
  endInningsBtn: document.getElementById('end-innings-btn'),
  finishMatchBtn: document.getElementById('finish-match-btn'),
  
  // Analytics section
  analyticsPeriod: document.getElementById('analytics-period'),
  battingChart: document.getElementById('batting-chart'),
  bowlingChart: document.getElementById('bowling-chart'),
  topScorer: document.getElementById('top-scorer'),
  topWicketTaker: document.getElementById('top-wicket-taker'),
  bestStrikeRate: document.getElementById('best-strike-rate'),
  bestEconomy: document.getElementById('best-economy'),
  
  // Modals
  modals: {
    addPlayer: document.getElementById('add-player-modal'),
    addMatch: document.getElementById('add-match-modal'),
    createTournament: document.getElementById('create-tournament-modal')
  },
  closeButtons: {
    player: document.getElementById('close-player-modal'),
    match: document.getElementById('close-match-modal'),
    tournament: document.getElementById('close-tournament-modal')
  },
  
  // Forms
  forms: {
    player: document.getElementById('player-form'),
    match: document.getElementById('match-form'),
    tournament: document.getElementById('tournament-form'),
    teamSettings: document.getElementById('team-settings-form')
  },
  
  // Other
  offlineIndicator: document.getElementById('offline-indicator'),
  globalAddBtn: document.getElementById('global-add-btn')
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  initNavigation();
  initModals();
  initForms();
  initScorekeeper();
  initAnalytics();
  checkOnlineStatus();
});

// ===== AUTHENTICATION =====
function initAuth() {
  // Auth state observer
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
      handleSignedInUser(user);
    } else {
      currentUser = null;
      handleSignedOutUser();
    }
  });

  // Auth button click
  elements.authBtn.addEventListener('click', signInWithGoogle);
}

function handleSignedInUser(user) {
  elements.authBtn.style.display = 'none';
  elements.userProfile.style.display = 'flex';
  elements.userName.textContent = user.displayName || user.email.split('@')[0];
  
  if (user.photoURL) {
    elements.userAvatar.src = user.photoURL;
    elements.userAvatar.style.display = 'block';
  }
  
  // Load data
  loadInitialData();
  
  // Show admin tab if user is admin
  if (user.email === 'admin@peshawarlions.com') {
    document.getElementById('admin-tab').style.display = 'list-item';
  }
}

function handleSignedOutUser() {
  elements.authBtn.style.display = 'block';
  elements.userProfile.style.display = 'none';
}

function signInWithGoogle() {
  signInWithPopup(auth, googleProvider)
    .catch((error) => {
      showAlert('Error signing in: ' + error.message, 'error');
    });
}

function signOutUser() {
  signOut(auth).catch((error) => {
    showAlert('Error signing out: ' + error.message, 'error');
  });
}

// ===== NAVIGATION =====
function initNavigation() {
  elements.navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      elements.navTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Show corresponding section
      const sectionId = tab.dataset.section;
      elements.appSections.forEach(section => {
        section.style.display = sectionId === section.id ? 'block' : 'none';
      });
      
      // Load section data if needed
      switch(sectionId) {
        case 'players':
          loadPlayers();
          break;
        case 'matches':
          loadMatches();
          break;
        case 'tournaments':
          loadTournaments();
          break;
        case 'analytics':
          loadAnalytics();
          break;
      }
    });
  });
}

// ===== DATA LOADING =====
function loadInitialData() {
  loadDashboardStats();
  loadPlayers();
  loadMatches();
  loadTournaments();
  loadUpcomingMatch();
}

function loadDashboardStats() {
  // Total matches
  const matchesQuery = query(collection(db, 'matches'));
  onSnapshot(matchesQuery, (snapshot) => {
    matches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    elements.totalMatches.textContent = matches.length;
    
    // Calculate wins/losses
    const wins = matches.filter(m => m.result === 'won').length;
    const losses = matches.filter(m => m.result === 'lost').length;
    
    elements.matchesWon.textContent = wins;
    elements.matchesLost.textContent = losses;
    elements.winPercentage.textContent = matches.length > 0 
      ? Math.round((wins / matches.length) * 100) + '%' 
      : '0%';
  });
}

function loadPlayers() {
  const playersQuery = query(collection(db, 'players'), orderBy('name'));
  onSnapshot(playersQuery, (snapshot) => {
    players = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderPlayersList();
  });
}

function renderPlayersList() {
  if (players.length === 0) {
    elements.playersList.innerHTML = '<tr><td colspan="7">No players found. Add your first player!</td></tr>';
    return;
  }
  
  elements.playersList.innerHTML = players.map(player => `
    <tr>
      <td><img src="${player.photoUrl || 'https://via.placeholder.com/50'}" alt="${player.name}" width="50" height="50" style="border-radius: 50%;"></td>
      <td>${player.name}</td>
      <td>${formatPlayerRole(player.role)}</td>
      <td>${player.matches || 0}</td>
      <td>${player.runs || 0}</td>
      <td>${player.wickets || 0}</td>
      <td>
        <button class="btn btn-primary btn-sm" onclick="viewPlayer('${player.id}')">View</button>
        <button class="btn btn-secondary btn-sm" onclick="editPlayer('${player.id}')">Edit</button>
      </td>
    </tr>
  `).join('');
}

function loadMatches() {
  const matchesQuery = query(collection(db, 'matches'), orderBy('date', 'desc'));
  onSnapshot(matchesQuery, (snapshot) => {
    matches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderMatchesList();
  });
}

function renderMatchesList() {
  if (matches.length === 0) {
    elements.matchesList.innerHTML = '<tr><td colspan="6">No matches found. Add your first match!</td></tr>';
    return;
  }
  
  elements.matchesList.innerHTML = matches.map(match => `
    <tr>
      <td>${formatDate(match.date)}</td>
      <td>${match.opponent}</td>
      <td>${match.format.toUpperCase()}</td>
      <td>${match.result ? match.result.charAt(0).toUpperCase() + match.result.slice(1) : 'Not played'}</td>
      <td>${match.score || '-'}</td>
      <td>
        <button class="btn btn-primary btn-sm" onclick="viewMatch('${match.id}')">View</button>
        ${!match.result ? `<button class="btn btn-secondary btn-sm" onclick="startScoring('${match.id}')">Score</button>` : ''}
      </td>
    </tr>
  `).join('');
}

function loadTournaments() {
  const tournamentsQuery = query(collection(db, 'tournaments'), orderBy('startDate', 'desc'));
  onSnapshot(tournamentsQuery, (snapshot) => {
    tournaments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderTournamentsList();
  });
}

function renderTournamentsList() {
  if (tournaments.length === 0) {
    elements.tournamentsList.innerHTML = '<tr><td colspan="6">No tournaments found. Create your first tournament!</td></tr>';
    return;
  }
  
  elements.tournamentsList.innerHTML = tournaments.map(tournament => `
    <tr>
      <td>${tournament.name}</td>
      <td>${tournament.teams}</td>
      <td>${formatDate(tournament.startDate)}</td>
      <td>${formatDate(tournament.endDate)}</td>
      <td>${getTournamentStatus(tournament)}</td>
      <td>
        <button class="btn btn-primary btn-sm" onclick="viewTournament('${tournament.id}')">View</button>
        <button class="btn btn-secondary btn-sm" onclick="manageTournament('${tournament.id}')">Manage</button>
      </td>
    </tr>
  `).join('');
}

function loadUpcomingMatch() {
  const today = new Date().toISOString().split('T')[0];
  const upcomingQuery = query(
    collection(db, 'matches'),
    where('date', '>=', today),
    orderBy('date'),
    limit(1)
  );
  
  onSnapshot(upcomingQuery, (snapshot) => {
    if (!snapshot.empty) {
      const match = snapshot.docs[0].data();
      elements.upcomingMatch.innerHTML = `
        <div class="scorecard">
          <div class="scorecard-team">
            <h4>Peshawar Lions</h4>
            <p>vs</p>
            <h4>${match.opponent}</h4>
            <p>Date: ${formatDate(match.date)}</p>
            <p>Venue: ${match.venue}</p>
          </div>
          <div class="scorecard-team">
            <h4>Match Details</h4>
            <p>Format: ${match.format.toUpperCase()}</p>
            <p>Toss: ${match.toss || 'Not decided'}</p>
            <button class="btn btn-secondary" onclick="startScoring('${snapshot.docs[0].id}')">Start Scoring</button>
          </div>
        </div>
      `;
    } else {
      elements.upcomingMatch.innerHTML = '<p>No upcoming matches scheduled.</p>';
    }
  });
}

// ===== SCOREKEEPER FUNCTIONALITY =====
function initScorekeeper() {
  // Score buttons
  document.querySelectorAll('[id^="score-"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const scoreType = btn.id.split('-')[1];
      recordScore(scoreType);
    });
  });
  
  // Match control buttons
  elements.endInningsBtn.addEventListener('click', endInnings);
  elements.finishMatchBtn.addEventListener('click', finishMatch);
}

function startScoring(matchId) {
  // Set active match
  activeMatch = matches.find(m => m.id === matchId);
  
  // Navigate to scorekeeper
  document.querySelector('[data-section="scorekeeper"]').click();
  
  // Initialize match state
  elements.battingScore.textContent = '0/0 (0.0 overs)';
  elements.bowlingStats.textContent = '0 wickets, 0 runs';
  
  // Load players for selection
  renderPlayerSelection();
}

function renderPlayerSelection() {
  // Render batsmen selection
  elements.currentBatsmen.innerHTML = `
    <div class="form-group">
      <label>Select Batsmen</label>
      <select class="form-control" id="batsman1">
        ${players.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
      </select>
      <select class="form-control" id="batsman2">
        ${players.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
      </select>
    </div>
  `;
  
  // Render bowler selection
  elements.currentBowler.innerHTML = `
    <div class="form-group">
      <label>Select Bowler</label>
      <select class="form-control" id="bowler">
        ${players.filter(p => p.role !== 'batsman').map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
      </select>
    </div>
  `;
}

function recordScore(scoreType) {
  if (!activeMatch) return;
  
  // Update match state
  // In a real app, this would update Firestore and calculate all stats
  const scoreText = elements.battingScore.textContent;
  const [runsWickets, overs] = scoreText.split(' (');
  const [runs, wickets] = runsWickets.split('/').map(Number);
  const overParts = overs.split('.');
  const balls = parseInt(overParts[0]) * 6 + parseInt(overParts[1]);
  
  let newRuns = runs;
  let newWickets = wickets;
  let newBalls = balls + 1;
  
  switch(scoreType) {
    case '1': newRuns += 1; break;
    case '2': newRuns += 2; break;
    case '3': newRuns += 3; break;
    case '4': newRuns += 4; break;
    case '5': newRuns += 5; break;
    case '6': newRuns += 6; break;
    case 'w': 
      newWickets += 1;
      newBalls -= 1; // Wicket doesn't count as a ball
      break;
    case 'wd': newRuns += 1; newBalls -= 1; break;
    case 'nb': newRuns += 1; newBalls -= 1; break;
    case 'dot': break;
  }
  
  // Calculate new overs
  const newOvers = Math.floor(newBalls / 6) + '.' + (newBalls % 6);
  
  // Update display
  elements.battingScore.textContent = `${newRuns}/${newWickets} (${newOvers} overs)`;
  elements.bowlingStats.textContent = `${newWickets} wickets, ${newRuns} runs`;
  
  // Add to wagon wheel for scoring shots
  if (['1','2','3','4','5','6'].includes(scoreType)) {
    addShotToWagonWheel(scoreType);
  }
  
  // Update player stats (in a real app, this would be in Firestore)
  updatePlayerStats(scoreType);
}

function addShotToWagonWheel(scoreType) {
  const wagonWheel = document.getElementById('wagon-wheel');
  const shot = document.createElement('div');
  shot.className = 'shot';
  
  // Position based on shot type (simplified for demo)
  const positions = {
    '1': { left: '30%', top: '70%' },
    '2': { left: '50%', top: '80%' },
    '3': { left: '70%', top: '70%' },
    '4': { left: '20%', top: '40%' },
    '5': { left: '80%', top: '40%' },
    '6': { left: '50%', top: '20%' }
  };
  
  shot.style.left = positions[scoreType].left;
  shot.style.top = positions[scoreType].top;
  wagonWheel.appendChild(shot);
}

function updatePlayerStats(scoreType) {
  // In a real app, this would update Firestore documents
  console.log(`Updating stats for score: ${scoreType}`);
}

function endInnings() {
  if (!activeMatch) return;
  showAlert('Innings ended. Ready for next innings.', 'success');
}

function finishMatch() {
  if (!activeMatch) return;
  
  // Prompt for result
  const result = confirm('Did Peshawar Lions win this match?');
  
  // Update match in Firestore
  updateDoc(doc(db, 'matches', activeMatch.id), {
    result: result ? 'won' : 'lost',
    status: 'completed',
    score: elements.battingScore.textContent
  }).then(() => {
    showAlert('Match result saved successfully!', 'success');
    activeMatch = null;
    document.querySelector('[data-section="matches"]').click();
  }).catch(error => {
    showAlert('Error saving match result: ' + error.message, 'error');
  });
}

// ===== ANALYTICS =====
function initAnalytics() {
  elements.analyticsPeriod.addEventListener('change', loadAnalytics);
}

function loadAnalytics() {
  const period = elements.analyticsPeriod.value;
  
  // Filter matches based on period
  let filteredMatches = [...matches];
  if (period !== 'all') {
    const days = parseInt(period);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    filteredMatches = matches.filter(m => new Date(m.date) >= cutoffDate);
  }
  
  // Update charts (simplified for demo)
  updateBattingChart(filteredMatches);
  updateBowlingChart(filteredMatches);
  updateTopPerformers();
}

function updateBattingChart(matches) {
  // In a real app, this would use actual player stats
  const ctx = elements.battingChart.getContext('2d');
  
  if (window.battingChart) {
    window.battingChart.destroy();
  }
  
  window.battingChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: players.slice(0, 5).map(p => p.name),
      datasets: [{
        label: 'Runs',
        data: players.slice(0, 5).map(() => Math.floor(Math.random() * 300) + 50),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Top Batsmen (Last ' + elements.analyticsPeriod.value + ' Days)'
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

function updateBowlingChart(matches) {
  // In a real app, this would use actual player stats
  const ctx = elements.bowlingChart.getContext('2d');
  
  if (window.bowlingChart) {
    window.bowlingChart.destroy();
  }
  
  window.bowlingChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: players.filter(p => p.role !== 'batsman').slice(0, 5).map(p => p.name),
      datasets: [{
        label: 'Wickets',
        data: players.filter(p => p.role !== 'batsman').slice(0, 5).map(() => Math.floor(Math.random() * 15) + 1),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Top Bowlers (Last ' + elements.analyticsPeriod.value + ' Days)'
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

function updateTopPerformers() {
  // In a real app, this would use actual stats
  elements.topScorer.textContent = players.length > 0 
    ? `${players[0].name} (${Math.floor(Math.random() * 500) + 100} runs)` 
    : '-';
    
  elements.topWicketTaker.textContent = players.filter(p => p.role !== 'batsman').length > 0
    ? `${players.filter(p => p.role !== 'batsman')[0].name} (${Math.floor(Math.random() * 20) + 5} wickets)`
    : '-';
    
  elements.bestStrikeRate.textContent = players.length > 0
    ? `${players[1].name} (${(Math.random() * 50 + 100).toFixed(2)})`
    : '-';
    
  elements.bestEconomy.textContent = players.filter(p => p.role !== 'batsman').length > 0
    ? `${players.filter(p => p.role !== 'batsman')[1].name} (${(Math.random() * 2 + 4).toFixed(2)})`
    : '-';
}

// ===== MODAL MANAGEMENT =====
function initModals() {
  // Open modals
  elements.addPlayerBtn.addEventListener('click', () => showModal('addPlayer'));
  elements.addMatchBtn.addEventListener('click', () => showModal('addMatch'));
  elements.createTournamentBtn.addEventListener('click', () => showModal('createTournament'));
  
  // Close modals
  elements.closeButtons.player.addEventListener('click', () => hideModal('addPlayer'));
  elements.closeButtons.match.addEventListener('click', () => hideModal('addMatch'));
  elements.closeButtons.tournament.addEventListener('click', () => hideModal('createTournament'));
  
  // Global add button
  elements.globalAddBtn.addEventListener('click', () => {
    const activeTab = document.querySelector('.nav-tabs li.active').dataset.section;
    switch(activeTab) {
      case 'players': showModal('addPlayer'); break;
      case 'matches': showModal('addMatch'); break;
      case 'tournaments': showModal('createTournament'); break;
      default: showAlert('No add action for this section', 'info');
    }
  });
}

function showModal(modalName) {
  elements.modals[modalName].style.display = 'flex';
}

function hideModal(modalName) {
  elements.modals[modalName].style.display = 'none';
}

// ===== FORM HANDLING =====
function initForms() {
  // Player form
  elements.forms.player.addEventListener('submit', (e) => {
    e.preventDefault();
    addPlayerFromForm();
  });
  
  // Match form
  elements.forms.match.addEventListener('submit', (e) => {
    e.preventDefault();
    addMatchFromForm();
  });
  
  // Tournament form
  elements.forms.tournament.addEventListener('submit', (e) => {
    e.preventDefault();
    createTournamentFromForm();
  });
  
  // Team settings form
  elements.forms.teamSettings.addEventListener('submit', (e) => {
    e.preventDefault();
    saveTeamSettings();
  });
}

function addPlayerFromForm() {
  const formData = new FormData(elements.forms.player);
  const playerData = {
    name: formData.get('name'),
    role: formData.get('role'),
    battingStyle: formData.get('batting'),
    bowlingStyle: formData.get('bowling'),
    dob: formData.get('dob'),
    createdAt: new Date().toISOString(),
    matches: 0,
    runs: 0,
    wickets: 0
  };
  
  const photoFile = formData.get('photo');
  
  if (photoFile && photoFile.size > 0) {
    uploadPlayerPhoto(photoFile, playerData);
  } else {
    savePlayer(playerData);
  }
}

function uploadPlayerPhoto(file, playerData) {
  const storageRef = ref(storage, `players/${playerData.name}-${Date.now()}`);
  
  uploadBytes(storageRef, file)
    .then((snapshot) => getDownloadURL(snapshot.ref))
    .then((url) => {
      playerData.photoUrl = url;
      savePlayer(playerData);
    })
    .catch((error) => {
      showAlert('Error uploading photo: ' + error.message, 'error');
    });
}

function savePlayer(playerData) {
  addDoc(collection(db, 'players'), playerData)
    .then(() => {
      showAlert('Player added successfully!', 'success');
      elements.forms.player.reset();
      hideModal('addPlayer');
    })
    .catch((error) => {
      showAlert('Error adding player: ' + error.message, 'error');
    });
}

function addMatchFromForm() {
  const formData = new FormData(elements.forms.match);
  const matchData = {
    opponent: formData.get('opponent'),
    date: formData.get('date'),
    venue: formData.get('venue'),
    format: formData.get('format'),
    overs: parseInt(formData.get('overs')),
    createdAt: new Date().toISOString(),
    status: 'scheduled',
    toss: null,
    result: null,
    score: null
  };
  
  addDoc(collection(db, 'matches'), matchData)
    .then(() => {
      showAlert('Match added successfully!', 'success');
      elements.forms.match.reset();
      hideModal('addMatch');
    })
    .catch((error) => {
      showAlert('Error adding match: ' + error.message, 'error');
    });
}

function createTournamentFromForm() {
  const formData = new FormData(elements.forms.tournament);
  const tournamentData = {
    name: formData.get('name'),
    teams: parseInt(formData.get('teams')),
    startDate: formData.get('start'),
    endDate: formData.get('end'),
    format: formData.get('format'),
    matchFormat: formData.get('matchFormat'),
    createdAt: new Date().toISOString(),
    status: 'planned',
    currentStage: 'group',
    fixturesGenerated: false
  };
  
  addDoc(collection(db, 'tournaments'), tournamentData)
    .then(() => {
      showAlert('Tournament created successfully!', 'success');
      elements.forms.tournament.reset();
      hideModal('createTournament');
    })
    .catch((error) => {
      showAlert('Error creating tournament: ' + error.message, 'error');
    });
}

function saveTeamSettings() {
  const formData = new FormData(elements.forms.teamSettings);
  const logoFile = formData.get('logo');
  
  if (logoFile && logoFile.size > 0) {
    // Upload new logo
    const storageRef = ref(storage, `team/logo-${Date.now()}`);
    
    uploadBytes(storageRef, logoFile)
      .then((snapshot) => getDownloadURL(snapshot.ref))
      .then((url) => {
        updateTeamSettings({
          name: formData.get('name'),
          logoUrl: url,
          defaultFormat: formData.get('format')
        });
      })
      .catch((error) => {
        showAlert('Error uploading logo: ' + error.message, 'error');
      });
  } else {
    // Update without changing logo
    updateTeamSettings({
      name: formData.get('name'),
      defaultFormat: formData.get('format')
    });
  }
}

function updateTeamSettings(settings) {
  // In a real app, this would update Firestore
  showAlert('Team settings saved successfully!', 'success');
  console.log('Updated team settings:', settings);
}

// ===== UTILITY FUNCTIONS =====
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatPlayerRole(role) {
  const roles = {
    'batsman': 'Batsman',
    'bowler': 'Bowler',
    'all-rounder': 'All Rounder',
    'wicketkeeper': 'Wicketkeeper'
  };
  return roles[role] || role;
}

function getTournamentStatus(tournament) {
  const today = new Date();
  const startDate = new Date(tournament.startDate);
  const endDate = new Date(tournament.endDate);
  
  if (today < startDate) return 'Upcoming';
  if (today > endDate) return 'Completed';
  return 'In Progress';
}

function showAlert(message, type = 'info') {
  const colors = {
    info: '#3182ce',
    success: '#38a169',
    warning: '#dd6b20',
    error: '#e53e3e'
  };
  
  const alert = document.createElement('div');
  alert.style.position = 'fixed';
  alert.style.bottom = '20px';
  alert.style.right = '20px';
  alert.style.padding = '12px 24px';
  alert.style.backgroundColor = colors[type] || colors.info;
  alert.style.color = 'white';
  alert.style.borderRadius = '4px';
  alert.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  alert.style.zIndex = '1000';
  alert.style.animation = 'fadeIn 0.3s ease-in-out';
  alert.textContent = message;
  
  document.body.appendChild(alert);
  
  setTimeout(() => {
    alert.style.animation = 'fadeOut 0.3s ease-in-out';
    setTimeout(() => alert.remove(), 300);
  }, 3000);
}

function checkOnlineStatus() {
  window.addEventListener('online', () => {
    elements.offlineIndicator.style.display = 'none';
    showAlert('You are back online. Data will be synced.', 'success');
  });
  
  window.addEventListener('offline', () => {
    elements.offlineIndicator.style.display = 'block';
  });
  
  // Initial check
  if (!navigator.onLine) {
    elements.offlineIndicator.style.display = 'block';
  }
}

// ===== GLOBAL FUNCTIONS =====
// These are made available to HTML onclick handlers
window.viewPlayer = (playerId) => {
  const player = players.find(p => p.id === playerId);
  if (player) {
    alert(`Viewing player: ${player.name}\nRole: ${formatPlayerRole(player.role)}\nMatches: ${player.matches || 0}\nRuns: ${player.runs || 0}\nWickets: ${player.wickets || 0}`);
  }
};

window.editPlayer = (playerId) => {
  alert('Edit player: ' + playerId);
  // In a real app, this would open an edit form with the player's data
};

window.viewMatch = (matchId) => {
  const match = matches.find(m => m.id === matchId);
  if (match) {
    alert(`Match details:\nvs ${match.opponent}\nDate: ${formatDate(match.date)}\nVenue: ${match.venue}\nResult: ${match.result || 'Not played yet'}`);
  }
};

window.startScoring = (matchId) => {
  startScoring(matchId);
};

window.viewTournament = (tournamentId) => {
  const tournament = tournaments.find(t => t.id === tournamentId);
  if (tournament) {
    alert(`Tournament: ${tournament.name}\nTeams: ${tournament.teams}\nStatus: ${getTournamentStatus(tournament)}`);
  }
};

window.manageTournament = (tournamentId) => {
  alert('Manage tournament: ' + tournamentId);
  // In a real app, this would open tournament management
};

// Add CSS animations for alerts
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(20px); }
  }
`;
document.head.appendChild(style);