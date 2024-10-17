const fs = require('fs').promises 
const path = './doctors_schedule.json'

const loadSchedule = async () => {
    try {
        const data = await fs.readFile(path, 'utf8')
        return JSON.parse(data)
    } catch (error) {
        console.log('Schedule file does not exist. Creating a new one...')
        await saveSchedule({})
        return {}
    }
}

const saveSchedule = async (schedule) => {
    await fs.writeFile(path, JSON.stringify(schedule, null, 2));
    console.log('Schedule successfully updated.')
}

const createTimeSlotsWithInterval = async (doctorName, startHour, endHour, interval) => {
    if (startHour < 0 || startHour >= 24 || endHour <= 0 || endHour > 24) {
        console.log('Invalid start or end hour. Please ensure they are within a 24-hour format.');
        return
    }

    if (startHour >= endHour) {
        console.log('Start hour must be less than end hour.');
        return
    }

    const schedule = await loadSchedule()
    let doctor = schedule[doctorName];

    if (!doctor) {
        doctor = []
        schedule[doctorName] = doctor
    }

    for (let hour = startHour; hour < endHour; hour += interval) {
        const startTime = `${hour.toString().padStart(2, '0')}:00`;
        const endTime = `${(hour + interval).toString().padStart(2, '0')}:00`;

        if (hour + interval > 24) {
            console.log(`Cannot create slot from ${startTime} to ${endTime} as it exceeds 24:00.`);
            break
        }

        doctor.push({
            startTime: startTime,
            endTime: endTime,
            isAvailable: true
        });
        console.log(`New time slot from ${startTime} to ${endTime} added for ${doctorName}.`);
    }

    await saveSchedule(schedule);
}

const availableSlots = async (doctorName) => {
    const schedule = await loadSchedule()
    const doctor = schedule[doctorName]

    if (!doctor) {
        console.log(`Doctor ${doctorName} not found.`);
        return;
    }

    const availableSlots = doctor.filter(slot => slot.isAvailable);
    if (availableSlots.length === 0) {
        console.log(`No available slots for ${doctorName}.`);
    } else {
        console.log(`Available slots for ${doctorName}:`);
        availableSlots.forEach((slot) => {
            console.log(`${slot.startTime} to ${slot.endTime}`);
        });
    }
}

const bookDoctorSlot = async (doctorName, timeSlot, userName, date) => {
    const today = new Date();
    const selectedDate = new Date(date);

    if (selectedDate < today.setHours(0, 0, 0, 0)) {
        console.log('Cannot book a slot in the past. Please choose today or a future date.');
        return
    }

    const schedule = await loadSchedule();
    const doctor = schedule[doctorName];

    if (!doctor) {
        console.log(`Doctor ${doctorName} not found.`);
        return;
    }

    const slot = doctor.find(slot =>
        slot.startTime === timeSlot.startTime && slot.endTime === timeSlot.endTime
    );

    if (slot && slot.isAvailable) {
        slot.isAvailable = false;
        slot.bookedBy = userName;
        slot.bookingDate = date;
        console.log(`${userName} successfully booked a slot with ${doctorName} from ${slot.startTime} to ${slot.endTime} on ${date}.`);
    } else {
        console.log('Time slot is not available for booking.');
    }

    await saveSchedule(schedule);
}

const cancelBooking = async (doctorName, timeSlot, userName, date) => {
    const today = new Date();
    const selectedDate = new Date(date);

    if (selectedDate < today.setHours(0, 0, 0, 0)) {
        console.log('Cannot cancel a booking in the past. Please choose today or a future date.');
        return;
    }

    const schedule = await loadSchedule();
    const doctor = schedule[doctorName];

    if (!doctor) {
        console.log(`Doctor ${doctorName} not found.`);
        return;
    }

    const slot = doctor.find(
        (slot) =>
            slot.startTime === timeSlot.startTime &&
            slot.endTime === timeSlot.endTime &&
            slot.bookedBy === userName
    );

    if (slot && !slot.isAvailable) {
        slot.isAvailable = true;
        delete slot.bookedBy;
        delete slot.bookingDate;
        console.log(`${userName} successfully cancelled the booking for ${doctorName} from ${slot.startTime} to ${slot.endTime} on ${date}.`);
    } else {
        console.log('No booking found for the given time slot.');
    }

    await saveSchedule(schedule)
}


// createTimeSlotsWithInterval("Dr. Nithin", 10, 18, 1)
// availableSlots("Dr. Nithin")
// bookDoctorSlot("Dr. Nithin", { startTime: "10:00", endTime: "11:00" }, "deepak", "2024-10-16")
// cancelBooking("Dr. Nithin", { startTime: "10:00", endTime: "11:00" }, "deepak", "2024-10-16")
