const loginForm = document.getElementById('login-form');
const loginEmailError = document.getElementById('login-email-error');
const loginPasswordError = document.getElementById('login-password-error');

loginEmailError.style.display = 'none';
loginPasswordError.style.display = 'none';

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    loginEmailError.style.display = 'none';
    loginPasswordError.style.display = 'none';

    if (!email || !password) {
        if (!email) {
            loginEmailError.textContent = 'Email is required.';
            loginEmailError.style.display = 'block';
        }
        if (!password) {
            loginPasswordError.textContent = 'Password is required.';
            loginPasswordError.style.display = 'block';
        }
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/patient/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            const token = data.result.token;
            localStorage.setItem('authToken', token); 
            localStorage.setItem('loggedInUsername', data.result.name || email); 
            alert('Login successful!'); 
            const isAdmin = data.result.isAdmin; 

            if (isAdmin) {
                window.location.href = '/frontend/admin.html'; 
            } else {
                const userRole = data.result.role; 

                if (userRole === 'doctor') {
                    window.location.href = '/frontend/create-slots.html'; 
                } else if (userRole === 'patient') {
                    window.location.href = '/frontend/main.html';
                } else {
                    window.location.href = '/frontend/main.html';
                }
            }
        } else {
            loginEmailError.textContent = data.message || 'Login failed. Please try again.';
            loginEmailError.style.display = 'block';
        }
    } catch (error) {
        console.error('Error during login:', error);
        loginEmailError.textContent = 'An error occurred. Please try again later.';
        loginEmailError.style.display = 'block';
    }
});

console.log(localStorage.getItem('authToken'));
