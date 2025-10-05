// Dark theme / Light Theme
const toggle_button = document.getElementById('theme_toggle');
const body = document.body;

function applyTheme(theme) {
    if (theme === 'dark') {
        body.classList.add('dark');
        if (toggle_button) toggle_button.textContent = '🌙';
    } else {
        body.classList.remove('dark');
        if (toggle_button) toggle_button.textContent = '☀️';
    }
    try {
        localStorage.setItem('theme', theme);
    } catch (e) {
        // ignore (e.g. privacy mode)
    }
}

// Initialize theme from storage (default: light)
const stored = (function () {
    try {
        return localStorage.getItem('theme');
    } catch (e) {
        return null;
    }
})();

applyTheme(stored === 'dark' ? 'dark' : 'light');

if (toggle_button) {
    toggle_button.addEventListener('click', () => {
        const next = body.classList.contains('dark') ? 'light' : 'dark';
        applyTheme(next);
    });
}