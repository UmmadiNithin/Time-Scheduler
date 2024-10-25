
document.addEventListener('DOMContentLoaded', () => {
    populateViewDoctorDropdown();
    displayLoggedInUsername();
    populateViewDoctorSlotsDropdown();


    const dateInput = document.getElementById('calendar-date');
    dateInput.addEventListener('change', async () => {
        const selectedDate = dateInput.value;
        await populateViewDoctorDropdown(selectedDate);
        document.getElementById('book-available-slots').innerHTML = ''; 
    });

    const viewDoctorSelect = document.getElementById('book-doctor-name');
    viewDoctorSelect.addEventListener('change', async () => {
        const selectedDoctor = viewDoctorSelect.value;
        await populateViewDoctorSlotsDropdown(selectedDoctor);
    });



    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
            window.location.href = 'home.html';
        });
    }

    const bookSlotForm = document.getElementById('book-slot-form');
    bookSlotForm.addEventListener('submit', async (event) => {
        event.preventDefault();
    
        const selectedDoctor = document.getElementById('book-doctor-name').value;
        const selectedDate = document.getElementById('calendar-date').value;
        const selectedSlot = document.getElementById('book-available-slots').value; // startTime
        const patientName = document.getElementById('user-name').value;
    
        try {
            const response = await fetch('http://localhost:3000/api/docter/book-slot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify({
                    doctorName: selectedDoctor, 
                    date: selectedDate,
                    startTime: selectedSlot,
                    patientName: patientName,
                }),
            });
    
            const result = await response.json();
    
            if (response.ok) {
                openModal(result.message);
            } else {
                openModal(result.message);
            }
        } catch (error) {
            console.error('Error booking slot:', error);
            openModal('An error occurred while booking the slot. Please try again.');
        }
    });
    
    
});

const modal = document.getElementById("myModal");
const closeBtn = document.getElementById("closeModalBtn");

const openModal = (text) => {
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

async function populateViewDoctorDropdown(selectedDate) {
    const viewDoctorSelect = document.getElementById('book-doctor-name');
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
        console.log(doctors.result);
       
        doctors.result.forEach(doctor => {
            const availableSlots = doctor.timeSlots.filter(slot => 
                slot.isAvailable && slot.date === selectedDate 
            );
            
            if (availableSlots.length > 0) {
                const option = document.createElement('option');
                option.value = doctor.doctorName; 
                option.textContent = doctor.doctorName;
                viewDoctorSelect.appendChild(option);
            }
        });
    } catch (error) {
        console.error('Error fetching doctors:', error);
        openModal('Error fetching doctors: ' + error.message);
    }
}


async function populateViewDoctorSlotsDropdown(doctorName) {
    const viewDoctorslotsSelect = document.getElementById('book-available-slots');
    viewDoctorslotsSelect.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a slot';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    viewDoctorslotsSelect.appendChild(defaultOption);

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
        console.log(doctors.result);

        const selectedDoctor = doctors.result.find(doc => doc.doctorName === doctorName);
        if (selectedDoctor) {
            selectedDoctor.timeSlots.forEach(slot => {
                if (slot.isAvailable) { 
                    const option = document.createElement('option');
                    option.value = `${slot.startTime}`; // Just use the startTime
                    option.textContent = `${slot.startTime}:00 - ${slot.endTime}:00`;
                    viewDoctorslotsSelect.appendChild(option);
                }
            });
        }
    } catch (error) {
        console.error('Error fetching doctors:', error);
        openModal('Error fetching doctors: ' + error.message);
    }
}



function displayLoggedInUsername() {
    const username = localStorage.getItem('loggedInUsername'); 
    if (username) {
        document.getElementById('logged-in-user').textContent = ` ${username}`;
    }
}
