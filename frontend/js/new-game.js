const api_end_point_url = "https://uno-backend-api-685258470441.asia-south1.run.app"
// const api_end_point_url = "http://127.0.0.1:8000"

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('player-inputs-container');
    const addBtn = document.getElementById('add-player-btn');
    const setupForm = document.getElementById('setup-form');
    const gameNameInput = document.getElementById('game-name');
    const token = localStorage.getItem('token');

    if (!token) window.location.href = 'index.html';

    // --- Generate Default Game Name ---
    const now = new Date();
    const dayName = now.toLocaleDateString('en-GB', { weekday: 'long' });
    const dayNum = now.getDate();
    const monthName = now.toLocaleDateString('en-GB', { month: 'long' });

    // Simple ordinal suffix logic (1st, 2nd, 3rd...)
    const getOrdinal = (n) => {
        if (n > 3 && n < 21) return 'th';
        switch (n % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    };

    const defaultName = `${dayNum}${getOrdinal(dayNum)} ${monthName} ${dayName}`;
    gameNameInput.value = defaultName;



    // --- Add Player Rows ---
    addBtn.addEventListener('click', () => {
        const div = document.createElement('div');
        div.className = 'player-input';
        div.innerHTML = `
            <input type="text" class="player-name" placeholder="Next Player" required>
            <button type="button" class="remove-btn">×</button>
        `;
        container.appendChild(div);
        div.querySelector('.remove-btn').onclick = () => div.remove();
    });

    // --- Form Submission ---
    setupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const finalGameName = gameNameInput.value || defaultName;
        const nameInputs = document.querySelectorAll('.player-name');

        // Map to format: [{"name": "Player1"}, {"name": "Player2"}]
        const players = Array.from(nameInputs).map(input => ({
            name: input.value.trim()
        }));

        try {
            const response = await fetch(api_end_point_url + '/games/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: finalGameName,
                    players: players
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Backend returns data with id, redirect to detail
                window.location.href = `game-detail.html?id=${data.id}`;
            } else {
                alert("Error: " + (data.detail?.[0]?.msg || data.detail || "Unknown error"));
            }
        } catch (err) {
            alert("Server connection failed.");
        }
    });

    // Theme toggle logic (keep consistent across pages)
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        themeToggle.textContent = newTheme === 'light' ? '🌙' : '☀️';
    });
});