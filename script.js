<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Peshawar Lions - Cricket Team Manager</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* Base Styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        :root {
            --primary: #D35400; /* Lion Orange */
            --primary-dark: #A04000;
            --primary-light: #E67E22;
            --secondary: #1A5276; /* Deep Blue */
            --secondary-light: #2E86C1;
            --accent: #F1C40F; /* Golden Yellow */
            --light: #FDFEFE;
            --dark: #2C3E50;
            --gray: #ECF0F1;
            --gray-dark: #7F8C8D;
            --success: #27AE60;
            --danger: #E74C3C;
            --warning: #F39C12;
            --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
            --radius: 10px;
            --transition: all 0.3s ease;
        }
        
        body {
            background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ed 100%);
            color: var(--dark);
            line-height: 1.6;
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        /* Header Styles */
        header {
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            color: white;
            padding: 1.2rem 0;
            box-shadow: var(--shadow);
            position: relative;
            overflow: hidden;
        }
        
        header::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" opacity="0.1"><path d="M30,40 Q50,20 70,40 Q85,50 70,60 Q50,80 30,60 Q15,50 30,40 Z" fill="white"/><circle cx="40" cy="45" r="3" fill="white"/><circle cx="60" cy="45" r="3" fill="white"/><path d="M45,55 Q50,60 55,55" stroke="white" stroke-width="2" fill="none"/></svg>');
            background-size: 150px;
            opacity: 0.1;
        }
        
        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            z-index: 1;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .logo-icon {
            width: 50px;
            height: 50px;
            background: var(--accent);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.2);
        }
        
        .logo-text h1 {
            font-size: 1.8rem;
            font-weight: 700;
            line-height: 1.2;
        }
        
        .logo-text span {
            color: var(--accent);
            display: block;
            font-size: 1.2rem;
            font-weight: 500;
        }
        
        .team-motto {
            text-align: right;
            font-style: italic;
            opacity: 0.9;
        }
        
        /* Navigation */
        nav {
            background: white;
            box-shadow: var(--shadow);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        
        .nav-tabs {
            display: flex;
            list-style: none;
            overflow-x: auto;
            padding: 0 10px;
        }
        
        .nav-tabs::-webkit-scrollbar {
            display: none;
        }
        
        .nav-tabs li {
            flex: 1;
            min-width: 140px;
            text-align: center;
        }
        
        .nav-tabs a {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 15px 10px;
            text-decoration: none;
            color: var(--dark);
            font-weight: 500;
            border-bottom: 3px solid transparent;
            transition: var(--transition);
            gap: 5px;
        }
        
        .nav-tabs a i {
            font-size: 1.2rem;
            margin-bottom: 5px;
        }
        
        .nav-tabs a:hover, .nav-tabs a.active {
            color: var(--primary);
            border-bottom: 3px solid var(--primary);
        }
        
        .nav-tabs a.active {
            background-color: rgba(211, 84, 0, 0.05);
        }
        
        /* Main Content */
        .tab-content {
            display: none;
            padding: 25px 0;
            animation: fadeIn 0.5s;
        }
        
        .tab-content.active {
            display: block;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .section-title {
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 2px solid var(--gray);
            color: var(--secondary);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .section-title h2 {
            font-size: 1.8rem;
            font-weight: 700;
            position: relative;
            padding-left: 15px;
        }
        
        .section-title h2::before {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 5px;
            background: var(--primary);
            border-radius: 5px;
        }
        
        /* Cards */
        .card {
            background: white;
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            padding: 25px;
            margin-bottom: 25px;
            transition: var(--transition);
            border-left: 4px solid var(--primary);
        }
        
        .card:hover {
            box-shadow: var(--shadow-lg);
            transform: translateY(-5px);
        }
        
        .card h3 {
            color: var(--secondary);
            margin-bottom: 15px;
            font-size: 1.4rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .card h3 i {
            color: var(--primary);
        }
        
        /* Buttons */
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background-color: var(--primary);
            color: white;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            font-weight: 600;
            transition: var(--transition);
            text-decoration: none;
            box-shadow: 0 4px 6px rgba(211, 84, 0, 0.2);
        }
        
        .btn:hover {
            background-color: var(--primary-dark);
            transform: translateY(-3px);
            box-shadow: 0 6px 8px rgba(211, 84, 0, 0.3);
        }
        
        .btn:active {
            transform: translateY(-1px);
        }
        
        .btn-secondary {
            background-color: var(--secondary);
            box-shadow: 0 4px 6px rgba(26, 82, 118, 0.2);
        }
        
        .btn-secondary:hover {
            background-color: var(--secondary-light);
            box-shadow: 0 6px 8px rgba(26, 82, 118, 0.3);
        }
        
        .btn-accent {
            background-color: var(--accent);
            color: var(--dark);
            box-shadow: 0 4px 6px rgba(241, 196, 15, 0.3);
        }
        
        .btn-accent:hover {
            background-color: #F7DC6F;
            box-shadow: 0 6px 8px rgba(241, 196, 15, 0.4);
        }
        
        .btn-danger {
            background-color: var(--danger);
            box-shadow: 0 4px 6px rgba(231, 76, 60, 0.2);
        }
        
        .btn-danger:hover {
            background-color: #C0392B;
            box-shadow: 0 6px 8px rgba(231, 76, 60, 0.3);
        }
        
        .btn-small {
            padding: 8px 16px;
            font-size: 0.85rem;
        }
        
        .btn-outline {
            background: transparent;
            border: 2px solid var(--primary);
            color: var(--primary);
            box-shadow: none;
        }
        
        .btn-outline:hover {
            background: var(--primary);
            color: white;
        }
        
        /* Forms */
        .form-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--secondary);
        }
        
        input, select, textarea {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid var(--gray);
            border-radius: 8px;
            font-size: 1rem;
            transition: var(--transition);
        }
        
        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(211, 84, 0, 0.1);
        }
        
        textarea {
            min-height: 120px;
            resize: vertical;
        }
        
        .form-actions {
            display: flex;
            gap: 15px;
            margin-top: 25px;
        }
        
        /* Tables */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            border-radius: var(--radius);
            overflow: hidden;
            box-shadow: var(--shadow);
        }
        
        th, td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid var(--gray);
        }
        
        th {
            background: linear-gradient(to right, var(--secondary), var(--secondary-light));
            color: white;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.9rem;
            letter-spacing: 0.5px;
        }
        
        tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        
        tr:hover {
            background-color: #e8f4fc;
        }
        
        .success {
            color: var(--success);
            font-weight: 600;
        }
        
        .danger {
            color: var(--danger);
            font-weight: 600;
        }
        
        /* Stats Cards */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 25px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: white;
            border-radius: var(--radius);
            padding: 25px;
            box-shadow: var(--shadow);
            text-align: center;
            transition: var(--transition);
            position: relative;
            overflow: hidden;
        }
        
        .stat-card::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 5px;
            background: linear-gradient(to right, var(--primary), var(--accent));
        }
        
        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow-lg);
        }
        
        .stat-icon {
            width: 60px;
            height: 60px;
            background: rgba(211, 84, 0, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 15px;
            font-size: 1.5rem;
            color: var(--primary);
        }
        
        .stat-value {
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--primary);
            margin: 10px 0;
            line-height: 1;
        }
        
        .stat-label {
            color: var(--gray-dark);
            font-size: 1rem;
            font-weight: 500;
        }
        
        .stat-desc {
            color: var(--gray-dark);
            font-size: 0.9rem;
            margin-top: 5px;
        }
        
        /* Player Cards */
        .players-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 25px;
        }
        
        .player-card {
            background: white;
            border-radius: var(--radius);
            overflow: hidden;
            box-shadow: var(--shadow);
            transition: var(--transition);
            position: relative;
        }
        
        .player-card:hover {
            transform: translateY(-10px);
            box-shadow: var(--shadow-lg);
        }
        
        .player-header {
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            color: white;
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 15px;
            position: relative;
            overflow: hidden;
        }
        
        .player-header::after {
            content: "";
            position: absolute;
            top: -50%;
            right: -50%;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.1);
            transform: rotate(30deg);
        }
        
        .player-avatar {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background: var(--accent);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            font-weight: bold;
            color: var(--dark);
            box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.2);
            position: relative;
            z-index: 1;
        }
        
        .player-info {
            flex: 1;
            position: relative;
            z-index: 1;
        }
        
        .player-name {
            font-size: 1.3rem;
            font-weight: 700;
            margin-bottom: 5px;
        }
        
        .player-role {
            font-size: 0.95rem;
            opacity: 0.9;
            display: inline-block;
            padding: 3px 10px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 20px;
        }
        
        .player-stats {
            padding: 20px;
        }
        
        .stat-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            padding-bottom: 12px;
            border-bottom: 1px solid var(--gray);
        }
        
        .stat-row:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }
        
        .player-actions {
            padding: 0 20px 20px;
            display: flex;
            gap: 10px;
        }
        
        /* Modal */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            z-index: 1000;
            align-items: center;
            justify-content: center;
            padding: 20px;
            animation: fadeIn 0.3s;
        }
        
        .modal-content {
            background: white;
            border-radius: var(--radius);
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            position: relative;
            animation: slideUp 0.4s;
        }
        
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 2px solid var(--gray);
        }
        
        .modal-header h3 {
            color: var(--secondary);
            font-size: 1.5rem;
            margin: 0;
        }
        
        .close-modal {
            background: none;
            border: none;
            font-size: 1.8rem;
            cursor: pointer;
            color: var(--gray-dark);
            transition: var(--transition);
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
        }
        
        .close-modal:hover {
            background: var(--gray);
            color: var(--danger);
        }
        
        /* Achievement Items */
        .achievement-item {
            padding: 20px;
            border-radius: var(--radius);
            background: white;
            box-shadow: var(--shadow);
            margin-bottom: 15px;
            transition: var(--transition);
            border-left: 4px solid var(--accent);
        }
        
        .achievement-item:hover {
            transform: translateX(5px);
            box-shadow: var(--shadow-lg);
        }
        
        .achievement-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 10px;
        }
        
        .achievement-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: var(--secondary);
            margin: 0;
        }
        
        .achievement-type {
            display: inline-block;
            padding: 4px 12px;
            background: var(--accent);
            color: var(--dark);
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
        }
        
        .achievement-date {
            color: var(--gray-dark);
            font-size: 0.9rem;
            margin-top: 5px;
        }
        
        /* Empty States */
        .empty-state {
            text-align: center;
            padding: 40px 20px;
            color: var(--gray-dark);
        }
        
        .empty-state i {
            font-size: 3rem;
            margin-bottom: 15px;
            color: var(--gray);
        }
        
        .empty-state h3 {
            font-size: 1.5rem;
            margin-bottom: 10px;
            color: var(--gray-dark);
        }
        
        /* Responsive */
        @media (max-width: 992px) {
            .header-content {
                flex-direction: column;
                text-align: center;
                gap: 15px;
            }
            
            .team-motto {
                text-align: center;
            }
            
            .stats-grid {
                grid-template-columns: 1fr 1fr;
            }
        }
        
        @media (max-width: 768px) {
            .nav-tabs {
                flex-wrap: wrap;
            }
            
            .nav-tabs li {
                flex: 0 0 50%;
            }
            
            .stats-grid {
                grid-template-columns: 1fr;
            }
            
            .players-grid {
                grid-template-columns: 1fr;
            }
            
            .form-actions {
                flex-direction: column;
            }
        }
        
        @media (max-width: 576px) {
            .container {
                padding: 0 15px;
            }
            
            .card {
                padding: 20px;
            }
            
            .modal-content {
                padding: 20px;
            }
            
            .nav-tabs li {
                flex: 0 0 100%;
            }
            
            .player-header {
                flex-direction: column;
                text-align: center;
            }
            
            .player-actions {
                flex-direction: column;
            }
        }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }
        
        ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
            background: var(--primary);
            border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: var(--primary-dark);
        }
        
        /* Toast Notifications */
        .toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--success);
            color: white;
            padding: 15px 25px;
            border-radius: var(--radius);
            box-shadow: var(--shadow-lg);
            z-index: 1001;
            display: flex;
            align-items: center;
            gap: 10px;
            transform: translateY(100px);
            opacity: 0;
            transition: var(--transition);
        }
        
        .toast.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .toast.error {
            background: var(--danger);
        }
        
        .toast.warning {
            background: var(--warning);
        }
    </style>
</head>
<body>
    <!-- Toast Notification -->
    <div id="toast" class="toast">
        <i class="fas fa-check-circle"></i>
        <span id="toast-message">Operation completed successfully!</span>
    </div>

    <!-- Header -->
    <header>
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <div class="logo-icon">
                        <i class="fas fa-lion"></i>
                    </div>
                    <div class="logo-text">
                        <h1>PESHAWAR LIONS</h1>
                        <span>Cricket Club</span>
                    </div>
                </div>
                <div class="team-motto">
                    <p>"Strength, Pride, Victory"</p>
                </div>
            </div>
        </div>
    </header>

    <!-- Navigation -->
    <nav>
        <div class="container">
            <ul class="nav-tabs">
                <li><a href="#dashboard" class="active"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
                <li><a href="#players"><i class="fas fa-users"></i> Players</a></li>
                <li><a href="#matches"><i class="fas fa-baseball-ball"></i> Matches</a></li>
                <li><a href="#stats"><i class="fas fa-chart-bar"></i> Statistics</a></li>
                <li><a href="#achievements"><i class="fas fa-trophy"></i> Achievements</a></li>
            </ul>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="container">
        <!-- Dashboard Tab -->
        <div id="dashboard" class="tab-content active">
            <div class="section-title">
                <h2>Team Dashboard</h2>
                <div>
                    <button class="btn btn-accent" id="quick-add-btn">
                        <i class="fas fa-plus"></i> Quick Add
                    </button>
                    <button class="btn btn-outline" id="export-data-btn">
                        <i class="fas fa-download"></i> Export Data
                    </button>
                </div>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-value" id="total-players">0</div>
                    <div class="stat-label">Total Players</div>
                    <div class="stat-desc">Active squad members</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-baseball-ball"></i>
                    </div>
                    <div class="stat-value" id="total-matches">0</div>
                    <div class="stat-label">Matches Played</div>
                    <div class="stat-desc">All formats</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-trophy"></i>
                    </div>
                    <div class="stat-value" id="win-percentage">0%</div>
                    <div class="stat-label">Win Percentage</div>
                    <div class="stat-desc">Overall record</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-medal"></i>
                    </div>
                    <div class="stat-value" id="tournaments-won">0</div>
                    <div class="stat-label">Tournaments Won</div>
                    <div class="stat-desc">Team achievements</div>
                </div>
            </div>
            
            <div class="card">
                <h3><i class="fas fa-history"></i> Recent Activity</h3>
                <div id="recent-activity">
                    <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <h3>No Recent Activity</h3>
                        <p>Start by adding players and matches to see activity here.</p>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h3><i class="fas fa-calendar-alt"></i> Upcoming Matches</h3>
                <div id="upcoming-matches">
                    <div class="empty-state">
                        <i class="fas fa-baseball-ball"></i>
                        <h3>No Upcoming Matches</h3>
                        <p>Add matches to see them listed here.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Players Tab -->
        <div id="players" class="tab-content">
            <div class="section-title">
                <h2>Player Roster</h2>
                <button class="btn" id="add-player-btn">
                    <i class="fas fa-user-plus"></i> Add New Player
                </button>
            </div>
            
            <div class="players-grid" id="players-container">
                <!-- Player cards will be dynamically added here -->
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>No Players Added Yet</h3>
                    <p>Click "Add New Player" to build your team roster.</p>
                </div>
            </div>
        </div>

        <!-- Matches Tab -->
        <div id="matches" class="tab-content">
            <div class="section-title">
                <h2>Match History</h2>
                <button class="btn" id="add-match-btn">
                    <i class="fas fa-plus-circle"></i> Add New Match
                </button>
            </div>
            
            <div class="card">
                <h3><i class="fas fa-list"></i> Match Records</h3>
                <table id="matches-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Opponent</th>
                            <th>Venue</th>
                            <th>Result</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Match rows will be dynamically added here -->
                        <tr>
                            <td colspan="5" style="text-align: center;">
                                <div class="empty-state" style="padding: 20px;">
                                    <i class="fas fa-baseball-ball"></i>
                                    <p>No matches recorded yet.</p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Statistics Tab -->
        <div id="stats" class="tab-content">
            <div class="section-title">
                <h2>Team Statistics</h2>
                <button class="btn btn-outline" id="refresh-stats-btn">
                    <i class="fas fa-sync-alt"></i> Refresh Stats
                </button>
            </div>
            
            <div class="card">
                <h3><i class="fas fa-bat"></i> Batting Leaders</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th>Matches</th>
                            <th>Runs</th>
                            <th>Average</th>
                            <th>Strike Rate</th>
                        </tr>
                    </thead>
                    <tbody id="batting-leaders">
                        <tr>
                            <td colspan="5" style="text-align: center;">
                                <div class="empty-state" style="padding: 10px;">
                                    <p>No batting data available.</p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="card">
                <h3><i class="fas fa-baseball-ball"></i> Bowling Leaders</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th>Matches</th>
                            <th>Wickets</th>
                            <th>Average</th>
                            <th>Economy</th>
                        </tr>
                    </thead>
                    <tbody id="bowling-leaders">
                        <tr>
                            <td colspan="5" style="text-align: center;">
                                <div class="empty-state" style="padding: 10px;">
                                    <p>No bowling data available.</p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Achievements Tab -->
        <div id="achievements" class="tab-content">
            <div class="section-title">
                <h2>Team Achievements</h2>
                <button class="btn" id="add-achievement-btn">
                    <i class="fas fa-trophy"></i> Add Achievement
                </button>
            </div>
            
            <div class="card">
                <h3><i class="fas fa-award"></i> Honors & Awards</h3>
                <div id="achievements-container">
                    <div class="empty-state">
                        <i class="fas fa-trophy"></i>
                        <h3>No Achievements Yet</h3>
                        <p>Click "Add Achievement" to record your team's successes!</p>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Add Player Modal -->
    <div id="player-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="player-modal-title">Add New Player</h3>
                <button class="close-modal">&times;</button>
            </div>
            <form id="player-form">
                <input type="hidden" id="player-id">
                <div class="form-group">
                    <label for="player-name">Full Name</label>
                    <input type="text" id="player-name" required placeholder="Enter player's full name">
                </div>
                <div class="form-group">
                    <label for="player-role">Role</label>
                    <select id="player-role" required>
                        <option value="">Select Role</option>
                        <option value="Batsman">Batsman</option>
                        <option value="Bowler">Bowler</option>
                        <option value="All-rounder">All-rounder</option>
                        <option value="Wicket-keeper">Wicket-keeper</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="player-batting">Batting Style</label>
                    <select id="player-batting">
                        <option value="">Select Style</option>
                        <option value="Right-handed">Right-handed</option>
                        <option value="Left-handed">Left-handed</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="player-bowling">Bowling Style</label>
                    <select id="player-bowling">
                        <option value="">Select Style</option>
                        <option value="Right-arm fast">Right-arm fast</option>
                        <option value="Left-arm fast">Left-arm fast</option>
                        <option value="Right-arm medium">Right-arm medium</option>
                        <option value="Left-arm medium">Left-arm medium</option>
                        <option value="Off-spin">Off-spin</option>
                        <option value="Leg-spin">Leg-spin</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="player-matches">Matches Played</label>
                    <input type="number" id="player-matches" min="0" value="0">
                </div>
                <div class="form-group">
                    <label for="player-runs">Runs Scored</label>
                    <input type="number" id="player-runs" min="0" value="0">
                </div>
                <div class="form-group">
                    <label for="player-wickets">Wickets Taken</label>
                    <input type="number" id="player-wickets" min="0" value="0">
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn"><i class="fas fa-save"></i> Save Player</button>
                    <button type="button" class="btn btn-danger" id="delete-player-btn" style="display: none;">
                        <i class="fas fa-trash"></i> Delete Player
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Add Match Modal -->
    <div id="match-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="match-modal-title">Add New Match</h3>
                <button class="close-modal">&times;</button>
            </div>
            <form id="match-form">
                <input type="hidden" id="match-id">
                <div class="form-group">
                    <label for="match-date">Date</label>
                    <input type="date" id="match-date" required>
                </div>
                <div class="form-group">
                    <label for="match-opponent">Opponent</label>
                    <input type="text" id="match-opponent" required placeholder="Enter opponent team name">
                </div>
                <div class="form-group">
                    <label for="match-venue">Venue</label>
                    <input type="text" id="match-venue" required placeholder="Enter match venue">
                </div>
                <div class="form-group">
                    <label for="match-result">Result</label>
                    <select id="match-result" required>
                        <option value="">Select Result</option>
                        <option value="Won">Won</option>
                        <option value="Lost">Lost</option>
                        <option value="Tied">Tied</option>
                        <option value="No Result">No Result</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="match-notes">Match Notes (Optional)</label>
                    <textarea id="match-notes" placeholder="Add any additional match details"></textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn"><i class="fas fa-save"></i> Save Match</button>
                    <button type="button" class="btn btn-danger" id="delete-match-btn" style="display: none;">
                        <i class="fas fa-trash"></i> Delete Match
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Add Achievement Modal -->
    <div id="achievement-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="achievement-modal-title">Add Achievement</h3>
                <button class="close-modal">&times;</button>
            </div>
            <form id="achievement-form">
                <input type="hidden" id="achievement-id">
                <div class="form-group">
                    <label for="achievement-title">Title</label>
                    <input type="text" id="achievement-title" required placeholder="Enter achievement title">
                </div>
                <div class="form-group">
                    <label for="achievement-description">Description</label>
                    <textarea id="achievement-description" placeholder="Describe the achievement"></textarea>
                </div>
                <div class="form-group">
                    <label for="achievement-date">Date</label>
                    <input type="date" id="achievement-date">
                </div>
                <div class="form-group">
                    <label for="achievement-type">Type</label>
                    <select id="achievement-type">
                        <option value="Tournament Win">Tournament Win</option>
                        <option value="Individual Award">Individual Award</option>
                        <option value="Record">Record</option>
                        <option value="Milestone">Milestone</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn"><i class="fas fa-save"></i> Save Achievement</button>
                    <button type="button" class="btn btn-danger" id="delete-achievement-btn" style="display: none;">
                        <i class="fas fa-trash"></i> Delete Achievement
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Quick Add Modal -->
    <div id="quick-add-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Quick Add</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <button class="btn btn-outline" id="quick-add-player">
                    <i class="fas fa-user-plus"></i> Add Player
                </button>
                <button class="btn btn-outline" id="quick-add-match">
                    <i class="fas fa-baseball-ball"></i> Add Match
                </button>
                <button class="btn btn-outline" id="quick-add-achievement">
                    <i class="fas fa-trophy"></i> Add Achievement
                </button>
                <button class="btn btn-outline" id="import-sample-data">
                    <i class="fas fa-database"></i> Load Sample Data
                </button>
            </div>
        </div>
    </div>

    <script>
        // Data storage (using localStorage for persistence)
        let players = [];
        let matches = [];
        let achievements = [];
        let editingPlayerId = null;
        let editingMatchId = null;
        let editingAchievementId = null;

        // DOM Elements
        const navTabs = document.querySelectorAll('.nav-tabs a');
        const tabContents = document.querySelectorAll('.tab-content');
        
        // Modal Elements
        const playerModal = document.getElementById('player-modal');
        const matchModal = document.getElementById('match-modal');
        const achievementModal = document.getElementById('achievement-modal');
        const quickAddModal = document.getElementById('quick-add-modal');
        const closeModalButtons = document.querySelectorAll('.close-modal');
        
        // Form Elements
        const playerForm = document.getElementById('player-form');
        const matchForm = document.getElementById('match-form');
        const achievementForm = document.getElementById('achievement-form');
        
        // Button Elements
        const addPlayerBtn = document.getElementById('add-player-btn');
        const addMatchBtn = document.getElementById('add-match-btn');
        const addAchievementBtn = document.getElementById('add-achievement-btn');
        const quickAddBtn = document.getElementById('quick-add-btn');
        const exportDataBtn = document.getElementById('export-data-btn');
        const refreshStatsBtn = document.getElementById('refresh-stats-btn');
        const deletePlayerBtn = document.getElementById('delete-player-btn');
        const deleteMatchBtn = document.getElementById('delete-match-btn');
        const deleteAchievementBtn = document.getElementById('delete-achievement-btn');
        
        // Quick Add Buttons
        const quickAddPlayerBtn = document.getElementById('quick-add-player');
        const quickAddMatchBtn = document.getElementById('quick-add-match');
        const quickAddAchievementBtn = document.getElementById('quick-add-achievement');
        const importSampleDataBtn = document.getElementById('import-sample-data');
        
        // Toast Element
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');

        // Initialize the app
        document.addEventListener('DOMContentLoaded', function() {
            // Load any saved data from localStorage
            loadData();
            
            // Set up event listeners
            setupEventListeners();
            
            // Render initial data
            renderPlayers();
            renderMatches();
            renderAchievements();
            updateDashboard();
            updateStatistics();
            
            // Show welcome message
            showToast('Welcome to Peshawar Lions Team Manager!', 'success');
        });

        // Set up all event listeners
        function setupEventListeners() {
            // Navigation
            navTabs.forEach(tab => {
                tab.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href').substring(1);
                    
                    // Update active tab
                    navTabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Show target content
                    tabContents.forEach(content => {
                        content.classList.remove('active');
                        if (content.id === targetId) {
                            content.classList.add('active');
                        }
                    });
                });
            });
            
            // Modal open buttons
            addPlayerBtn.addEventListener('click', () => openPlayerModal());
            addMatchBtn.addEventListener('click', () => openMatchModal());
            addAchievementBtn.addEventListener('click', () => openAchievementModal());
            quickAddBtn.addEventListener('click', () => openQuickAddModal());
            
            // Quick add buttons
            quickAddPlayerBtn.addEventListener('click', () => {
                quickAddModal.style.display = 'none';
                openPlayerModal();
            });
            
            quickAddMatchBtn.addEventListener('click', () => {
                quickAddModal.style.display = 'none';
                openMatchModal();
            });
            
            quickAddAchievementBtn.addEventListener('click', () => {
                quickAddModal.style.display = 'none';
                openAchievementModal();
            });
            
            importSampleDataBtn.addEventListener('click', importSampleData);
            
            // Modal close buttons
            closeModalButtons.forEach(button => {
                button.addEventListener('click', function() {
                    playerModal.style.display = 'none';
                    matchModal.style.display = 'none';
                    achievementModal.style.display = 'none';
                    quickAddModal.style.display = 'none';
                    resetForms();
                });
            });
            
            // Form submissions
            playerForm.addEventListener('submit', handlePlayerSubmit);
            matchForm.addEventListener('submit', handleMatchSubmit);
            achievementForm.addEventListener('submit', handleAchievementSubmit);
            
            // Delete buttons
            deletePlayerBtn.addEventListener('click', deletePlayer);
            deleteMatchBtn.addEventListener('click', deleteMatch);
            deleteAchievementBtn.addEventListener('click', deleteAchievement);
            
            // Utility buttons
            exportDataBtn.addEventListener('click', exportData);
            refreshStatsBtn.addEventListener('click', updateStatistics);
            
            // Close modals when clicking outside
            window.addEventListener('click', function(e) {
                if (e.target === playerModal) playerModal.style.display = 'none';
                if (e.target === matchModal) matchModal.style.display = 'none';
                if (e.target === achievementModal) achievementModal.style.display = 'none';
                if (e.target === quickAddModal) quickAddModal.style.display = 'none';
            });
        }

        // Player functions
        function openPlayerModal(playerId = null) {
            editingPlayerId = playerId;
            const modalTitle = document.getElementById('player-modal-title');
            
            if (playerId) {
                // Editing existing player
                modalTitle.textContent = 'Edit Player';
                deletePlayerBtn.style.display = 'inline-block';
                
                const player = players.find(p => p.id === playerId);
                if (player) {
                    document.getElementById('player-id').value = player.id;
                    document.getElementById('player-name').value = player.name;
                    document.getElementById('player-role').value = player.role;
                    document.getElementById('player-batting').value = player.battingStyle || '';
                    document.getElementById('player-bowling').value = player.bowlingStyle || '';
                    document.getElementById('player-matches').value = player.matches || 0;
                    document.getElementById('player-runs').value = player.runs || 0;
                    document.getElementById('player-wickets').value = player.wickets || 0;
                }
            } else {
                // Adding new player
                modalTitle.textContent = 'Add New Player';
                deletePlayerBtn.style.display = 'none';
                playerForm.reset();
            }
            
            playerModal.style.display = 'flex';
        }

        function handlePlayerSubmit(e) {
            e.preventDefault();
            
            const playerData = {
                id: editingPlayerId || 'player_' + Date.now(),
                name: document.getElementById('player-name').value,
                role: document.getElementById('player-role').value,
                battingStyle: document.getElementById('player-batting').value,
                bowlingStyle: document.getElementById('player-bowling').value,
                matches: parseInt(document.getElementById('player-matches').value) || 0,
                runs: parseInt(document.getElementById('player-runs').value) || 0,
                wickets: parseInt(document.getElementById('player-wickets').value) || 0,
                createdAt: editingPlayerId ? 
                    (players.find(p => p.id === editingPlayerId)?.createdAt || new Date().toISOString()) : 
                    new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            if (editingPlayerId) {
                // Update existing player
                const index = players.findIndex(p => p.id === editingPlayerId);
                if (index !== -1) {
                    players[index] = playerData;
                    showToast('Player updated successfully!', 'success');
                }
            } else {
                // Add new player
                players.push(playerData);
                showToast('Player added successfully!', 'success');
            }
            
            saveData();
            renderPlayers();
            updateDashboard();
            updateStatistics();
            playerModal.style.display = 'none';
            resetForms();
        }

        function deletePlayer() {
            if (editingPlayerId && confirm('Are you sure you want to delete this player?')) {
                players = players.filter(p => p.id !== editingPlayerId);
                saveData();
                renderPlayers();
                updateDashboard();
                updateStatistics();
                playerModal.style.display = 'none';
                resetForms();
                showToast('Player deleted successfully!', 'success');
            }
        }

        function renderPlayers() {
            const container = document.getElementById('players-container');
            
            if (players.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-users"></i>
                        <h3>No Players Added Yet</h3>
                        <p>Click "Add New Player" to build your team roster.</p>
                    </div>
                `;
                return;
            }
            
            container.innerHTML = '';
            
            // Sort players by name
            const sortedPlayers = [...players].sort((a, b) => a.name.localeCompare(b.name));
            
            sortedPlayers.forEach(player => {
                const playerCard = document.createElement('div');
                playerCard.className = 'player-card';
                
                // Calculate batting average and strike rate
                const battingAvg = player.matches > 0 ? (player.runs / player.matches).toFixed(2) : '0.00';
                const strikeRate = player.matches > 0 ? ((player.runs / player.matches) * 100).toFixed(2) : '0.00';
                
                playerCard.innerHTML = `
                    <div class="player-header">
                        <div class="player-avatar">${player.name.charAt(0)}</div>
                        <div class="player-info">
                            <div class="player-name">${player.name}</div>
                            <div class="player-role">${player.role}</div>
                        </div>
                    </div>
                    <div class="player-stats">
                        <div class="stat-row">
                            <span>Matches</span>
                            <span>${player.matches}</span>
                        </div>
                        <div class="stat-row">
                            <span>Runs</span>
                            <span>${player.runs}</span>
                        </div>
                        <div class="stat-row">
                            <span>Wickets</span>
                            <span>${player.wickets}</span>
                        </div>
                        <div class="stat-row">
                            <span>Batting Avg</span>
                            <span>${battingAvg}</span>
                        </div>
                        ${player.battingStyle ? `<div class="stat-row">
                            <span>Batting Style</span>
                            <span>${player.battingStyle}</span>
                        </div>` : ''}
                        ${player.bowlingStyle ? `<div class="stat-row">
                            <span>Bowling Style</span>
                            <span>${player.bowlingStyle}</span>
                        </div>` : ''}
                    </div>
                    <div class="player-actions">
                        <button class="btn btn-small edit-player" data-id="${player.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                    </div>
                `;
                
                container.appendChild(playerCard);
            });
            
            // Add event listeners to edit buttons
            document.querySelectorAll('.edit-player').forEach(button => {
                button.addEventListener('click', function() {
                    const playerId = this.getAttribute('data-id');
                    openPlayerModal(playerId);
                });
            });
        }

        // Match functions
        function openMatchModal(matchId = null) {
            editingMatchId = matchId;
            const modalTitle = document.getElementById('match-modal-title');
            
            if (matchId) {
                // Editing existing match
                modalTitle.textContent = 'Edit Match';
                deleteMatchBtn.style.display = 'inline-block';
                
                const match = matches.find(m => m.id === matchId);
                if (match) {
                    document.getElementById('match-id').value = match.id;
                    document.getElementById('match-date').value = match.date;
                    document.getElementById('match-opponent').value = match.opponent;
                    document.getElementById('match-venue').value = match.venue;
                    document.getElementById('match-result').value = match.result;
                    document.getElementById('match-notes').value = match.notes || '';
                }
            } else {
                // Adding new match
                modalTitle.textContent = 'Add New Match';
                deleteMatchBtn.style.display = 'none';
                matchForm.reset();
                document.getElementById('match-date').valueAsDate = new Date();
            }
            
            matchModal.style.display = 'flex';
        }

        function handleMatchSubmit(e) {
            e.preventDefault();
            
            const matchData = {
                id: editingMatchId || 'match_' + Date.now(),
                date: document.getElementById('match-date').value,
                opponent: document.getElementById('match-opponent').value,
                venue: document.getElementById('match-venue').value,
                result: document.getElementById('match-result').value,
                notes: document.getElementById('match-notes').value,
                createdAt: editingMatchId ? 
                    (matches.find(m => m.id === editingMatchId)?.createdAt || new Date().toISOString()) : 
                    new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            if (editingMatchId) {
                // Update existing match
                const index = matches.findIndex(m => m.id === editingMatchId);
                if (index !== -1) {
                    matches[index] = matchData;
                    showToast('Match updated successfully!', 'success');
                }
            } else {
                // Add new match
                matches.push(matchData);
                showToast('Match added successfully!', 'success');
            }
            
            saveData();
            renderMatches();
            updateDashboard();
            matchModal.style.display = 'none';
            resetForms();
        }

        function deleteMatch() {
            if (editingMatchId && confirm('Are you sure you want to delete this match?')) {
                matches = matches.filter(m => m.id !== editingMatchId);
                saveData();
                renderMatches();
                updateDashboard();
                matchModal.style.display = 'none';
                resetForms();
                showToast('Match deleted successfully!', 'success');
            }
        }

        function renderMatches() {
            const tableBody = document.querySelector('#matches-table tbody');
            
            if (matches.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="5" style="text-align: center;">
                            <div class="empty-state" style="padding: 20px;">
                                <i class="fas fa-baseball-ball"></i>
                                <p>No matches recorded yet.</p>
                            </div>
                        </td>
                    </tr>
                `;
                return;
            }
            
            tableBody.innerHTML = '';
            
            // Sort matches by date (newest first)
            const sortedMatches = [...matches].sort((a, b) => new Date(b.date) - new Date(a.date));
            
            sortedMatches.forEach(match => {
                const row = document.createElement('tr');
                
                // Format date
                const dateObj = new Date(match.date);
                const formattedDate = dateObj.toLocaleDateString();
                
                // Set result class for styling
                let resultClass = '';
                if (match.result === 'Won') resultClass = 'success';
                if (match.result === 'Lost') resultClass = 'danger';
                
                row.innerHTML = `
                    <td>${formattedDate}</td>
                    <td>${match.opponent}</td>
                    <td>${match.venue}</td>
                    <td class="${resultClass}">${match.result}</td>
                    <td>
                        <button class="btn btn-small edit-match" data-id="${match.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                    </td>
                `;
                
                tableBody.appendChild(row);
            });
            
            // Add event listeners to edit buttons
            document.querySelectorAll('.edit-match').forEach(button => {
                button.addEventListener('click', function() {
                    const matchId = this.getAttribute('data-id');
                    openMatchModal(matchId);
                });
            });
        }

        // Achievement functions
        function openAchievementModal(achievementId = null) {
            editingAchievementId = achievementId;
            const modalTitle = document.getElementById('achievement-modal-title');
            
            if (achievementId) {
                // Editing existing achievement
                modalTitle.textContent = 'Edit Achievement';
                deleteAchievementBtn.style.display = 'inline-block';
                
                const achievement = achievements.find(a => a.id === achievementId);
                if (achievement) {
                    document.getElementById('achievement-id').value = achievement.id;
                    document.getElementById('achievement-title').value = achievement.title;
                    document.getElementById('achievement-description').value = achievement.description;
                    document.getElementById('achievement-date').value = achievement.date;
                    document.getElementById('achievement-type').value = achievement.type;
                }
            } else {
                // Adding new achievement
                modalTitle.textContent = 'Add Achievement';
                deleteAchievementBtn.style.display = 'none';
                achievementForm.reset();
                document.getElementById('achievement-date').valueAsDate = new Date();
            }
            
            achievementModal.style.display = 'flex';
        }

        function handleAchievementSubmit(e) {
            e.preventDefault();
            
            const achievementData = {
                id: editingAchievementId || 'achievement_' + Date.now(),
                title: document.getElementById('achievement-title').value,
                description: document.getElementById('achievement-description').value,
                date: document.getElementById('achievement-date').value,
                type: document.getElementById('achievement-type').value,
                createdAt: editingAchievementId ? 
                    (achievements.find(a => a.id === editingAchievementId)?.createdAt || new Date().toISOString()) : 
                    new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            if (editingAchievementId) {
                // Update existing achievement
                const index = achievements.findIndex(a => a.id === editingAchievementId);
                if (index !== -1) {
                    achievements[index] = achievementData;
                    showToast('Achievement updated successfully!', 'success');
                }
            } else {
                // Add new achievement
                achievements.push(achievementData);
                showToast('Achievement added successfully!', 'success');
            }
            
            saveData();
            renderAchievements();
            updateDashboard();
            achievementModal.style.display = 'none';
            resetForms();
        }

        function deleteAchievement() {
            if (editingAchievementId && confirm('Are you sure you want to delete this achievement?')) {
                achievements = achievements.filter(a => a.id !== editingAchievementId);
                saveData();
                renderAchievements();
                updateDashboard();
                achievementModal.style.display = 'none';
                resetForms();
                showToast('Achievement deleted successfully!', 'success');
            }
        }

        function renderAchievements() {
            const container = document.getElementById('achievements-container');
            
            if (achievements.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-trophy"></i>
                        <h3>No Achievements Yet</h3>
                        <p>Click "Add Achievement" to record your team's successes!</p>
                    </div>
                `;
                return;
            }
            
            container.innerHTML = '';
            
            // Sort achievements by date (newest first)
            const sortedAchievements = [...achievements].sort((a, b) => new Date(b.date) - new Date(a.date));
            
            sortedAchievements.forEach(achievement => {
                const achievementEl = document.createElement('div');
                achievementEl.className = 'achievement-item';
                
                // Format date
                const dateObj = new Date(achievement.date);
                const formattedDate = dateObj.toLocaleDateString();
                
                achievementEl.innerHTML = `
                    <div class="achievement-header">
                        <h4 class="achievement-title">${achievement.title}</h4>
                        <span class="achievement-type">${achievement.type}</span>
                    </div>
                    <p>${achievement.description}</p>
                    <div class="achievement-date">${formattedDate}</div>
                    <div style="margin-top: 15px; text-align: right;">
                        <button class="btn btn-small edit-achievement" data-id="${achievement.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                    </div>
                `;
                
                container.appendChild(achievementEl);
            });
            
            // Add event listeners to edit buttons
            document.querySelectorAll('.edit-achievement').forEach(button => {
                button.addEventListener('click', function() {
                    const achievementId = this.getAttribute('data-id');
                    openAchievementModal(achievementId);
                });
            });
        }

        // Dashboard functions
        function updateDashboard() {
            // Update total players
            document.getElementById('total-players').textContent = players.length;
            
            // Update total matches
            document.getElementById('total-matches').textContent = matches.length;
            
            // Update win percentage
            const wins = matches.filter(m => m.result === 'Won').length;
            const winPercentage = matches.length > 0 ? Math.round((wins / matches.length) * 100) : 0;
            document.getElementById('win-percentage').textContent = `${winPercentage}%`;
            
            // Update tournaments won
            const tournamentWins = achievements.filter(a => a.type === 'Tournament Win').length;
            document.getElementById('tournaments-won').textContent = tournamentWins;
            
            // Update recent activity
            updateRecentActivity();
            
            // Update upcoming matches
            updateUpcomingMatches();
        }

        function updateRecentActivity() {
            const container = document.getElementById('recent-activity');
            
            // Combine all activities and sort by date
            const allActivities = [
                ...players.map(p => ({
                    type: 'player',
                    action: p.updatedAt === p.createdAt ? 'added' : 'updated',
                    name: p.name,
                    date: new Date(p.updatedAt),
                    display: `${p.name} was ${p.updatedAt === p.createdAt ? 'added to' : 'updated in'} the team`
                })),
                ...matches.map(m => ({
                    type: 'match',
                    action: m.updatedAt === m.createdAt ? 'added' : 'updated',
                    name: `vs ${m.opponent}`,
                    date: new Date(m.updatedAt),
                    display: `Match ${m.updatedAt === m.createdAt ? 'recorded' : 'updated'}: vs ${m.opponent}`
                })),
                ...achievements.map(a => ({
                    type: 'achievement',
                    action: a.updatedAt === a.createdAt ? 'added' : 'updated',
                    name: a.title,
                    date: new Date(a.updatedAt),
                    display: `Achievement ${a.updatedAt === a.createdAt ? 'added' : 'updated'}: ${a.title}`
                }))
            ].sort((a, b) => b.date - a.date).slice(0, 5); // Get 5 most recent
            
            if (allActivities.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <h3>No Recent Activity</h3>
                        <p>Start by adding players and matches to see activity here.</p>
                    </div>
                `;
                return;
            }
            
            let html = '<div style="display: flex; flex-direction: column; gap: 15px;">';
            
            allActivities.forEach(activity => {
                const timeAgo = getTimeAgo(activity.date);
                const icon = activity.type === 'player' ? 'fas fa-user' : 
                            activity.type === 'match' ? 'fas fa-baseball-ball' : 'fas fa-trophy';
                
                html += `
                    <div style="display: flex; align-items: center; gap: 15px; padding: 10px; background: #f8f9fa; border-radius: 8px;">
                        <div style="width: 40px; height: 40px; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white;">
                            <i class="${icon}"></i>
                        </div>
                        <div style="flex: 1;">
                            <div style="font-weight: 500;">${activity.display}</div>
                            <div style="font-size: 0.85rem; color: var(--gray-dark);">${timeAgo}</div>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
            container.innerHTML = html;
        }

        function updateUpcomingMatches() {
            const container = document.getElementById('upcoming-matches');
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            // Get matches from today onwards
            const upcomingMatches = matches
                .filter(m => {
                    const matchDate = new Date(m.date);
                    matchDate.setHours(0, 0, 0, 0);
                    return matchDate >= today;
                })
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 3); // Show next 3 matches
            
            if (upcomingMatches.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-baseball-ball"></i>
                        <h3>No Upcoming Matches</h3>
                        <p>Add matches to see them listed here.</p>
                    </div>
                `;
                return;
            }
            
            let html = '<div style="display: flex; flex-direction: column; gap: 15px;">';
            
            upcomingMatches.forEach(match => {
                const matchDate = new Date(match.date);
                const formattedDate = matchDate.toLocaleDateString();
                const daysUntil = Math.ceil((matchDate - today) / (1000 * 60 * 60 * 24));
                
                html += `
                    <div style="padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid var(--accent);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <div style="font-weight: 600;">vs ${match.opponent}</div>
                            <div style="font-size: 0.85rem; color: var(--gray-dark);">${formattedDate}</div>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>${match.venue}</div>
                            <div style="font-size: 0.85rem; color: ${daysUntil === 0 ? 'var(--success)' : 'var(--primary)'};">
                                ${daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`}
                            </div>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
            container.innerHTML = html;
        }

        // Statistics functions
        function updateStatistics() {
            updateBattingLeaders();
            updateBowlingLeaders();
            showToast('Statistics updated!', 'success');
        }

        function updateBattingLeaders() {
            const tableBody = document.getElementById('batting-leaders');
            
            if (players.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="5" style="text-align: center;">
                            <div class="empty-state" style="padding: 10px;">
                                <p>No batting data available.</p>
                            </div>
                        </td>
                    </tr>
                `;
                return;
            }
            
            // Create batting stats for each player
            const battingStats = players.map(player => {
                const avg = player.matches > 0 ? (player.runs / player.matches).toFixed(2) : 0;
                const sr = player.matches > 0 ? ((player.runs / player.matches) * 100).toFixed(2) : 0;
                
                return {
                    name: player.name,
                    matches: player.matches,
                    runs: player.runs,
                    average: parseFloat(avg),
                    strikeRate: parseFloat(sr)
                };
            }).filter(p => p.runs > 0); // Only players with runs
            
            // Sort by runs (descending)
            battingStats.sort((a, b) => b.runs - a.runs);
            
            tableBody.innerHTML = '';
            
            battingStats.forEach((stat, index) => {
                if (index >= 5) return; // Show top 5 only
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${stat.name}</td>
                    <td>${stat.matches}</td>
                    <td>${stat.runs}</td>
                    <td>${stat.average}</td>
                    <td>${stat.strikeRate}</td>
                `;
                tableBody.appendChild(row);
            });
            
            if (battingStats.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="5" style="text-align: center;">
                            <div class="empty-state" style="padding: 10px;">
                                <p>No batting data available.</p>
                            </div>
                        </td>
                    </tr>
                `;
            }
        }

        function updateBowlingLeaders() {
            const tableBody = document.getElementById('bowling-leaders');
            
            if (players.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="5" style="text-align: center;">
                            <div class="empty-state" style="padding: 10px;">
                                <p>No bowling data available.</p>
                            </div>
                        </td>
                    </tr>
                `;
                return;
            }
            
            // Create bowling stats for each player
            const bowlingStats = players.map(player => {
                const avg = player.wickets > 0 ? (player.runs / player.wickets).toFixed(2) : 0;
                const economy = player.matches > 0 ? (player.wickets / player.matches).toFixed(2) : 0;
                
                return {
                    name: player.name,
                    matches: player.matches,
                    wickets: player.wickets,
                    average: parseFloat(avg),
                    economy: parseFloat(economy)
                };
            }).filter(p => p.wickets > 0); // Only players with wickets
            
            // Sort by wickets (descending)
            bowlingStats.sort((a, b) => b.wickets - a.wickets);
            
            tableBody.innerHTML = '';
            
            bowlingStats.forEach((stat, index) => {
                if (index >= 5) return; // Show top 5 only
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${stat.name}</td>
                    <td>${stat.matches}</td>
                    <td>${stat.wickets}</td>
                    <td>${stat.average}</td>
                    <td>${stat.economy}</td>
                `;
                tableBody.appendChild(row);
            });
            
            if (bowlingStats.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="5" style="text-align: center;">
                            <div class="empty-state" style="padding: 10px;">
                                <p>No bowling data available.</p>
                            </div>
                        </td>
                    </tr>
                `;
            }
        }

        // Utility functions
        function resetForms() {
            playerForm.reset();
            matchForm.reset();
            achievementForm.reset();
            editingPlayerId = null;
            editingMatchId = null;
            editingAchievementId = null;
        }

        function saveData() {
            localStorage.setItem('peshawarLionsPlayers', JSON.stringify(players));
            localStorage.setItem('peshawarLionsMatches', JSON.stringify(matches));
            localStorage.setItem('peshawarLionsAchievements', JSON.stringify(achievements));
        }

        function loadData() {
            const savedPlayers = localStorage.getItem('peshawarLionsPlayers');
            const savedMatches = localStorage.getItem('peshawarLionsMatches');
            const savedAchievements = localStorage.getItem('peshawarLionsAchievements');
            
            if (savedPlayers) players = JSON.parse(savedPlayers);
            if (savedMatches) matches = JSON.parse(savedMatches);
            if (savedAchievements) achievements = JSON.parse(savedAchievements);
        }

        function exportData() {
            const data = {
                players,
                matches,
                achievements,
                exportedAt: new Date().toISOString(),
                team: 'Peshawar Lions'
            };
            
            const dataStr = JSON.stringify(data, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `peshawar-lions-data-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            showToast('Data exported successfully!', 'success');
        }

        function openQuickAddModal() {
            quickAddModal.style.display = 'flex';
        }

        function importSampleData() {
            if (confirm('This will replace your current data with sample data. Continue?')) {
                // Sample players
                players = [
                    {
                        id: 'player_1',
                        name: 'Babar Azam',
                        role: 'Batsman',
                        battingStyle: 'Right-handed',
                        bowlingStyle: 'Right-arm off-spin',
                        matches: 45,
                        runs: 2150,
                        wickets: 5,
                        createdAt: new Date('2023-01-15').toISOString(),
                        updatedAt: new Date('2023-01-15').toISOString()
                    },
                    {
                        id: 'player_2',
                        name: 'Shaheen Afridi',
                        role: 'Bowler',
                        battingStyle: 'Left-handed',
                        bowlingStyle: 'Left-arm fast',
                        matches: 42,
                        runs: 180,
                        wickets: 78,
                        createdAt: new Date('2023-01-15').toISOString(),
                        updatedAt: new Date('2023-01-15').toISOString()
                    },
                    {
                        id: 'player_3',
                        name: 'Shadab Khan',
                        role: 'All-rounder',
                        battingStyle: 'Right-handed',
                        bowlingStyle: 'Leg-spin',
                        matches: 40,
                        runs: 850,
                        wickets: 52,
                        createdAt: new Date('2023-01-15').toISOString(),
                        updatedAt: new Date('2023-01-15').toISOString()
                    }
                ];
                
                // Sample matches
                matches = [
                    {
                        id: 'match_1',
                        date: '2023-06-15',
                        opponent: 'Karachi Kings',
                        venue: 'Arbab Niaz Stadium',
                        result: 'Won',
                        notes: 'Great batting performance by Babar Azam',
                        createdAt: new Date('2023-06-15').toISOString(),
                        updatedAt: new Date('2023-06-15').toISOString()
                    },
                    {
                        id: 'match_2',
                        date: '2023-07-22',
                        opponent: 'Lahore Qalandars',
                        venue: 'Gaddafi Stadium',
                        result: 'Lost',
                        notes: 'Close match, lost by 12 runs',
                        createdAt: new Date('2023-07-22').toISOString(),
                        updatedAt: new Date('2023-07-22').toISOString()
                    }
                ];
                
                // Sample achievements
                achievements = [
                    {
                        id: 'achievement_1',
                        title: 'Champions of PSL 2023',
                        description: 'Won the Pakistan Super League 2023 tournament',
                        date: '2023-03-20',
                        type: 'Tournament Win',
                        createdAt: new Date('2023-03-20').toISOString(),
                        updatedAt: new Date('2023-03-20').toISOString()
                    },
                    {
                        id: 'achievement_2',
                        title: 'Best Batsman Award',
                        description: 'Babar Azam awarded best batsman of the tournament',
                        date: '2023-03-20',
                        type: 'Individual Award',
                        createdAt: new Date('2023-03-20').toISOString(),
                        updatedAt: new Date('2023-03-20').toISOString()
                    }
                ];
                
                saveData();
                renderPlayers();
                renderMatches();
                renderAchievements();
                updateDashboard();
                updateStatistics();
                quickAddModal.style.display = 'none';
                
                showToast('Sample data loaded successfully!', 'success');
            }
        }

        function showToast(message, type = 'success') {
            toastMessage.textContent = message;
            toast.className = 'toast';
            toast.classList.add(type);
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        function getTimeAgo(date) {
            const now = new Date();
            const diffInSeconds = Math.floor((now - date) / 1000);
            
            if (diffInSeconds < 60) {
                return 'Just now';
            } else if (diffInSeconds < 3600) {
                const minutes = Math.floor(diffInSeconds / 60);
                return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
            } else if (diffInSeconds < 86400) {
                const hours = Math.floor(diffInSeconds / 3600);
                return `${hours} hour${hours > 1 ? 's' : ''} ago`;
            } else {
                const days = Math.floor(diffInSeconds / 86400);
                return `${days} day${days > 1 ? 's' : ''} ago`;
            }
        }
    </script>
</body>
</html>
