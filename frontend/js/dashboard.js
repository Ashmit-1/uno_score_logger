document.addEventListener('DOMContentLoaded', async () => {

    const token = localStorage.getItem('token');
    const loader = document.getElementById('loader-overlay');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }



    const gamesGrid = document.getElementById('games-grid');
    const newGameBtn = document.getElementById('new-game-btn');

    // Go to New Game page
    newGameBtn.addEventListener('click', () => {
        window.location.href = 'new-game.html';
    });

    // --- Fetch Games ---
    try {
        const response = await fetch('https://uno-backend-api-685258470441.asia-south1.run.app/games/', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'accept': 'application/json'
            }
        });

        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = 'index.html';
            return;
        }

        const games = await response.json();
        gamesGrid.innerHTML = '';

        if (games.length === 0) {
            gamesGrid.innerHTML = '<p class="empty-msg">No games found. Start a new match!</p>';
        } else {
            games.forEach((game, index) => {
                const card = document.createElement('div');
                card.className = 'game-card';
                const gameDate = new Date(game.created_at).toLocaleDateString();
                card.innerHTML = `
                    <h3>${index + 1}. ${game.name}</h3>
                    <p class="game-date">${gameDate}</p>
                `;
                card.onclick = () => window.location.href = `game-detail.html?id=${game.id}`;
                gamesGrid.appendChild(card);
            });
        }

        if (loader) loader.classList.add('hidden');

    } catch (err) {
        gamesGrid.innerHTML = '<p class="error-text">Failed to connect to server.</p>';
        if (loader) {
            loader.querySelector('.loading-text').textContent = "Server connection failed.";
        }
    }
});