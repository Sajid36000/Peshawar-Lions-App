/* ===== BASE STYLES ===== */
:root {
  --primary-color: #1a5276;       /* Team primary color */
  --secondary-color: #f39c12;     /* Team accent color */
  --accent-color: #e74c3c;        /* Highlight color */
  --light-color: #f5f5f5;         /* Light background */
  --dark-color: #333;             /* Dark text */
  --text-color: #333;             /* Main text */
  --text-light: #777;             /* Secondary text */
  --border-color: #ddd;           /* Borders */
  --success-color: #27ae60;       /* Success messages */
  --warning-color: #f39c12;       /* Warnings */
  --danger-color: #e74c3c;        /* Errors/important */
  --info-color: #3498db;          /* Information */
  --sidebar-width: 250px;         /* Navigation width */
  --header-height: 60px;          /* Header height */
  --transition-speed: 0.3s;       /* Animation speed */
}

[data-theme="dark"] {
  --light-color: #2c3e50;
  --dark-color: #ecf0f1;
  --text-color: #ecf0f1;
  --text-light: #bdc3c7;
  --border-color: #34495e;
  --primary-color: #3498db;
  --secondary-color: #f1c40f;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  background-color: var(--light-color);
  color: var(--text-color);
  transition: all var(--transition-speed) ease;
}

/* ===== LAYOUT ===== */
.app-container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: var(--sidebar-width);
  background-color: var(--primary-color);
  color: white;
  padding: 20px 0;
  height: 100vh;
  position: fixed;
  transition: width var(--transition-speed);
  overflow-y: auto;
  z-index: 100;
}

.main-content {
  margin-left: var(--sidebar-width);
  flex: 1;
  padding: 20px;
  transition: margin-left var(--transition-speed);
}

/* ===== COMPONENTS ===== */
/* Logo Container */
.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  padding: 0 15px;
}

.logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 10px;
  border-radius: 50%;
  border: 3px solid white;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

/* Cards */
.card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* Buttons */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: #154360;
}

.btn-secondary {
  background-color: var(--secondary-color);
  color: white;
}

.btn-secondary:hover {
  background-color: #e67e22;
}

/* ===== SPLASH SCREEN ===== */
#splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  overflow: hidden;
}

.logo-animation {
  width: 150px;
  height: 150px;
  animation: pulse 2s infinite, rotate 4s linear infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ===== PLAYER CARDS ===== */
.player-card {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.player-photo {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.player-card:hover .player-photo {
  transform: scale(1.05);
}

.player-details {
  padding: 15px;
  background: rgba(255, 255, 255, 0.9);
  position: relative;
  z-index: 1;
}

.player-role {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
}

/* Role-specific colors */
.role-batsman {
  background-color: #3498db;
  color: white;
}

.role-bowler {
  background-color: #e74c3c;
  color: white;
}

.role-allrounder {
  background-color: #2ecc71;
  color: white;
}

.role-keeper {
  background-color: #9b59b6;
  color: white;
}

/* ===== MATCH SCORECARD ===== */
.scorecard-header {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 15px;
  border-radius: 8px 8px 0 0;
}

.scorecard-teams {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.scorecard-innings {
  margin-top: 20px;
}

.innings-title {
  font-weight: bold;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 5px;
  margin-bottom: 10px;
}

/* ===== STATS GRAPHS ===== */
.stats-graph {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.graph-container {
  position: relative;
  height: 300px;
  width: 100%;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 992px) {
  .sidebar {
    width: 70px;
    overflow: hidden;
  }
  
  .sidebar h1, .sidebar nav li span {
    display: none;
  }
  
  .sidebar nav li {
    justify-content: center;
    padding: 15px 0;
  }
  
  .main-content {
    margin-left: 70px;
  }
}

@media (max-width: 768px) {
  .stats-overview {
    flex-direction: column;
  }
  
  .player-card {
    margin-bottom: 20px;
  }
  
  .scorecard-teams {
    flex-direction: column;
    gap: 10px;
  }
}

@media (max-width: 576px) {
  .main-content {
    padding: 15px;
  }
  
  .btn {
    padding: 8px 15px;
    font-size: 0.9rem;
  }
}

/* ===== UTILITY CLASSES ===== */
.text-center { text-align: center; }
.mt-20 { margin-top: 20px; }
.mb-20 { margin-bottom: 20px; }
.p-20 { padding: 20px; }
.d-flex { display: flex; }
.align-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-10 { gap: 10px; }

/* ===== ANIMATIONS ===== */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.fade-in {
  animation: fadeIn 0.5s ease forwards;
}

.slide-up {
  animation: slideUp 0.5s ease forwards;
}

/* ===== DARK MODE TOGGLE ===== */
.theme-toggle {
  cursor: pointer;
  padding: 10px;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* ===== FORM ELEMENTS ===== */
.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(26, 82, 118, 0.1);
}

/* ===== LOADING STATES ===== */
.loading-spinner {
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 3px solid var(--primary-color);
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
