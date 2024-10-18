document.addEventListener('DOMContentLoaded', () => {
    populateDoctorDropdown();
    displayLoggedInUsername();

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'home.html'; 
        });
    }

    document.getElementById('create-slots-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const doctorName = document.getElementById('doctor-name').value;
        const startHour = parseInt(document.getElementById('start-hour').value);
        const endHour = parseInt(document.getElementById('end-hour').value);
        const interval = parseInt(document.getElementById('interval').value);

        const schedule = JSON.parse(localStorage.getItem('schedule')) || {};

        for (let hour = startHour; hour < endHour; hour += interval) {
            const startTime = `${hour.toString().padStart(2, '0')}:00`;
            const endTime = `${(hour + interval).toString().padStart(2, '0')}:00`;

            if (!schedule[doctorName]) {
                schedule[doctorName] = [];
            }

            schedule[doctorName].push({
                startTime: startTime,
                endTime: endTime,
                isAvailable: true
            });
        }

        localStorage.setItem('schedule', JSON.stringify(schedule));
        openModal('Time slots created successfully!');
    });

    const modal = document.getElementById("myModal");
    const closeBtn = document.getElementById("closeModalBtn");

    const openModal = (text) => {
        const modalText = document.getElementById("modalText");
        modalText.innerText = text;
        modal.style.display = "block"; 
    };

    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = "none";
        };
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
});

function populateDoctorDropdown() {
    const doctorSelect = document.getElementById('doctor-name');

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const doctors = users.filter(user => user.role === 'doctor');

    if (doctors.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No doctors available';
        option.disabled = true;
        option.selected = true;
        doctorSelect.appendChild(option);
    } else {
        doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.name; 
            option.textContent = doctor.name;
            doctorSelect.appendChild(option);
        });
    }
}

function displayLoggedInUsername() {
    const loggedInUsername = localStorage.getItem('loggedInUsername');
    const usernameElement = document.getElementById('logged-in-user');

    console.log('Username from localStorage:', loggedInUsername); 

    if (loggedInUsername) {
        usernameElement.textContent = loggedInUsername; 
    } else {
        usernameElement.textContent = 'Anonymous'; 
    }
}
