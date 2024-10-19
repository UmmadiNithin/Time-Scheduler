var modal = document.getElementById("myModal");
var closeBtn = document.getElementById("closeModalBtn");

const openModal = (text) => {
    const modalText = document.getElementById("modalText");
    modalText.innerText = text;
    modal.style.display = "block";
};

closeBtn.onclick = function() {
    modal.style.display = "none";
};

function displayLoggedInUsername() {
    const loggedInUsername = localStorage.getItem('loggedInUsername');
    const usernameElement = document.getElementById('logged-in-user');
    if (loggedInUsername) {
        usernameElement.textContent = loggedInUsername;
    } else {
        usernameElement.textContent = 'Anonymous';
    }
}

document.addEventListener('DOMContentLoaded', displayLoggedInUsername);

document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'home.html';
        });
    }
});

const populateDoctorDropdown = () => {
    const schedule = JSON.parse(localStorage.getItem('schedule')) || {};
    const cancelDoctorSelect = document.getElementById('cancel-doctor-name');
    cancelDoctorSelect.innerHTML = ''; 

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Doctor Name';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    cancelDoctorSelect.appendChild(defaultOption);

    for (const doctor in schedule) {
        const option = document.createElement('option');
        option.value = doctor;
        option.textContent = doctor;
        cancelDoctorSelect.appendChild(option);
    }

    cancelDoctorSelect.addEventListener('change', () => {
        const selectedDoctor = cancelDoctorSelect.value;
        const doctorSlots = schedule[selectedDoctor] || [];
        const slotsDropdown = document.getElementById('cancel-available-slots');
        slotsDropdown.innerHTML = '<option value="" disabled selected>Select a slot</option>';

        doctorSlots.forEach(slot => {
            if (!slot.isAvailable) {
                const slotOption = document.createElement('option');
                slotOption.value = `${slot.startTime}-${slot.endTime}`;
                slotOption.textContent = `${slot.startTime} to ${slot.endTime} (Booked by: ${slot.bookedBy})`;
                slotsDropdown.appendChild(slotOption);
            }
        });
    });
};

populateDoctorDropdown();

document.addEventListener('DOMContentLoaded', () => {
    const schedule = JSON.parse(localStorage.getItem('schedule')) || {};
    const doctorSelect = document.getElementById('book-doctor-name');

    for (const doctor in schedule) {
        const option = document.createElement('option');
        option.value = doctor;
        option.textContent = doctor;
        doctorSelect.appendChild(option);
    }

    doctorSelect.addEventListener('change', () => {
        const selectedDoctor = doctorSelect.value;
        const doctorSlots = schedule[selectedDoctor] || [];
        const slotsDropdown = document.getElementById('book-available-slots');
        slotsDropdown.innerHTML = '<option value="" disabled selected>Select a slot</option>';

        if (doctorSlots.length > 0) {
            doctorSlots.forEach(slot => {
                if (slot.isAvailable) {
                    const slotOption = document.createElement('option');
                    slotOption.value = `${slot.startTime}-${slot.endTime}`;
                    slotOption.textContent = `${slot.startTime} to ${slot.endTime}`;
                    slotsDropdown.appendChild(slotOption);
                }
            });
        } else {
            console.log('No slots available for this doctor.');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const schedule = JSON.parse(localStorage.getItem('schedule')) || {};
    const doctorSelect = document.getElementById('view-doctor-name');

    for (const doctor in schedule) {
        const option = document.createElement('option');
        option.value = doctor;
        option.textContent = doctor;
        doctorSelect.appendChild(option);
    }

    const form = document.getElementById('view-slots-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const doctorName = doctorSelect.value;
        const availableSlotsDiv = document.getElementById('available-slots');
        availableSlotsDiv.innerHTML = '';

        if (schedule[doctorName]) {
            const slots = schedule[doctorName];
            slots.forEach(slot => {
                const slotElement = document.createElement('div');
                slotElement.classList.add('slot');
                slotElement.textContent = `${slot.startTime} - ${slot.endTime} (Available: ${slot.isAvailable ? 'Yes' : 'No'})`;
                availableSlotsDiv.appendChild(slotElement);
            });
        } else {
            availableSlotsDiv.textContent = 'No slots available.';
        }
    });
});

document.getElementById('book-slot-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const doctorName = document.getElementById('book-doctor-name').value;
    const selectedSlot = document.getElementById('book-available-slots').value;
    const userName = document.getElementById('user-name').value;
    const bookDate = document.getElementById('book-date').value;
    const schedule = JSON.parse(localStorage.getItem('schedule')) || {};

    if (!schedule[doctorName]) {
        return openModal(`No schedule found for Dr. ${doctorName}`);
    }

    const doctorSchedule = schedule[doctorName];
    const selectedSlotIndex = doctorSchedule.findIndex(slot => `${slot.startTime}-${slot.endTime}` === selectedSlot);

    if (selectedSlotIndex === -1) {
        return openModal('Invalid slot selection');
    }

    if (!doctorSchedule[selectedSlotIndex].isAvailable) {
        return openModal('Slot already booked');
    }

    doctorSchedule[selectedSlotIndex].isAvailable = false;
    doctorSchedule[selectedSlotIndex].bookedBy = userName;
    doctorSchedule[selectedSlotIndex].bookedDate = bookDate;

    localStorage.setItem('schedule', JSON.stringify(schedule));

    openModal(`Appointment booked for ${userName} with Dr. ${doctorName} on ${bookDate}`);
    populateDoctorDropdown();
});

document.getElementById('cancel-booking-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const doctorName = document.getElementById('cancel-doctor-name').value;
    const selectedSlot = document.getElementById('cancel-available-slots').value;
    const userName = document.getElementById('cancel-user-name').value;
    const cancelDate = document.getElementById('cancel-date').value;
    const schedule = JSON.parse(localStorage.getItem('schedule')) || {};

    if (!schedule[doctorName]) {
        return openModal(`No schedule found for Dr. ${doctorName}`);
    }

    const doctorSchedule = schedule[doctorName];
    const selectedSlotIndex = doctorSchedule.findIndex(slot => `${slot.startTime}-${slot.endTime}` === selectedSlot);

    if (selectedSlotIndex === -1) {
        return openModal('Invalid slot selection');
    }

    if (doctorSchedule[selectedSlotIndex].isAvailable) {
        return openModal('Slot is not currently booked');
    }

    if (doctorSchedule[selectedSlotIndex].bookedBy !== userName || doctorSchedule[selectedSlotIndex].bookedDate !== cancelDate) {
        return openModal('Booking details do not match');
    }

    doctorSchedule[selectedSlotIndex].isAvailable = true;
    doctorSchedule[selectedSlotIndex].bookedBy = '';
    doctorSchedule[selectedSlotIndex].bookedDate = '';

    localStorage.setItem('schedule', JSON.stringify(schedule));

    openModal(`Booking canceled for ${userName} with Dr. ${doctorName}`);
    populateDoctorDropdown();
});

document.getElementById('view-all-slots-btn').addEventListener('click', function() {
    const allAvailableSlotsDiv = document.getElementById('all-available-slots');
    allAvailableSlotsDiv.innerHTML = '';
    const schedule = JSON.parse(localStorage.getItem('schedule')) || {};

    for (const doctor in schedule) {
        const doctorSlots = schedule[doctor];
        const doctorSlotsDiv = document.createElement('div');
        doctorSlotsDiv.classList.add('doctor-slots');
        doctorSlotsDiv.innerHTML = `<h4>${doctor} Slots</h4>`;

        doctorSlots.forEach(slot => {
            const slotDiv = document.createElement('div');
            slotDiv.classList.add('slot');
            slotDiv.textContent = `${slot.startTime} - ${slot.endTime} (Available: ${slot.isAvailable ? 'Yes' : 'No'})`;
            doctorSlotsDiv.appendChild(slotDiv);
        });

        allAvailableSlotsDiv.appendChild(doctorSlotsDiv);
    }
});
