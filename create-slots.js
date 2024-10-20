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
        const doctorName = document.getElementById('doctor-name').value; 
        const date = document.getElementById('date').value;
        const startHour = parseInt(document.getElementById('start-hour').value);
        const endHour = parseInt(document.getElementById('end-hour').value);
        const interval = parseInt(document.getElementById('interval').value);

        const schedule = JSON.parse(localStorage.getItem('schedule')) || {};

        if (!schedule[doctorName]) {
            schedule[doctorName] = {};
        }
        if (!schedule[doctorName][date]) {
            schedule[doctorName][date] = [];
        }

        for (let hour = startHour; hour < endHour; hour += interval) {
            const startTime = `${hour.toString().padStart(2, '0')}:00`;
            const endTime = `${(hour + interval).toString().padStart(2, '0')}:00`;

            schedule[doctorName][date].push({
                startTime: startTime,
                endTime: endTime,
                isAvailable: true
            });
        }

        localStorage.setItem('schedule', JSON.stringify(schedule));
        openModal('Time slots created successfully!');
        populateViewDoctorDropdown(); 
    });

    const viewSlotsBtn = document.getElementById('view-slots-btn');
    viewSlotsBtn.addEventListener('click', () => {
        const selectedDoctor = document.getElementById('view-doctor-name').value;
        const selectedDate = document.getElementById('view-date').value;
        displayAvailableSlots(selectedDoctor, selectedDate);
    });

    document.getElementById('view-all-slots-btn').addEventListener('click', () => {
        const selectedDate = document.getElementById('view-all-date').value;
        displayAllAvailableSlots(selectedDate);
    });
});

const modal = document.getElementById("myModal");
const closeBtn = document.getElementById("closeModalBtn");

const openModal = (text) => {
    if (!modal || !closeBtn) return;
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

function populateViewDoctorDropdown() {
    const viewDoctorSelect = document.getElementById('view-doctor-name');
    viewDoctorSelect.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Doctor';
    defaultOption.disabled = true; 
    defaultOption.selected = true;
    viewDoctorSelect.appendChild(defaultOption);

    const schedule = JSON.parse(localStorage.getItem('schedule')) || {};

    Object.keys(schedule).forEach(doctorName => {
        const option = document.createElement('option');
        option.value = doctorName; 
        option.textContent = doctorName;
        viewDoctorSelect.appendChild(option);
    });
}

function displayAvailableSlots(doctorName, selectedDate) {
    const schedule = JSON.parse(localStorage.getItem('schedule')) || {};
    const slotsList = document.getElementById('slots-list');

    slotsList.innerHTML = '';

    if (!schedule[doctorName] || !schedule[doctorName][selectedDate]) {
        const li = document.createElement('li');
        li.textContent = 'No slots available for this doctor on this date.';
        slotsList.appendChild(li);
        return;
    }

    const slots = schedule[doctorName][selectedDate];

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

function displayAllAvailableSlots(selectedDate) {
    const schedule = JSON.parse(localStorage.getItem('schedule')) || {};
    const allSlotsList = document.getElementById('all-slots-list');
    allSlotsList.innerHTML = ''; 

    let slotsFound = false;

    Object.keys(schedule).forEach(doctorName => {
        if (schedule[doctorName][selectedDate]) {
            slotsFound = true;
            
            const doctorSlotsDiv = document.createElement('div');
            doctorSlotsDiv.classList.add('doctor-slots');
            
            const doctorHeader = document.createElement('h3');
            doctorHeader.textContent = `Doctor: ${doctorName}`;
            doctorSlotsDiv.appendChild(doctorHeader);

            const slots = schedule[doctorName][selectedDate];

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

                doctorSlotsDiv.appendChild(div);
            });

            allSlotsList.appendChild(doctorSlotsDiv);
        }
    });

    if (!slotsFound) {
        const li = document.createElement('li');
        li.textContent = 'No available slots for any doctor on this date.';
        allSlotsList.appendChild(li);
    }
}

function displayLoggedInUsername() {
    const loggedInUsername = localStorage.getItem('loggedInUsername');
    const usernameElement = document.getElementById('logged-in-user');

    if (loggedInUsername) {
        usernameElement.textContent = loggedInUsername; 
    } else {
        usernameElement.textContent = 'Anonymous'; 
    }
}
