const doctors = {
    doctor1: { name: "Doctor 1", slot: "10:00 to 11:00", booked: false, patient: null, bookingTime: null },
    doctor2: { name: "Doctor 2", slot: "11:00 to 12:00", booked: false, patient: null, bookingTime: null },
    doctor3: { name: "Doctor 3", slot: "12:00 to 1:00", booked: false, patient: null, bookingTime: null }
}

function createJsonResponse(message, doctor, patient = null, bookedOverride = null) {
    const response = {
        message: message,
        doctor: {
            name: doctor.name,
            slot: doctor.slot,
            booked: bookedOverride !== null ? bookedOverride : doctor.booked,
            bookingTime: doctor.bookingTime 
        }
    }
    if (patient) {
        response.patient = patient
    }
    return JSON.stringify(response, null, 4)
}

function bookingAppointment(doctorName, patientName) {
    if (doctors[doctorName]) {
        const doctor = doctors[doctorName]
        if (!doctor.booked) {
            doctor.booked = true
            doctor.patient = patientName 
            doctor.bookingTime = new Date().toLocaleString()
            console.log(createJsonResponse(`Success: ${patientName} has booked the slot.`, doctor, patientName))
        } else {
            console.log(createJsonResponse(`Failed: ${doctor.name} is not available.`, doctor, null, false))
        }
    } else {
        console.log(JSON.stringify({ error: `No doctor found with name ${doctorName}` }, null, 4))
    }
}

function listDoctors() {
    const doctorNames = Object.values(doctors).map(doctor => doctor.name)
    const doctorCount = doctorNames.length
    return {
        names: doctorNames,
        count: doctorCount
    }
}

bookingAppointment("doctor1", "nithin")
bookingAppointment("doctor1", "deepak")

bookingAppointment("doctor2", "basha")
bookingAppointment("doctor2", "saleem")

bookingAppointment("doctor1", "dharani")

const { names, count } = listDoctors()
console.log(`Doctors Names: ${names.join(', ')}`)
console.log(`Total number of doctors Available: ${count}`)
