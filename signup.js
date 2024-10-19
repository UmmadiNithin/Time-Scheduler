const signupForm = document.getElementById('signup-form');
const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const confirmPasswordError = document.getElementById('confirm-password-error');
const roleError = document.getElementById('role-error');

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const confirmPassword = document.getElementById('signup-confirm-password').value.trim();
    const role = document.getElementById('signup-role').value;

    let isValid = true;

    if (name === "") {
        nameError.style.display = 'block';
        isValid = false;
    } else {
        nameError.style.display = 'none';
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        emailError.style.display = 'block';
        isValid = false;
    } else {
        emailError.style.display = 'none';
    }

    if (password.length < 6) {
        passwordError.style.display = 'block';
        isValid = false;
    } else {
        passwordError.style.display = 'none';
    }

    if (password !== confirmPassword) {
        confirmPasswordError.style.display = 'block';
        isValid = false;
    } else {
        confirmPasswordError.style.display = 'none';
    }

    if (role === "") {
        roleError.style.display = 'block';
        isValid = false;
    } else {
        roleError.style.display = 'none';
    }

    if (isValid) {
        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
        const emailExists = existingUsers.some(user => user.email === email);

        if (emailExists) {
            emailError.textContent = 'Email already exists.';
            emailError.style.display = 'block';
        } else {
            const user = {
                name: name,
                email: email,
                password: password,
                role: role 
            };

            existingUsers.push(user);
            localStorage.setItem('users', JSON.stringify(existingUsers));

            alert('Signup successful!');
            window.location.href = 'login.html'; 
        }
    }
});
