document.addEventListener('DOMContentLoaded', () => {
    displayLoggedInUsername();

    document.getElementById('view-all-slots-btn').addEventListener('click', () => {
        const selectedDate = document.getElementById('view-all-date').value;
        if (selectedDate) {
            displayAllAvailableSlots(selectedDate);
        } else {
            alert("Please select a date.");
        }
    })


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
        const usernameDisplay = document.getElementById('username-display');
        usernameDisplay.textContent = loggedInUsername || 'Anonymous';
    }

    document.getElementById('logout-btn').addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('loggedInUsername'); 
        window.location.href = 'home.html';
    });
});
