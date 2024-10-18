
var modal = document.getElementById("myModal");
var closeBtn = document.getElementById("closeModalBtn");



const openModal = (text) => {
    const modalText = document.getElementById("modalText");
    modalText.innerText = text;
    modal.style.display = "block"; 
}

closeBtn.onclick = function() {
    modal.style.display = "none";
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
    const schedule = JSON.parse(localStorage.getItem('schedule')) || {}
    const cancelDoctorSelect = document.getElementById('cancel-doctor-name');
    cancelDoctorSelect.innerHTML = '' 

    const defaultOption = document.createElement('option')
    defaultOption.value = ''
    defaultOption.textContent = 'Select Doctor Name'; 
    defaultOption.disabled = true; 
    defaultOption.selected = true; 
    cancelDoctorSelect.appendChild(defaultOption)

    for (const doctor in schedule) {
        const option = document.createElement('option');
        option.value = doctor
        option.textContent = doctor
        cancelDoctorSelect.appendChild(option)
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

    for (const doctor in schedule) {
        const option = document.createElement('option');
        option.value = doctor;
        option.textContent = doctor;
        doctorSelect.appendChild(option);
    }

    doctorSelect.addEventListener('change', () => {
        const selectedDoctor = doctorSelect.value;
        console.log(`Selected Doctor: ${selectedDoctor}`);
        
        const doctorSlots = schedule[selectedDoctor] || [];
        console.log(`Doctor's Slots:`, doctorSlots); 
        
        const slotsDropdown = document.getElementById('book-available-slots');
        slotsDropdown.innerHTML = '<option value="" disabled selected>Select a slot</option>'; // Reset slots dropdown

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

        console.log(`Available Slots Dropdown:`, slotsDropdown);
    });
})



// document.getElementById('view-slots-form').addEventListener('submit', (e) => {
//     e.preventDefault();

//     const doctorName = document.getElementById('view-doctor-name').value;
//     const schedule = JSON.parse(localStorage.getItem('schedule')) || {};

//     const doctorSlots = schedule[doctorName] || [];
//     const availableSlots = doctorSlots.filter(slot => slot.isAvailable);
    
//     const slotContainer = document.getElementById('available-slots');
//     slotContainer.innerHTML = '';

//     if (availableSlots.length > 0) {
//         availableSlots.forEach(slot => {
//             const slotDiv = document.createElement('div');
//             slotDiv.className = 'slot-box'; 
//             slotDiv.textContent = `${slot.startTime} to ${slot.endTime}`;
//             slotContainer.appendChild(slotDiv);
//         });
//     } else {
//         slotContainer.textContent = 'No available slots.';
//     }
// });


document.addEventListener('DOMContentLoaded', () => {
    const schedule = JSON.parse(localStorage.getItem('schedule')) || {};
    const doctorSelect = document.getElementById('view-doctor-name');

    for (const doctor in schedule) {
        const option = document.createElement('option');
        option.value = doctor;
        option.textContent = `Dr. ${doctor}`; 
        doctorSelect.appendChild(option);
    }

    document.getElementById('view-slots-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const selectedDoctor = doctorSelect.value;
        const doctorSlots = schedule[selectedDoctor] || [];
        const availableSlots = doctorSlots.filter(slot => slot.isAvailable);

        const slotContainer = document.getElementById('available-slots');
        slotContainer.innerHTML = '';

        if (availableSlots.length > 0) {
            availableSlots.forEach(slot => {
                const slotDiv = document.createElement('div');
                slotDiv.className = 'slot-box';
                slotDiv.textContent = `${slot.startTime} to ${slot.endTime}`;
                slotContainer.appendChild(slotDiv);
            });
        } else {
            slotContainer.textContent = 'No available slots.';
        }
    });
});


document.getElementById('book-slot-form').addEventListener('submit', function (event) {
    event.preventDefault()

    const selectedDoctor = document.getElementById('book-doctor-name').value;

    const selectedSlot = document.getElementById('book-available-slots').value;

    const userName = document.getElementById('user-name').value;
    const bookingDate = document.getElementById('book-date').value;

    if (!selectedSlot || selectedSlot === "") {
        openModal("Please select a slot to book")
        return
    }

    const schedule = JSON.parse(localStorage.getItem('schedule')) || {}

    const doctorSlots = schedule[selectedDoctor] || []
    const slotToBook = doctorSlots.find(slot => `${slot.startTime}-${slot.endTime}` === selectedSlot);
    if (slotToBook && slotToBook.isAvailable) {
        slotToBook.isAvailable = false;
        slotToBook.bookedBy = userName;
        slotToBook.bookingDate = bookingDate

        schedule[selectedDoctor] = doctorSlots
        localStorage.setItem('schedule', JSON.stringify(schedule))

        openModal(`Slot booked successfully with Doctor ${selectedDoctor} at ${selectedSlot}`);

        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings.push({
            doctor: selectedDoctor,
            slot: selectedSlot,
            user: userName,
            date: bookingDate
        })
        localStorage.setItem('bookings', JSON.stringify(bookings))

        document.getElementById('book-slot-form').reset()
    } else {
        openModal('The selected slot is no longer available.')
    }
})




document.getElementById('cancel-booking-form').addEventListener('submit', function (event) {
    event.preventDefault()

    const selectedDoctor = document.getElementById('cancel-doctor-name').value;
    const selectedSlot = document.getElementById('cancel-available-slots').value;
    const userName = document.getElementById('cancel-user-name').value;
    const bookingDate = document.getElementById('cancel-date').value

    const schedule = JSON.parse(localStorage.getItem('schedule')) || {}
    const doctorSlots = schedule[selectedDoctor] || []

    console.log('Selected Doctor:', selectedDoctor)
    console.log('Selected Slot:', selectedSlot)
    console.log('User Name:', userName)
    console.log('Booking Date:', bookingDate)
    console.log('Doctor Slots:', doctorSlots)

    doctorSlots.forEach((slot, index) => {
        console.log(`Slot ${index + 1}:`, slot)
    })

    const slotToCancel = doctorSlots.find(slot => 
        `${slot.startTime}-${slot.endTime}` === selectedSlot && 
        slot.bookingDate === bookingDate && 
        !slot.isAvailable 
    )

    console.log('Slot to Cancel:', slotToCancel);

    if (slotToCancel && slotToCancel.bookedBy === userName) {
        slotToCancel.isAvailable = true;
        delete slotToCancel.bookedBy

        localStorage.setItem('schedule', JSON.stringify(schedule));
        openModal('Booking cancelled successfully!')
    } else {
        openModal('You cannot cancel this booking.');
    }
})





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

            doctorHeader.textContent = `Dr. ${doctorInfo.doctor}`; 
            doctorHeader.className = 'doctor-name'; 
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

