document.addEventListener('DOMContentLoaded', () => {
    displayLoggedInUsername();

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'home.html'; 
        });
    }
})
    function displayLoggedInUsername() {
        const loggedInUsername = localStorage.getItem('loggedInUsername');
        const usernameElement = document.getElementById('logged-in-user');
    
        if (loggedInUsername) {
            usernameElement.textContent = loggedInUsername; 
        } else {
            usernameElement.textContent = 'Anonymous'; 
        }
    }