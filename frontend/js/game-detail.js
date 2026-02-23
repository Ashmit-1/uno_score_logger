const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get('id');
const token = localStorage.getItem('token');
// const api_end_point_url = "https://uno-backend-api-685258470441.asia-south1.run.app"
const api_end_point_url = "http://127.0.0.1:8000"

// GLOBAL STATE: This holds our local copy of the data
let gameState = {
    players: [],
    rounds: [],
    name: ""
};


document.addEventListener('DOMContentLoaded', async () => {
    if (!token || !gameId) {
        window.location.href = 'index.html';
        return;
    }


    // 1. INITIAL LOAD: Only fetch once from DB
    await fetchInitialData();

    // 2. FORM SUBMISSION: Update DB (POST) and UI (Local)
    document.getElementById('round-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const inputs = document.querySelectorAll('.player-score-input');
        const roundNum = gameState.rounds.length + 1;

        // Prepare Local Round Object
        const newRoundScores = Array.from(inputs).map(inp => ({
            player_id: parseInt(inp.dataset.playerId),
            score: parseInt(inp.value) || 0
        }));

        // A. Send to Backend (Don't wait for refresh, just post)
        try {
            fetch(api_end_point_url + `/games/${gameId}/round`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ round_number: roundNum, scores: newRoundScores })
            });

            // B. UPDATE LOCAL STATE IMMEDIATELY
            gameState.rounds.push({ scores: newRoundScores });

            // C. RE-RENDER UI LOCALLY
            renderUI();
            e.target.reset();
        } catch (err) {
            alert("Failed to save to cloud, but updated locally.");
        }
    });

    const endBtn = document.getElementById('end-game-btn');
    if (endBtn) {
        endBtn.onclick = () => {
            // Simply hide the scoring section as requested
            const scoringSection = document.getElementById('scoring-section');
            if (scoringSection) {
                scoringSection.style.opacity = '0';
                setTimeout(() => {
                    scoringSection.style.display = 'none';
                }, 300); // Smooth transition
            }

        };
    }
});

async function fetchInitialData() {
    const loader = document.getElementById('loader-overlay');
    try {
        const res = await fetch(api_end_point_url + `/games/${gameId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        // Sync our local state with DB
        gameState.players = data.players;
        gameState.rounds = data.rounds;
        gameState.name = data.name;

        renderUI();
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 500);
    } catch (err) {
        loader.querySelector('.loading-text').textContent = "Failed to load game.";
        console.error("Initial load failed");
    }
}

function renderUI() {
    document.getElementById('game-display-name').textContent = gameState.name;

    // 1. Render Inputs (Only once usually, but keeping it reactive)
    const inputList = document.getElementById('score-inputs-list');
    inputList.innerHTML = gameState.players.map(p => `
        <div class="score-entry">
            <label>${p.name}</label>
            <input type="number" class="player-score-input" data-player-id="${p.id}" value="0">
        </div>`).join('');

    // 2. Render History Table
    const header = document.getElementById('table-head-row');
    const body = document.getElementById('table-body-rows');
    header.innerHTML = '<th>Round</th>' + gameState.players.map(p => `<th>${p.name}</th>`).join('');

    body.innerHTML = gameState.rounds.map((round, idx) => {
        let cells = `<td>${idx + 1}</td>`;
        gameState.players.forEach(p => {
            const s = round.scores.find(score => score.player_id === p.id);
            cells += `<td>${s ? s.score : 0}</td>`;
        });
        return `<tr>${cells}</tr>`;
    }).join('');

    // 3. Construct Leaderboard LOCALLY
    updateLeaderboardLocally();
}

function updateLeaderboardLocally() {
    // Calculate totals from gameState.rounds
    const totals = gameState.players.map(p => {
        const totalScore = gameState.rounds.reduce((sum, round) => {
            const s = round.scores.find(score => score.player_id === p.id);
            return sum + (s ? s.score : 0);
        }, 0);
        return { name: p.name, score: totalScore };
    });

    // Sort ascending (Lowest score is best in UNO)
    totals.sort((a, b) => a.score - b.score);

    const lbContainer = document.getElementById('leaderboard-list');
    lbContainer.innerHTML = totals.map((entry, idx) => `
        <div class="leaderboard-card ${idx === 0 ? 'rank-1' : ''}">
            <div class="lb-rank">#${idx + 1}</div>
            <div class="lb-name">${entry.name}</div>
            <div class="lb-score">${entry.score} pts</div>
        </div>
    `).join('');
}
