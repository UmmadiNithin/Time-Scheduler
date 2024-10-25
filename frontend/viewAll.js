document.addEventListener('DOMContentLoaded', () => {
    displayLoggedInUsername();

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('authToken');
            localStorage.removeItem('loggedInUsername');
            window.location.href = 'home.html';
        });
    }

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
    }
}

window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

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

                    listItem.textContent = `Doctor: ${doctor.doctorName} - Time: ${slot.startTime} - ${slot.endTime}`;
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
