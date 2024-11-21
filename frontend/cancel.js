document.addEventListener('DOMContentLoaded', () => {
    displayLoggedInUsername();
    populateCancelDoctorDropdown();

    const cancelDateInput = document.getElementById('cancel-date');
    cancelDateInput.addEventListener('change', async () => {
        const selectedDate = cancelDateInput.value;
        await populateCancelDoctorDropdown(selectedDate);
        document.getElementById('cancel-available-slots').innerHTML = ''; 
    });

    const cancelDoctorSelect = document.getElementById('cancel-doctor-name');
    cancelDoctorSelect.addEventListener('change', async () => {
        const selectedDoctor = cancelDoctorSelect.value;
        await populateCancelSlotsDropdown(selectedDoctor, cancelDateInput.value);
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

    const cancelBookingForm = document.getElementById('cancel-booking-form');
    cancelBookingForm.addEventListener('submit', async (event) => {
        event.preventDefault();
    
        const selectedDoctor = document.getElementById('cancel-doctor-name').value;
        const selectedDate = document.getElementById('cancel-date').value;
        const selectedSlot = document.getElementById('cancel-available-slots').value; 
        const patientName = document.getElementById('cancel-user-name').value;
    
        try {
            const response = await fetch('http://localhost:3000/api/docter/cancel-slot', {
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
    
            if (!response.ok) {
                const errorData = await response.text(); 
                console.error('Error canceling booking:', errorData);
                openModal('Error canceling booking: ' + errorData); 
                return; 
            }
    
            const result = await response.json();
    
            if (response.ok) {
                openModal(result.message);
            } else {
                openModal(result.message);
            }
        } catch (error) {
            console.error('Error canceling booking:', error);
            openModal('An error occurred while canceling the booking. Please try again.');
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

async function populateCancelDoctorDropdown(selectedDate) {
    const cancelDoctorSelect = document.getElementById('cancel-doctor-name');
    cancelDoctorSelect.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Doctor';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    cancelDoctorSelect.appendChild(defaultOption);

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
                cancelDoctorSelect.appendChild(option);
            }
        });
    } catch (error) {
        console.error('Error fetching doctors:', error);
        openModal('Error fetching doctors: ' + error.message);
    }
}

async function populateCancelSlotsDropdown(doctorName, selectedDate) {
    const cancelSlotsSelect = document.getElementById('cancel-available-slots');
    cancelSlotsSelect.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a slot';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    cancelSlotsSelect.appendChild(defaultOption);

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
                if (!slot.isAvailable && slot.date === selectedDate) { 
                    const option = document.createElement('option');
                    option.value = `${slot.startTime}`; 
                    option.textContent = `${slot.startTime}:00 - ${slot.endTime}:00`;
                    cancelSlotsSelect.appendChild(option);
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
