// Import Firebase services
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
    query,
    where,
    orderBy,
    writeBatch,
    enableIndexedDbPersistence
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { 
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Initialize jsPDF
const { jsPDF } = window.jspdf;

// Match Engine Class
class MatchEngine {
    constructor() {
        this.balls = [];
        this.currentBatsmen = [];
        this.currentBowler = null;
        this.team = [];
        this.commentary = [];
    }

    addBall(ballData) {
        const ballNumber = this.balls.length + 1;
        const over = Math.floor(ballNumber / 6) + 1;
        const ballInOver = (ballNumber % 6) || 6;
        
        const ballRecord = {
            ...ballData,
            ballNumber,
            over,
            ballInOver,
            timestamp: new Date()
        };
        
        this.balls.push(ballRecord);
        this.addCommentary(ballRecord);
        this.updateScorecard();
        this.updateWagonWheel(ballRecord);
    }

    addCommentary(ball) {
        let comment = `Over ${ball.over}.${ball.ballInOver}: `;
        
        if (ball.wicket) {
            comment += `Wicket! ${ball.batsman} is out. `;
        } else if (ball.runs > 0) {
            comment += `${ball.runs} run${ball.runs > 1 ? 's' : ''} scored. `;
        } else {
            comment += "Dot ball. ";
        }
        
        this.commentary.push(comment);
        this.updateCommentaryBox();
    }

    updateCommentaryBox() {
        const box = document.getElementById('commentary-box');
        box.innerHTML = this.commentary.map(c => `<p>${c}</p>`).join('');
        box.scrollTop = box.scrollHeight;
    }

    updateScorecard() {
        const runs = this.balls.reduce((sum, ball) => sum + (ball.runs || 0), 0);
        const wickets = this.balls.filter(ball => ball.wicket).length;
        const overs = Math.floor(this.balls.length / 6);
        const balls = this.balls.length % 6;
        
        document.getElementById('batting-score').textContent = 
            `${runs}/${wickets} (${overs}.${balls} overs)`;
    }

    updateWagonWheel(ball) {
        if (ball.runs > 0 && !ball.wicket) {
            const wagonWheel = document.getElementById('wagon-wheel');
            const shot = document.createElement('div');
            shot.className = 'shot';
            
            // Position based on shot type (simplified)
            const angle = Math.random() * 360;
            const distance = 30 + (ball.runs * 10);
            const x = 50 + (distance * Math.cos(angle * Math.PI / 180));
            const y = 50 + (distance * Math.sin(angle * Math.PI / 180));
            
            shot.style.left = `${x}%`;
            shot.style.top = `${y}%`;
            
            // Color based on runs
            if (ball.runs === 4) shot.style.backgroundColor = 'blue';
            if (ball.runs === 6) shot.style.backgroundColor = 'green';
            
            wagonWheel.appendChild(shot);
        }
    }

    setTeam(players) {
        this.team = players;
        // Set initial batsmen and bowler
        this.currentBatsmen = players.slice(0, 2);
        this.currentBowler = players.find(p => p.role === 'bowler' || p.role === 'all-rounder') || players[2];
        
        this.updatePlayerDisplays();
    }

    updatePlayerDisplays() {
        const batsmenDiv = document.getElementById('current-batsmen');
        const bowlerDiv = document.getElementById('current-bowler');
        
        batsmenDiv.innerHTML = this.currentBatsmen.map(player => `
            <div class="player-card">
                <strong>${player.name}</strong>
                <span>${player.runs || 0} (${player.balls || 0})</span>
            </div>
        `).join('');
        
        bowlerDiv.innerHTML = `
            <div class="player-card">
                <strong>${this.currentBowler.name}</strong>
                <span>${this.currentBowler.wickets || 0}/${this.currentBowler.runs || 0}</span>
            </div>
        `;
    }
}

// Global match engine instance
const matchEngine = new MatchEngine();

// Initialize UI
document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    setupEventListeners();
    enableOfflinePersistence();
    checkAuthState();
    requestNotificationPermission();
});

function initializeCharts() {
    // Performance Chart
    const performanceCtx = document.getElementById('performance-chart').getContext('2d');
    new Chart(performanceCtx, {
        type: 'line',
        data: {
            labels: ['Match 1', 'Match 2', 'Match 3', 'Match 4', 'Match 5', 'Match 6'],
            datasets: [{
                label: 'Runs Scored',
                data: [120, 190, 150, 210, 180, 220],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1
            }, {
                label: 'Wickets Taken',
                data: [5, 7, 3, 8, 6, 4],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.1
            }]
        },
        options: { responsive: true, plugins: { legend: { position: 'top' } } }
    });

    // Batting Chart
    const battingCtx = document.getElementById('batting-chart').getContext('2d');
    new Chart(battingCtx, {
        type: 'bar',
        data: {
            labels: ['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5'],
            datasets: [{
                label: 'Runs',
                data: [320, 290, 250, 210, 180],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }, {
                label: 'Average',
                data: [32, 29, 25, 21, 18],
                backgroundColor: 'rgba(255, 159, 64, 0.5)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
                type: 'line'
            }]
        },
        options: { responsive: true, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } }
    });

    // Bowling Chart
    const bowlingCtx = document.getElementById('bowling-chart').getContext('2d');
    new Chart(bowlingCtx, {
        type: 'bar',
        data: {
            labels: ['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5'],
            datasets: [{
                label: 'Wickets',
                data: [12, 9, 8, 6, 5],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }, {
                label: 'Economy',
                data: [5.2, 6.1, 4.8, 7.2, 5.9],
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
                type: 'line'
            }]
        },
        options: { responsive: true, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } }
    });

    // Initialize wagon wheel
    const wagonWheel = document.getElementById('wagon-wheel');
    for (let i = 0; i < 6; i++) {
        const segment = document.createElement('div');
        segment.className = 'segment';
        wagonWheel.appendChild(segment);
    }
}

function setupEventListeners() {
    // Online/offline status
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Auth buttons
    document.getElementById('auth-btn').addEventListener('click', signInWithGoogle);
    document.getElementById('sign-out-btn').addEventListener('click', signOutUser);
    
    // Navigation
    document.querySelectorAll('.nav-tabs li').forEach(tab => {
        tab.addEventListener('click', switchTab);
    });
    
    // Global add button
    document.getElementById('global-add-btn').addEventListener('click', handleGlobalAdd);
    
    // Modal handlers
    document.getElementById('add-player-btn').addEventListener('click', () => showModal('add-player-modal'));
    document.getElementById('close-player-modal').addEventListener('click', () => hideModal('add-player-modal'));
    document.getElementById('add-match-btn').addEventListener('click', () => showModal('add-match-modal'));
    document.getElementById('close-match-modal').addEventListener('click', () => hideModal('add-match-modal'));
    document.getElementById('create-tournament-btn').addEventListener('click', () => showModal('create-tournament-modal'));
    document.getElementById('close-tournament-modal').addEventListener('click', () => hideModal('create-tournament-modal'));
    document.getElementById('select-team-btn').addEventListener('click', showTeamSelectionModal);
    document.getElementById('close-team-modal').addEventListener('click', () => hideModal('team-selection-modal'));
    document.getElementById('generate-report-btn').addEventListener('click', showReportModal);
    document.getElementById('close-report-modal').addEventListener('click', () => hideModal('report-modal'));
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Form submissions
    document.getElementById('player-form').addEventListener('submit', addPlayer);
    document.getElementById('match-form').addEventListener('submit', addMatch);
    document.getElementById('tournament-form').addEventListener('submit', createTournament);
    document.getElementById('team-settings-form').addEventListener('submit', saveTeamSettings);
    
    // Score input buttons
    document.querySelectorAll('.stat-card[id^="score-"]').forEach(btn => {
        btn.addEventListener('click', handleScoreInput);
    });
    
    // Team selection
    document.getElementById('confirm-team-btn').addEventListener('click', confirmTeamSelection);
    
    // Reports
    document.getElementById('download-report-btn').addEventListener('click', generatePDFReport);
    
    // Other buttons
    document.getElementById('check-notifications-btn').addEventListener('click', checkUpcomingMatches);
    document.getElementById('export-players-btn').addEventListener('click', exportPlayersData);
    document.getElementById('backup-data-btn').addEventListener('click', backupDataToCloud);
}

function enableOfflinePersistence() {
    enableIndexedDbPersistence(db)
        .catch((err) => {
            if (err.code == 'failed-precondition') {
                console.log("Offline persistence can only be enabled in one tab at a time.");
            } else if (err.code == 'unimplemented') {
                console.log("The current browser does not support offline persistence.");
            }
        });
}

function checkAuthState() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            document.getElementById('auth-btn').style.display = 'none';
            const userProfile = document.getElementById('user-profile');
            userProfile.style.display = 'flex';
            document.getElementById('user-name').textContent = user.displayName || user.email;
            
            if (user.photoURL) {
                document.getElementById('user-avatar').src = user.photoURL;
            }
            
            // Set admin tab visibility based on user role
            if (user.uid === 'ADMIN_UID_HERE') {
                document.getElementById('admin-tab').style.display = 'list-item';
            }
            
            // Load initial data
            loadPlayers();
            loadMatches();
            loadTournaments();
            
            // Check for upcoming matches
            checkUpcomingMatches();
        } else {
            // User is signed out
            document.getElementById('auth-btn').style.display = 'block';
            document.getElementById('user-profile').style.display = 'none';
        }
    });
}

function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Notification permission granted');
            }
        });
    }
}

// Data loading functions
async function loadPlayers() {
    const playersList = document.getElementById('players-list');
    playersList.innerHTML = '<tr><td colspan="8">Loading players...</td></tr>';
    
    try {
        const querySnapshot = await getDocs(collection(db, 'players'));
        playersList.innerHTML = '';
        
        if (querySnapshot.empty) {
            playersList.innerHTML = '<tr><td colspan="8">No players found. Add your first player!</td></tr>';
            return;
        }
        
        querySnapshot.forEach((doc) => {
            const player = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${player.photoUrl || 'https://via.placeholder.com/50'}" alt="${player.name}" width="50" height="50" style="border-radius: 50%;"></td>
                <td>${player.name}</td>
                <td>${player.role}</td>
                <td>${player.matches || 0}</td>
                <td>${player.runs || 0}</td>
                <td>${player.wickets || 0}</td>
                <td>${player.battingStats?.average || '-'}</td>
                <td>
                    <button class="btn btn-primary btn-sm" data-id="${doc.id}">View</button>
                    <button class="btn btn-secondary btn-sm" data-id="${doc.id}">Edit</button>
                </td>
            `;
            playersList.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading players:', error);
        playersList.innerHTML = '<tr><td colspan="8">Error loading players. Please try again.</td></tr>';
    }
}

async function loadMatches() {
    const matchesList = document.getElementById('matches-list');
    matchesList.innerHTML = '<tr><td colspan="6">Loading matches...</td></tr>';
    
    try {
        const querySnapshot = await getDocs(query(collection(db, 'matches'), orderBy('date', 'desc')));
        matchesList.innerHTML = '';
        
        if (querySnapshot.empty) {
            matchesList.innerHTML = '<tr><td colspan="6">No matches found. Add your first match!</td></tr>';
            return;
        }
        
        // Update dashboard stats
        const totalMatches = querySnapshot.size;
        const matchesWon = querySnapshot.docs.filter(doc => doc.data().result === 'won').length;
        const winPercentage = (matchesWon / totalMatches * 100).toFixed(1);
        
        document.getElementById('total-matches').textContent = totalMatches;
        document.getElementById('matches-won').textContent = matchesWon;
        document.getElementById('matches-lost').textContent = totalMatches - matchesWon;
        document.getElementById('win-percentage').textContent = `${winPercentage}%`;
        
        // Find upcoming match
        const now = new Date();
        const upcoming = querySnapshot.docs
            .map(doc => doc.data())
            .find(match => new Date(match.date) > now);
        
        if (upcoming) {
            document.getElementById('opponent-name').textContent = upcoming.opponent;
            document.getElementById('match-date').textContent = `Date: ${new Date(upcoming.date).toLocaleDateString()}`;
            document.getElementById('match-venue').textContent = `Venue: ${upcoming.venue}`;
            document.getElementById('match-format').textContent = `Format: ${upcoming.format.toUpperCase()}`;
        }
        
        // Populate matches table
        querySnapshot.forEach((doc) => {
            const match = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(match.date).toLocaleDateString()}</td>
                <td>${match.opponent}</td>
                <td>${match.format.toUpperCase()}</td>
                <td>${match.result || 'Not played yet'}</td>
                <td>${match.score || '-'}</td>
                <td>
                    <button class="btn btn-primary btn-sm" data-id="${doc.id}">View</button>
                    <button class="btn btn-secondary btn-sm" data-id="${doc.id}">Score</button>
                </td>
            `;
            matchesList.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading matches:', error);
        matchesList.innerHTML = '<tr><td colspan="6">Error loading matches. Please try again.</td></tr>';
    }
}

async function loadTournaments() {
    const tournamentsList = document.getElementById('tournaments-list');
    tournamentsList.innerHTML = '<tr><td colspan="6">Loading tournaments...</td></tr>';
    
    try {
        const querySnapshot = await getDocs(collection(db, 'tournaments'));
        tournamentsList.innerHTML = '';
        
        if (querySnapshot.empty) {
            tournamentsList.innerHTML = '<tr><td colspan="6">No tournaments found. Create your first tournament!</td></tr>';
            return;
        }
        
        // Populate tournaments dropdown in match form
        const tournamentSelect = document.getElementById('match-tournament');
        tournamentSelect.innerHTML = '<option value="">None</option>';
        
        querySnapshot.forEach((doc) => {
            const tournament = doc.data();
            
            // Add to dropdown
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = tournament.name;
            tournamentSelect.appendChild(option);
            
            // Add to table
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${tournament.name}</td>
                <td>${tournament.teams}</td>
                <td>${new Date(tournament.startDate).toLocaleDateString()}</td>
                <td>${new Date(tournament.endDate).toLocaleDateString()}</td>
                <td>${getTournamentStatus(tournament)}</td>
                <td>
                    <button class="btn btn-primary btn-sm" data-id="${doc.id}">View</button>
                    <button class="btn btn-secondary btn-sm" data-id="${doc.id}">Manage</button>
                </td>
            `;
            tournamentsList.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading tournaments:', error);
        tournamentsList.innerHTML = '<tr><td colspan="6">Error loading tournaments. Please try again.</td></tr>';
    }
}

function getTournamentStatus(tournament) {
    const today = new Date();
    const startDate = new Date(tournament.startDate);
    const endDate = new Date(tournament.endDate);
    
    if (today < startDate) return 'Upcoming';
    if (today > endDate) return 'Completed';
    return 'In Progress';
}

// Data creation functions
async function addPlayer(e) {
    e.preventDefault();
    const form = document.getElementById('player-form');
    const playerName = document.getElementById('player-name').value;
    const playerRole = document.getElementById('player-role').value;
    const playerBatting = document.getElementById('player-batting').value;
    const playerBowling = document.getElementById('player-bowling').value;
    const primaryPosition = document.getElementById('primary-position').value;
    const playerDob = document.getElementById('player-dob').value;
    const playerPhoto = document.getElementById('player-photo').files[0];
    
    // Create player data object with advanced stats
    let playerData = {
        name: playerName,
        role: playerRole,
        battingStyle: playerBatting,
        bowlingStyle: playerBowling,
        positions: { primary: primaryPosition },
        dob: playerDob,
        createdAt: new Date().toISOString(),
        matches: 0,
        runs: 0,
        wickets: 0,
        battingStats: { innings: 0, average: 0, strikeRate: 0, highestScore: 0 },
        bowlingStats: { innings: 0, average: 0, economy: 0, bestFigures: "0/0" }
    };
    
    try {
        if (playerPhoto) {
            const storageRef = ref(storage, `players/${playerName}-${Date.now()}`);
            const snapshot = await uploadBytes(storageRef, playerPhoto);
            const downloadURL = await getDownloadURL(snapshot.ref);
            playerData.photoUrl = downloadURL;
        }
        
        await addDoc(collection(db, 'players'), playerData);
        showNotification('Player added successfully!');
        form.reset();
        hideModal('add-player-modal');
        loadPlayers();
    } catch (error) {
        console.error('Error adding player:', error);
        showNotification('Error adding player. Please try again.');
    }
}

async function addMatch(e) {
    e.preventDefault();
    const form = document.getElementById('match-form');
    const opponent = document.getElementById('match-opponent').value;
    const date = document.getElementById('match-date').value;
    const venue = document.getElementById('match-venue').value;
    const format = document.getElementById('match-format').value;
    const overs = document.getElementById('match-overs').value;
    const tournamentId = document.getElementById('match-tournament').value;
    
    const matchData = {
        opponent,
        date,
        venue,
        format,
        overs: parseInt(overs),
        createdAt: new Date().toISOString(),
        status: 'scheduled',
        toss: null,
        result: null,
        score: null
    };
    
    if (tournamentId) matchData.tournamentId = tournamentId;
    
    try {
        await addDoc(collection(db, 'matches'), matchData);
        showNotification('Match added successfully!');
        form.reset();
        hideModal('add-match-modal');
        loadMatches();
    } catch (error) {
        console.error('Error adding match:', error);
        showNotification('Error adding match. Please try again.');
    }
}

async function createTournament(e) {
    e.preventDefault();
    const form = document.getElementById('tournament-form');
    const name = document.getElementById('tournament-name').value;
    const teams = document.getElementById('tournament-teams').value;
    const startDate = document.getElementById('tournament-start').value;
    const endDate = document.getElementById('tournament-end').value;
    const format = document.getElementById('tournament-format').value;
    const matchFormat = document.getElementById('tournament-match-format').value;
    
    const tournamentData = {
        name,
        teams: parseInt(teams),
        startDate,
        endDate,
        format,
        matchFormat,
        createdAt: new Date().toISOString(),
        status: 'planned',
        currentStage: 'group',
        fixturesGenerated: false
    };
    
    try {
        await addDoc(collection(db, 'tournaments'), tournamentData);
        showNotification('Tournament created successfully!');
        form.reset();
        hideModal('create-tournament-modal');
        loadTournaments();
    } catch (error) {
        console.error('Error creating tournament:', error);
        showNotification('Error creating tournament. Please try again.');
    }
}

async function saveTeamSettings(e) {
    e.preventDefault();
    const form = document.getElementById('team-settings-form');
    const teamName = document.getElementById('team-name').value;
    const defaultFormat = document.getElementById('default-format').value;
    const teamLogo = document.getElementById('team-logo').files[0];
    
    const settings = {
        teamName,
        defaultFormat,
        updatedAt: new Date().toISOString()
    };
    
    try {
        if (teamLogo) {
            const storageRef = ref(storage, `team/logo-${Date.now()}`);
            const snapshot = await uploadBytes(storageRef, teamLogo);
            const downloadURL = await getDownloadURL(snapshot.ref);
            settings.teamLogoUrl = downloadURL;
            document.querySelector('.logo img').src = settings.teamLogoUrl;
        }
        
        await setDoc(doc(db, 'settings', 'team'), settings, { merge: true });
        showNotification('Team settings saved successfully!');
    } catch (error) {
        console.error('Error saving team settings:', error);
        showNotification('Error saving settings. Please try again.');
    }
}

// Scorekeeping functions
function handleScoreInput(e) {
    const scoreType = e.target.id.split('-')[1];
    let ballData = {
        batsman: matchEngine.currentBatsmen[0]?.name || 'Batsman',
        bowler: matchEngine.currentBowler?.name || 'Bowler',
        runs: 0,
        wicket: false,
        extras: null
    };
    
    switch(scoreType) {
        case '1': ballData.runs = 1; break;
        case '2': ballData.runs = 2; break;
        case '3': ballData.runs = 3; break;
        case '4': ballData.runs = 4; break;
        case '5': ballData.runs = 5; break;
        case '6': ballData.runs = 6; break;
        case 'w': ballData.wicket = true; break;
        case 'wd': ballData.extras = 'wide'; ballData.runs = 1; break;
        case 'nb': ballData.extras = 'noball'; ballData.runs = 1; break;
        case 'b': ballData.extras = 'bye'; break;
        case 'lb': ballData.extras = 'legbye'; break;
        case 'dot': break;
    }
    
    matchEngine.addBall(ballData);
}

// Team Selection
async function showTeamSelectionModal() {
    const teamSelection = document.getElementById('team-selection');
    teamSelection.innerHTML = '<p>Loading players...</p>';
    
    try {
        const querySnapshot = await getDocs(collection(db, 'players'));
        teamSelection.innerHTML = '';
        
        if (querySnapshot.empty) {
            teamSelection.innerHTML = '<p>No players available</p>';
            return;
        }
        
        querySnapshot.forEach((doc) => {
            const player = doc.data();
            const card = document.createElement('div');
            card.className = 'player-select-card';
            card.dataset.player = JSON.stringify(player);
            card.innerHTML = `
                <strong>${player.name}</strong>
                <div>${player.role} • ${player.positions?.primary || '-'}</div>
            `;
            
            card.addEventListener('click', () => {
                card.classList.toggle('selected');
                updateSelectionCount();
            });
            
            teamSelection.appendChild(card);
        });
        
        showModal('team-selection-modal');
    } catch (error) {
        console.error('Error loading players:', error);
        teamSelection.innerHTML = '<p>Error loading players</p>';
    }
}

function updateSelectionCount() {
    const selected = document.querySelectorAll('.player-select-card.selected').length;
    document.getElementById('selected-count').textContent = selected;
    document.getElementById('confirm-team-btn').disabled = selected !== 11;
}

function confirmTeamSelection() {
    const selectedPlayers = [];
    document.querySelectorAll('.player-select-card.selected').forEach(card => {
        selectedPlayers.push(JSON.parse(card.dataset.player));
    });
    
    matchEngine.setTeam(selectedPlayers);
    hideModal('team-selection-modal');
    showNotification('Team selected successfully!');
}

// Reports
async function showReportModal() {
    const reportContent = document.getElementById('report-content');
    reportContent.innerHTML = '<p>Generating report...</p>';
    
    try {
        const querySnapshot = await getDocs(collection(db, 'matches'));
        if (querySnapshot.empty) {
            reportContent.innerHTML = '<p>No matches found</p>';
            return;
        }
        
        let html = '<h4>Recent Match Results</h4><ul>';
        querySnapshot.forEach((doc) => {
            const match = doc.data();
            html += `<li>${new Date(match.date).toLocaleDateString()}: vs ${match.opponent} - ${match.result || 'Not played'}</li>`;
        });
        html += '</ul>';
        
        reportContent.innerHTML = html;
        showModal('report-modal');
    } catch (error) {
        console.error('Error generating report:', error);
        reportContent.innerHTML = '<p>Error generating report</p>';
    }
}

function generatePDFReport() {
    const doc = new jsPDF();
    const reportContent = document.getElementById('report-content');
    
    doc.text('Peshawar Lions Match Report', 10, 10);
    doc.text(new Date().toLocaleDateString(), 160, 10);
    
    // Add content from the report modal
    const lines = reportContent.textContent.split('\n');
    let y = 20;
    
    lines.forEach(line => {
        if (line.trim()) {
            doc.text(line, 10, y);
            y += 7;
        }
    });
    
    doc.save(`peshawar-lions-report-${new Date().toISOString().slice(0, 10)}.pdf`);
    showNotification('Report downloaded successfully!');
}

// Data Export
async function exportPlayersData() {
    try {
        const querySnapshot = await getDocs(collection(db, 'players'));
        const players = querySnapshot.docs.map(doc => doc.data());
        const dataStr = JSON.stringify(players, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `peshawar-lions-players-${new Date().toISOString().slice(0, 10)}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        showNotification('Players data exported successfully!');
    } catch (error) {
        console.error('Error exporting players:', error);
        showNotification('Error exporting players data');
    }
}

async function backupDataToCloud() {
    try {
        const [players, matches, tournaments] = await Promise.all([
            getDocs(collection(db, 'players')),
            getDocs(collection(db, 'matches')),
            getDocs(collection(db, 'tournaments'))
        ]);
        
        const backupData = {
            players: players.docs.map(doc => doc.data()),
            matches: matches.docs.map(doc => doc.data()),
            tournaments: tournaments.docs.map(doc => doc.data()),
            timestamp: new Date().toISOString()
        };
        
        await setDoc(doc(collection(db, 'backups')), backupData);
        showNotification('Data backed up to cloud successfully!');
    } catch (error) {
        console.error('Error backing up data:', error);
        showNotification('Error backing up data');
    }
}

// Notifications
async function checkUpcomingMatches() {
    try {
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        const querySnapshot = await getDocs(query(
            collection(db, 'matches'), 
            where('date', '>=', now),
            where('date', '<=', nextWeek)
        );
        
        if (!querySnapshot.empty) {
            const count = querySnapshot.size;
            showNotification(`You have ${count} match${count > 1 ? 'es' : ''} coming up this week`);
        } else {
            showNotification('No upcoming matches in the next week');
        }
    } catch (error) {
        console.error('Error checking upcoming matches:', error);
    }
}

function showNotification(message) {
    // Check if browser notifications are supported and permitted
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Peshawar Lions', { body: message });
    } 
    // Fallback to in-app notification
    const note = document.createElement('div');
    note.className = 'app-notification';
    note.textContent = message;
    document.body.appendChild(note);
    
    // Remove after 5 seconds
    setTimeout(() => note.remove(), 5000);
}

// Helper functions
function updateOnlineStatus() {
    const offlineIndicator = document.getElementById('offline-indicator');
    offlineIndicator.style.display = navigator.onLine ? 'none' : 'block';
}

function switchTab(e) {
    // Remove active class from all tabs and hide all sections
    document.querySelectorAll('.nav-tabs li').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.app-section').forEach(s => s.style.display = 'none');
    
    // Add active class to clicked tab and show corresponding section
    const tab = e.currentTarget;
    tab.classList.add('active');
    document.getElementById(tab.dataset.section).style.display = 'block';
}

function handleGlobalAdd() {
    const activeSection = document.querySelector('.nav-tabs li.active').dataset.section;
    switch(activeSection) {
        case 'players': showModal('add-player-modal'); break;
        case 'matches': showModal('add-match-modal'); break;
        case 'tournaments': showModal('create-tournament-modal'); break;
        default: showNotification(`Add functionality for ${activeSection} section coming soon!`);
    }
}

function showModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

async function signInWithGoogle() {
    try {
        await signInWithPopup(auth, googleProvider);
    } catch (error) {
        console.error('Authentication error:', error);
        showNotification('Failed to sign in. Please try again.');
    }
}

async function signOutUser() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Sign out error:', error);
    }
}