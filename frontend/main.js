document.addEventListener('DOMContentLoaded', () => {
    displayLoggedInUsername();

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();

            localStorage.removeItem('loggedInUsername');

            window.location.href = '/frontend/home.html'; 
        });
    }
});

function displayLoggedInUsername() {
    const loggedInUsername = localStorage.getItem('loggedInUsername');
    const usernameElement = document.getElementById('logged-in-user');

    if (loggedInUsername) {
        usernameElement.textContent = ` ${loggedInUsername}!`; 
    } else {
        usernameElement.textContent = 'Anonymous'; 
    }
}

const username = localStorage.getItem('loggedInUsername');
if (username) {
    document.getElementById('logged-in-user').textContent = ` ${username}!`;
}
