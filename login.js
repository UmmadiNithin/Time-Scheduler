const loginForm = document.getElementById('login-form');
const loginEmailError = document.getElementById('login-email-error');
const loginPasswordError = document.getElementById('login-password-error');

loginEmailError.style.display = 'none'
loginPasswordError.style.display = 'none'

loginForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    loginEmailError.style.display = 'none'
    loginPasswordError.style.display = 'none'

    if (!email || !password) {
        if (!email) {
            loginEmailError.textContent = 'Email is required.';
            loginEmailError.style.display = 'block';
        }
        if (!password) {
            loginPasswordError.textContent = 'Password is required.';
            loginPasswordError.style.display = 'block';
        }
        return
    }

    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    const user = existingUsers.find(user => user.email === email);

    if (!user) {
        loginEmailError.textContent = 'Please enter a valid email.';
        loginEmailError.style.display = 'block';
    } else if (password !== user.password) {
        loginPasswordError.textContent = 'Incorrect password. Please try again.';
        loginPasswordError.style.display = 'block';
    } else {
        alert('Login successful!');
        localStorage.setItem('loggedInUsername', user.name);
        
        if (user.role === 'doctor') {
            window.location.href = 'create-slots.html';  
                } else if (user.role === 'patient') {
            window.location.href = '/main.html'; 
        } else {
            window.location.href = '/main.html';  
        }
    }
});
