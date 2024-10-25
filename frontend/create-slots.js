document.addEventListener('DOMContentLoaded', () => {
    populateViewDoctorDropdown();
    displayLoggedInUsername();
    setMinDateForDateInput()

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
            window.location.href = 'home.html';
        });
    }

    document.getElementById('create-slots-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const doctorName = document.getElementById('doctor-name').value;
        const date = document.getElementById('date').value;
        const startHour = parseInt(document.getElementById('start-hour').value);
        const endHour = parseInt(document.getElementById('end-hour').value);
        const interval = parseInt(document.getElementById('interval').value);
        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch('http://localhost:3000/api/docter/create-slots', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    doctorName,
                    date,
                    startTime: startHour,
                    endTime: endHour,
                    intervalInHours: interval,
                }),
            });

            const result = await response.json();
            openModal(result.message);
            populateViewDoctorDropdown();
        } catch (error) {
            openModal('Error creating time slots: ' + error.message);
        }
    });

    const viewSlotsBtn = document.getElementById('view-slots-btn');
    viewSlotsBtn.addEventListener('click', async () => {
        const selectedDoctor = document.getElementById('view-doctor-name').value;
        const selectedDate = document.getElementById('view-date').value;

        if (!selectedDoctor || !selectedDate) {
            openModal('Please select both a doctor and a date');
            return;
        }

        await displayAvailableSlots(selectedDoctor, selectedDate);
    });

    const viewAllSlotsBtn = document.getElementById('view-all-slots-btn');
    viewAllSlotsBtn.addEventListener('click', async () => {
        const selectedDate = document.getElementById('view-all-date').value;

        if (!selectedDate) {
            openModal('Please select a date');
            return;
        }

        await displayAllAvailableSlots(selectedDate);
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
    closeBtn.onclick = function () {
        modal.style.display = "none";
    };
}

window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

async function populateViewDoctorDropdown() {
    const viewDoctorSelect = document.getElementById('view-doctor-name');
    viewDoctorSelect.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Doctor';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    viewDoctorSelect.appendChild(defaultOption);

    const token = localStorage.getItem('authToken');
    if (!token) {
        console.error('No authentication token found. User may not be logged in.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/docter/fetchalldoctors', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        });

        const doctors = await response.json();
       
        doctors.result.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.doctorName;
            option.textContent = doctor.doctorName;
            viewDoctorSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching doctors:', error);
        openModal('Error fetching doctors: ' + error.message);
    }
}



async function displayAvailableSlots() {
    const doctorName = document.getElementById('view-doctor-name').value; 
    const date = document.getElementById('view-date').value;
    const slotsList = document.getElementById('slots-list'); 
    slotsList.innerHTML = '';

    const token = localStorage.getItem('authToken');

    console.log('doctorName:', doctorName, 'date:', date);

    try {
        const queryParams = new URLSearchParams({
            doctorName: doctorName,
            date: date,
        });

        const response = await fetch(`http://localhost:3000/api/docter/view-slots?${queryParams.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        });

        const result = await response.json();

        if (!response.ok) {
            if (result.message === "No slots found for the doctor on this date") {
                openModal("No slots available on this date.");
                return;
            }
            throw new Error(`Error: ${response.status} - ${result.message}`);
        }

        const availableSlots = result.result;

        if (Array.isArray(availableSlots) && availableSlots.length > 0) {
            availableSlots.forEach(slot => {
                const listItem = document.createElement('li');
                listItem.classList.add('slot-item');

                if (slot.isAvailable) {
                    listItem.classList.add('slot-available');
                } else {
                    listItem.classList.add('slot-booked');
                }

                listItem.textContent = `Time: ${slot.startTime} - ${slot.endTime} (Available: ${slot.isAvailable ? 'Yes' : 'No'})`;

                listItem.addEventListener('click', () => {
                    console.log(`Booking ${doctorName} on ${date} from ${slot.startTime} to ${slot.endTime}`);
                });

                slotsList.appendChild(listItem); 
            });
        } else {
            openModal("No slots available on this date.");
        }

    } catch (error) {
        console.error('Error fetching available slots:', error);
        openModal('An error occurred while fetching slots: ' + error.message);
    }
}

async function displayAllAvailableSlots(date) {
    const token = localStorage.getItem('authToken');

    try {
        const response = await fetch(`http://localhost:3000/api/docter/viewAll-slots/${date}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        });

        const result = await response.json();
        const allSlotsList = document.getElementById('all-slots-list');
        allSlotsList.innerHTML = '';

        if (result.status === 'success') {
            result.result.forEach(doctor => {
                doctor.timeSlots.forEach(slot => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('slot-item');

                    if (slot.isAvailable) {
                        listItem.classList.add('slot-available');
                    } else {
                        listItem.classList.add('slot-booked');
                    }

                    listItem.textContent = `Doctor: ${doctor.doctorName}\nTime: ${slot.startTime} - ${slot.endTime}`;

                    allSlotsList.appendChild(listItem);
                });
            });
        } else {
            openModal(result.message);
        }
    } catch (error) {
        console.error('Error fetching all available slots:', error);
        openModal('Error fetching all available slots: ' + error.message);
    }
}


function displayLoggedInUsername() {
    const username = localStorage.getItem('loggedInUsername');
    if (username) {
        document.getElementById('logged-in-user').textContent = ` ${username}`;
    }
}



function setMinDateForDateInput() {
    const dateInput = document.getElementById('date'); 
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); 
    const yyyy = today.getFullYear();
    const minDate = yyyy + '-' + mm + '-' + dd; 
    dateInput.setAttribute('min', minDate); 
}