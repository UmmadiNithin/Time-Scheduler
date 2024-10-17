
var modal = document.getElementById("myModal");
var closeBtn = document.getElementById("closeModalBtn");

// const openModal=(text) => {
//     document.getElementById("modalText").innerText = text; 
//     modal.style.display = "block"; 
// }

const openModal = (text) => {
    const modalText = document.getElementById("modalText");
    modalText.innerText = text;
    modal.style.display = "block"; 
}

closeBtn.onclick = function() {
    modal.style.display = "none";
}



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
        slotsDropdown.innerHTML = '<option value="" disabled selected>Select a slot</option>'; // Reset slots dropdown

        doctorSlots.forEach(slot => {
            if (!slot.isAvailable) { 
                const slotOption = document.createElement('option');
                slotOption.value = `${slot.startTime}-${slot.endTime}`;
                slotOption.textContent = `${slot.startTime} to ${slot.endTime} (Booked by: ${slot.bookedBy})`; // Add booked information
                slotsDropdown.appendChild(slotOption);
            }
        });
    });
}

populateDoctorDropdown();



document.addEventListener('DOMContentLoaded', () => {
    const schedule = JSON.parse(localStorage.getItem('schedule')) || {};
    const doctorSelect = document.getElementById('book-doctor-name');

    // Add each doctor's name to the dropdown
    for (const doctor in schedule) {
        const option = document.createElement('option');
        option.value = doctor;
        option.textContent = doctor;
        doctorSelect.appendChild(option);
    }

    // Update available slots dropdown when doctor is selected
    doctorSelect.addEventListener('change', () => {
        const selectedDoctor = doctorSelect.value;
        console.log(`Selected Doctor: ${selectedDoctor}`); // Debug log
        
        // Check if the selected doctor exists in the schedule
        const doctorSlots = schedule[selectedDoctor] || [];
        console.log(`Doctor's Slots:`, doctorSlots); // Debug log
        
        const slotsDropdown = document.getElementById('book-available-slots');
        slotsDropdown.innerHTML = '<option value="" disabled selected>Select a slot</option>'; // Reset slots dropdown

        // Populate the slots dropdown based on the selected doctor
        if (doctorSlots.length > 0) {
            doctorSlots.forEach(slot => {
                if (slot.isAvailable) {
                    const slotOption = document.createElement('option');
                    slotOption.value = `${slot.startTime}-${slot.endTime}`; // Store the range as value
                    slotOption.textContent = `${slot.startTime} to ${slot.endTime}`;
                    slotsDropdown.appendChild(slotOption);
                }
            });
        } else {
            console.log('No slots available for this doctor.'); // Debug log
        }

        // Log the available slots
        console.log(`Available Slots Dropdown:`, slotsDropdown);
    });
});



document.getElementById('create-slots-form').addEventListener('submit', async (e) => {
    e.preventDefault()

    const doctorName = document.getElementById('doctor-name').value;
    const startHour = parseInt(document.getElementById('start-hour').value);
    const endHour = parseInt(document.getElementById('end-hour').value);
    const interval = parseInt(document.getElementById('interval').value);

    const schedule = JSON.parse(localStorage.getItem('schedule')) || {}

    for (let hour = startHour; hour < endHour; hour += interval) {
        const startTime = `${hour.toString().padStart(2, '0')}:00`
        const endTime = `${(hour + interval).toString().padStart(2, '0')}:00`;

        if (!schedule[doctorName]) {
            schedule[doctorName] = []
        }

        schedule[doctorName].push({
            startTime: startTime,
            endTime: endTime,
            isAvailable: true
        });
    }

    localStorage.setItem('schedule', JSON.stringify(schedule))
    // document.querySelector('#changecolor').style.backgroundColor = 'red'
    openModal('Time slots created successfully!')
})


document.getElementById('view-slots-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const doctorName = document.getElementById('view-doctor-name').value;
    const schedule = JSON.parse(localStorage.getItem('schedule')) || {};

    const doctorSlots = schedule[doctorName] || [];
    const availableSlots = doctorSlots.filter(slot => slot.isAvailable);
    
    const slotContainer = document.getElementById('available-slots');
    slotContainer.innerHTML = '';

    if (availableSlots.length > 0) {
        availableSlots.forEach(slot => {
            const slotDiv = document.createElement('div');
            slotDiv.className = 'slot-box'; // Add the new class here
            slotDiv.textContent = `${slot.startTime} to ${slot.endTime}`;
            slotContainer.appendChild(slotDiv);
        });
    } else {
        slotContainer.textContent = 'No available slots.';
    }
});



// document.getElementById('book-slot-form').addEventListener('submit', (e) => {
//     e.preventDefault();

//     const doctorName = document.getElementById('book-doctor-name').value;
//     const startTime = document.getElementById('book-start-time').value;
//     const endTime = document.getElementById('book-end-time').value;
//     const userName = document.getElementById('user-name').value;
//     const date = document.getElementById('book-date').value;

//     const schedule = JSON.parse(localStorage.getItem('schedule')) || {};
//     const doctorSlots = schedule[doctorName] || [];

//     const slot = doctorSlots.find(slot => slot.startTime === startTime && slot.endTime === endTime);
    
//     if (slot && slot.isAvailable) {
//         slot.isAvailable = false;
//         slot.bookedBy = userName;
//         slot.bookingDate = date;
//         openModal(`${userName} booked a slot from ${startTime} to ${endTime} on ${date}`);
//     } else {
//         openModal('Slot is unavailable');
//     }

//     localStorage.setItem('schedule', JSON.stringify(schedule));
// });

document.getElementById('book-slot-form').addEventListener('submit', function (event) {
    event.preventDefault();

    // Get the selected doctor name
    const selectedDoctor = document.getElementById('book-doctor-name').value;

    // Get the selected slot from the dropdown
    const selectedSlot = document.getElementById('book-available-slots').value;

    // Get the user name and booking date
    const userName = document.getElementById('user-name').value;
    const bookingDate = document.getElementById('book-date').value;

    // Check if a slot is selected
    if (!selectedSlot || selectedSlot === "") {
        openModal("Please select a slot to book");
        return;
    }

    // Retrieve the current schedule from localStorage
    const schedule = JSON.parse(localStorage.getItem('schedule')) || {};

    // Get the specific slots for the selected doctor
    const doctorSlots = schedule[selectedDoctor] || [];

    // Find the specific slot to book
    const slotToBook = doctorSlots.find(slot => `${slot.startTime}-${slot.endTime}` === selectedSlot);

    // If the slot is available, book it
    if (slotToBook && slotToBook.isAvailable) {
        // Update the slot availability and add booking details
        slotToBook.isAvailable = false;
        slotToBook.bookedBy = userName;
        slotToBook.bookingDate = bookingDate;

        // Update the schedule in localStorage
        schedule[selectedDoctor] = doctorSlots;
        localStorage.setItem('schedule', JSON.stringify(schedule));

        // Show success modal
        openModal(`Slot booked successfully with Doctor ${selectedDoctor} at ${selectedSlot}`);

        // Optionally, you can store the booking separately
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings.push({
            doctor: selectedDoctor,
            slot: selectedSlot,
            user: userName,
            date: bookingDate
        });
        localStorage.setItem('bookings', JSON.stringify(bookings));

        // Reset the form
        document.getElementById('book-slot-form').reset();
    } else {
        // Show error if slot is already booked or unavailable
        openModal('The selected slot is no longer available.');
    }
});





// document.getElementById('cancel-booking-form').addEventListener('submit', (e) => {
//     e.preventDefault()

//     const doctorName = document.getElementById('cancel-doctor-name').value;
//     const startTime = document.getElementById('cancel-start-time').value;
//     const endTime = document.getElementById('cancel-end-time').value;
//     const userName = document.getElementById('cancel-user-name').value;
//     const date = document.getElementById('cancel-date').value;

//     const schedule = JSON.parse(localStorage.getItem('schedule')) || {};
//     const doctorSlots = schedule[doctorName] || [];

//     const slot = doctorSlots.find(slot => slot.startTime === startTime && slot.endTime === endTime && slot.bookedBy === userName && slot.bookingDate === date);
    
//     if (slot) {
//         slot.isAvailable = true;
//         slot.bookedBy = null;
//         slot.bookingDate = null;
//         openModal(`Booking cancelled for ${userName} from ${startTime} to ${endTime} on ${date}`);
//     } else {
//         openModal('No such booking found');
//     }

//     localStorage.setItem('schedule', JSON.stringify(schedule));
// });


document.getElementById('cancel-booking-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const selectedDoctor = document.getElementById('cancel-doctor-name').value;
    const selectedSlot = document.getElementById('cancel-available-slots').value;
    const userName = document.getElementById('cancel-user-name').value;
    const bookingDate = document.getElementById('cancel-date').value;

    const schedule = JSON.parse(localStorage.getItem('schedule')) || {};
    const doctorSlots = schedule[selectedDoctor] || [];

    console.log('Selected Doctor:', selectedDoctor);
    console.log('Selected Slot:', selectedSlot);
    console.log('User Name:', userName);
    console.log('Booking Date:', bookingDate);
    console.log('Doctor Slots:', doctorSlots);

    doctorSlots.forEach((slot, index) => {
        console.log(`Slot ${index + 1}:`, slot);
    });

    const slotToCancel = doctorSlots.find(slot => 
        `${slot.startTime}-${slot.endTime}` === selectedSlot && 
        slot.bookingDate === bookingDate && 
        !slot.isAvailable 
    );

    console.log('Slot to Cancel:', slotToCancel);

    if (slotToCancel && slotToCancel.bookedBy === userName) {
        slotToCancel.isAvailable = true;
        delete slotToCancel.bookedBy; 

        localStorage.setItem('schedule', JSON.stringify(schedule));
        openModal('Booking cancelled successfully!');
    } else {
        openModal('You cannot cancel this booking.');
    }
});






document.getElementById('view-all-slots-btn').addEventListener('click', () => {
    const schedule = JSON.parse(localStorage.getItem('schedule')) || {};
    const allAvailableSlots = [];

    for (const doctor in schedule) {
        const doctorSlots = schedule[doctor] || [];
        const availableSlots = doctorSlots.filter(slot => slot.isAvailable);
        
        if (availableSlots.length > 0) {
            allAvailableSlots.push({ doctor, slots: availableSlots });
        }
    }

    const allSlotContainer = document.getElementById('all-available-slots');
    allSlotContainer.innerHTML = '';
    if (allAvailableSlots.length > 0) {
        allAvailableSlots.forEach(doctorInfo => {
            const doctorDiv = document.createElement('div');
            const doctorHeader = document.createElement('h3');
            doctorHeader.textContent = doctorInfo.doctor; 
            doctorDiv.appendChild(doctorHeader);

            const slotContainer = document.createElement('div');
            slotContainer.className = 'slot-container'; 

            doctorInfo.slots.forEach(slot => {
                const slotDiv = document.createElement('div');
                slotDiv.className = 'slot-box'; 
                slotDiv.textContent = `${slot.startTime} to ${slot.endTime}`;
                slotContainer.appendChild(slotDiv);
            });

            doctorDiv.appendChild(slotContainer); 
            allSlotContainer.appendChild(doctorDiv);
        });
    } else {
        allSlotContainer.textContent = 'No available slots for any doctor.';
    }
});

