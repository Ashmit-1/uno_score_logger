// Game state
let gameState = {
    players: [],
    rounds: [],
    currentRound: 1,
    previousScores: {}
};

// DOM Elements
const startScreen = document.getElementById('start-screen');
const playersSetup = document.getElementById('players-setup');
const gameScreen = document.getElementById('game-screen');
const endGameScreen = document.getElementById('end-game-screen');
const startGameBtn = document.getElementById('start-game-btn');
const addPlayerBtn = document.getElementById('add-player-btn');
const donePlayersBtn = document.getElementById('done-players-btn');
const playersList = document.getElementById('players-list');
const roundNumber = document.getElementById('round-number');
const scoreForms = document.getElementById('score-forms');
const submitScoresBtn = document.getElementById('submit-scores-btn');
const leaderboardBody = document.getElementById('leaderboard-body');
const finalLeaderboardBody = document.getElementById('final-leaderboard-body');
const addRoundBtn = document.getElementById('add-round-btn');
const endGameBtn = document.getElementById('end-game-btn');
const newGameBtn = document.getElementById('new-game-btn');
const roundHistoryHeader = document.getElementById('round-history-header');
const roundHistoryBody = document.getElementById('round-history-body');

// Event Listeners
startGameBtn.addEventListener('click', showPlayersSetup);
addPlayerBtn.addEventListener('click', addPlayerInput);
donePlayersBtn.addEventListener('click', startGame);
submitScoresBtn.addEventListener('click', submitScores);
addRoundBtn.addEventListener('click', addNewRound);
endGameBtn.addEventListener('click', endGame);
newGameBtn.addEventListener('click', resetGame);

// Functions
function showPlayersSetup() {
    startScreen.classList.add('hidden');
    playersSetup.classList.remove('hidden');
}

function addPlayerInput() {
    const playerCount = document.querySelectorAll('.player-input').length;
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'player-input';
    input.placeholder = `Player ${playerCount + 1} name`;
    input.dataset.index = playerCount;
    playersList.appendChild(input);
}

function startGame() {
    // Get player names
    const playerInputs = document.querySelectorAll('.player-input');
    gameState.players = Array.from(playerInputs).map((input, index) => {
        return {
            id: index,
            name: input.value || `Player ${index + 1}`,
            totalScore: 0
        };
    });
    
    // Initialize rounds array
    gameState.rounds = [];
    
    // Initialize previous scores
    gameState.previousScores = {};
    
    // Show game screen
    playersSetup.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    // Update round number
    roundNumber.textContent = gameState.currentRound;
    
    // Create score entry forms
    createScoreEntryForms();
    
    // Initialize round history table
    initializeRoundHistoryTable();
    
    // Initialize leaderboard
    updateLeaderboard();
}

function createScoreEntryForms() {
    scoreForms.innerHTML = '';
    
    gameState.players.forEach(player => {
        const row = document.createElement('div');
        row.className = 'player-score-row';
        row.innerHTML = `
            <div class="player-name">${player.name}</div>
            <input type="number" class="score-input" data-player-id="${player.id}" min="0" value="0">
        `;
        scoreForms.appendChild(row);
    });
}

function initializeRoundHistoryTable() {
    // Create table header
    let headerHtml = '<tr><th>Round</th>';
    gameState.players.forEach(player => {
        headerHtml += `<th>${player.name}</th>`;
    });
    headerHtml += '</tr>';
    roundHistoryHeader.innerHTML = headerHtml;
    
    // Clear table body
    roundHistoryBody.innerHTML = '';
}

function submitScores() {
    // Get scores from inputs
    const scores = {};
    const scoreInputs = document.querySelectorAll('.score-input');
    
    // Populate scores object
    scoreInputs.forEach(input => {
        const playerId = parseInt(input.dataset.playerId);
        scores[playerId] = parseInt(input.value) || 0;
    });
    
    // Check if at least one score is greater than zero
    const hasNonZeroScore = Object.values(scores).some(score => score > 0);
    
    // If no scores are greater than zero, show an alert and return
    if (!hasNonZeroScore) {
        alert("Please enter at least one score greater than zero.");
        return;
    }
    
    // Save scores for this round
    gameState.rounds.push({
        roundNumber: gameState.currentRound,
        scores: scores
    });
    
    // Update total scores
    gameState.players.forEach(player => {
        player.totalScore += scores[player.id] || 0;
    });
    
    // Update leaderboard
    updateLeaderboard();
    
    // Update round history table
    updateRoundHistoryTable();
    
    // Reset score inputs to 0
    scoreInputs.forEach(input => {
        input.value = 0;
    });
}

function updateLeaderboard() {
    // Sort players by total score (ascending)
    const sortedPlayers = [...gameState.players].sort((a, b) => a.totalScore - b.totalScore);
    
    // Update leaderboard table
    leaderboardBody.innerHTML = '';
    sortedPlayers.forEach((player, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${player.name}</td>
            <td>${player.totalScore}</td>
        `;
        leaderboardBody.appendChild(row);
    });
}

function updateRoundHistoryTable() {
    // Clear the table body
    roundHistoryBody.innerHTML = '';
    
    // Add rows for each round
    gameState.rounds.forEach(round => {
        let rowHtml = `<tr><td>${round.roundNumber}</td>`;
        gameState.players.forEach(player => {
            rowHtml += `<td>${round.scores[player.id] || 0}</td>`;
        });
        rowHtml += '</tr>';
        roundHistoryBody.innerHTML += rowHtml;
    });
    
    // Add totals row
    let totalsRowHtml = '<tr><td>Total</td>';
    gameState.players.forEach(player => {
        totalsRowHtml += `<td>${player.totalScore}</td>`;
    });
    totalsRowHtml += '</tr>';
    roundHistoryBody.innerHTML += totalsRowHtml;
}

function addNewRound() {
    gameState.currentRound++;
    roundNumber.textContent = gameState.currentRound;
    
    // Clear score inputs
    const scoreInputs = document.querySelectorAll('.score-input');
    scoreInputs.forEach(input => {
        input.value = 0;
    });
    
    // Update round history table
    updateRoundHistoryTable();
}

function endGame() {
    // Show final leaderboard
    gameScreen.classList.add('hidden');
    endGameScreen.classList.remove('hidden');
    
    // Sort players by total score (ascending)
    const sortedPlayers = [...gameState.players].sort((a, b) => a.totalScore - b.totalScore);
    
    // Update final leaderboard table
    finalLeaderboardBody.innerHTML = '';
    sortedPlayers.forEach((player, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${player.name}</td>
            <td>${player.totalScore}</td>
        `;
        finalLeaderboardBody.appendChild(row);
    });
}

function resetGame() {
    // Reset game state
    gameState = {
        players: [],
        rounds: [],
        currentRound: 1
    };
    
    // Clear player inputs
    playersList.innerHTML = `
        <input type="text" class="player-input" placeholder="Player 1 name" data-index="0">
        <input type="text" class="player-input" placeholder="Player 2 name" data-index="1">
        <input type="text" class="player-input" placeholder="Player 3 name" data-index="2">
        <input type="text" class="player-input" placeholder="Player 4 name" data-index="3">
    `;
    
    // Hide all screens and show start screen
    endGameScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
}