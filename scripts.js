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
document.addEventListener('DOMContentLoaded', () => {
    populateViewDoctorDropdown();
    displayLoggedInUsername();


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
})


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


 });




document.getElementById('book-slot-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const doctorName = document.getElementById('book-doctor-name').value;
    const selectedSlot = document.getElementById('book-available-slots').value;
    const userName = document.getElementById('user-name').value;
    const bookDate = document.getElementById('book-date').value;
    const schedule = JSON.parse(localStorage.getItem('schedule')) || {};

    console.log('Doctor Name:', doctorName); // Debugging: Check doctor name
    console.log('Selected Slot:', selectedSlot); // Debugging: Check selected slot
    console.log('User Name:', userName); // Debugging: Check user name
    console.log('Booking Date:', bookDate); // Debugging: Check booking date
    console.log('Schedule:', schedule); // Debugging: Check loaded schedule

    // Check if schedule exists for the selected doctor
    if (!schedule[doctorName]) {
        return openModal(`No schedule found for Dr. ${doctorName}`);
    }

    const doctorSchedule = schedule[doctorName];

    // Filter the schedule for the selected booking date
    const slotsForDate = doctorSchedule.filter(slot => slot.date === bookDate);

    console.log('Slots for Date:', slotsForDate); // Debugging: Check filtered slots

    // Find the selected slot index in the filtered slots
    const selectedSlotIndex = slotsForDate.findIndex(slot => `${slot.startTime}-${slot.endTime}` === selectedSlot);

    console.log('Selected Slot Index:', selectedSlotIndex); // Debugging: Check selected slot index

    if (selectedSlotIndex === -1) {
        return openModal('Invalid slot selection');
    }

    if (!slotsForDate[selectedSlotIndex].isAvailable) {
        return openModal('Slot already booked');
    }

    // Update the selected slot to mark it as booked
    slotsForDate[selectedSlotIndex].isAvailable = false;
    slotsForDate[selectedSlotIndex].bookedBy = userName;
    slotsForDate[selectedSlotIndex].bookedDate = bookDate;

    // Save the updated schedule back to local storage
    localStorage.setItem('schedule', JSON.stringify(schedule));

    openModal(`Appointment booked for ${userName} with Dr. ${doctorName} on ${bookDate}`);
    populateDoctorDropdown();
});

// Function to populate available slots based on the selected doctor and date
document.getElementById('book-doctor-name').addEventListener('change', updateAvailableSlots);
document.getElementById('book-date').addEventListener('change', updateAvailableSlots);

function updateAvailableSlots() {
    const doctorName = document.getElementById('book-doctor-name').value;
    const bookDate = document.getElementById('book-date').value;
    const availableSlotsDropdown = document.getElementById('book-available-slots');
    availableSlotsDropdown.innerHTML = ''; // Clear existing options

    const schedule = JSON.parse(localStorage.getItem('schedule')) || {};

    // Check if schedule exists for the selected doctor
    if (!schedule[doctorName]) {
        console.warn(`No schedule found for Dr. ${doctorName}`);
        return;
    }

    // Get the doctor's schedule for the selected date
    const doctorSchedule = schedule[doctorName];

    console.log('Doctor Schedule:', doctorSchedule); // Debugging: Check the doctor's schedule
    console.log('Type of Doctor Schedule:', typeof doctorSchedule); // Check the type

    // Check if doctorSchedule is an object
    if (typeof doctorSchedule !== 'object' || doctorSchedule === null) {
        console.error(`Expected an object for doctor schedule but got:`, doctorSchedule);
        return; // Stop execution if the schedule is not an object
    }

    console.log('Selected Booking Date:', bookDate); // Log the selected booking date

    // Check if there's an entry for the selected date
    const slotsForDate = doctorSchedule[bookDate];

    console.log('Retrieved Slots for Date:', slotsForDate); // Debugging: Check retrieved slots

    if (!Array.isArray(slotsForDate)) {
        console.error(`Expected an array for slots on ${bookDate} but got:`, slotsForDate);
        return; // Stop execution if there are no slots for the selected date
    }

    console.log('Filtered Slots for Update:', slotsForDate); // Debugging: Check filtered slots

    // Populate the available slots dropdown based on the filtered slots
    slotsForDate.forEach(slot => {
        if (slot.isAvailable) {
            const option = document.createElement('option');
            option.value = `${slot.startTime}-${slot.endTime}`;
            option.textContent = `${slot.startTime} - ${slot.endTime}`;
            availableSlotsDropdown.appendChild(option);
        }
    });

    // Debugging: Check if slots were added to the dropdown
    if (availableSlotsDropdown.options.length === 0) {
        console.warn('No available slots for the selected date.');
    }
}










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

