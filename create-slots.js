document.addEventListener('DOMContentLoaded', () => {
    populateViewDoctorDropdown();
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
        const doctorName = document.getElementById('doctor-name').value; // Manual input for doctor name
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

        // Update the dropdown after creating slots
        populateViewDoctorDropdown(); // Call to update the dropdown with new doctor names
    });

    const viewSlotsBtn = document.getElementById('view-slots-btn');
    viewSlotsBtn.addEventListener('click', () => {
        const selectedDoctor = document.getElementById('view-doctor-name').value;
        displayAvailableSlots(selectedDoctor);
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
    }
});

function populateViewDoctorDropdown() {
    const viewDoctorSelect = document.getElementById('view-doctor-name');
    viewDoctorSelect.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Doctor';
    defaultOption.disabled = true; 
    defaultOption.selected = true; 
    viewDoctorSelect.appendChild(defaultOption);

    const schedule = JSON.parse(localStorage.getItem('schedule')) || {}; // Retrieve schedule from localStorage

    // Extract doctor names from the schedule
    Object.keys(schedule).forEach(doctorName => {
        const option = document.createElement('option');
        option.value = doctorName; 
        option.textContent = doctorName;
        viewDoctorSelect.appendChild(option);
    });
}

function displayAvailableSlots(doctorName) {
    const schedule = JSON.parse(localStorage.getItem('schedule')) || {};
    const slotsList = document.getElementById('slots-list');

    slotsList.innerHTML = '';

    if (!schedule[doctorName]) {
        const li = document.createElement('li');
        li.textContent = 'No slots available for this doctor.';
        slotsList.appendChild(li);
        return;
    }

    const slots = schedule[doctorName];

    slots.forEach(slot => {
        const div = document.createElement('div');
        div.classList.add('slot');

        if (slot.isAvailable) {
            div.classList.add('available');
            div.textContent = `${slot.startTime} - ${slot.endTime} (Available)`;
        } else {
            div.classList.add('booked');
            div.textContent = `${slot.startTime} - ${slot.endTime} (Booked by: ${slot.bookedBy})`;
        }

        slotsList.appendChild(div);
    });
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
