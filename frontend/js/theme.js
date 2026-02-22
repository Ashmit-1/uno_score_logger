(function () {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
})();

function initThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return;

    const currentTheme = localStorage.getItem('theme') || 'light';
    themeBtn.textContent = currentTheme === 'light' ? '🌙' : '☀️';

    themeBtn.onclick = () => {
        const now = document.documentElement.getAttribute('data-theme');
        const next = now === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        themeBtn.textContent = next === 'light' ? '🌙' : '☀️';
    };
}

// Run toggle setup after DOM loads
document.addEventListener('DOMContentLoaded', initThemeToggle);