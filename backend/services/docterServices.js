const docterSchema = require('../models/docter');
const patientSchema = require('../models/user');


const createTimeSlotServices = async (doctorName, date, startTime, endTime, intervalInHours) => {
    const timeSlots = [];
    let currentTime = startTime;

    const existingDoctorSchedule = await docterSchema.findOne({ doctorName, 'timeSlots.date': date });

    while (currentTime < endTime) {
        const endSlotTime = currentTime + intervalInHours;

        const slotExists = existingDoctorSchedule?.timeSlots.some(
            slot => slot.date === date && slot.startTime === currentTime && slot.endTime === endSlotTime
        );

        if (!slotExists) {
            timeSlots.push({
                startTime: currentTime,
                endTime: endSlotTime,
                date,
                isAvailable: true,
            });
        }

        currentTime = endSlotTime;
    }

    if (timeSlots.length > 0) {
        const doctorSchedule = await docterSchema.findOneAndUpdate(
            { doctorName },
            { $push: { timeSlots: { $each: timeSlots } } },
            { new: true, upsert: true }
        );

        return doctorSchedule;
    } else {
        throw new Error('No new time slots to add. All slots already exist.');
    }
};

const viewDoctorSlots = async (doctorName, date) => {
    const doctor = await docterSchema.findOne(
      { doctorName, 'timeSlots.date': date },
      { timeSlots: 1 }
    );
  
    if (!doctor) throw new Error('No slots found for the doctor on this date');
  
    const slotsForDate = doctor.timeSlots.filter(slot => slot.date === date);
    return slotsForDate;
};



  const getAllDoctors = async () => {
    try {
        console.log('Connected to MongoDB and querying for doctors...'); 

        const doctors = await docterSchema.find({});

        console.log('Fetched Doctors:', doctors); 

        if (!Array.isArray(doctors) || doctors.length === 0) {
            throw new Error('No doctors found');
        }
        
        return doctors;
    } catch (error) {
        console.error('Error fetching doctors:', error); 
        throw error; 
    }
};


const viewAllSlots = async (date) => {
    const doctors = await docterSchema.find(
        { 'timeSlots.date': date }, 
        { doctorName: 1, timeSlots: 1 } 
    );

    if (doctors.length === 0) {
        throw new Error('No slots found for the provided date');
    }

    const availableSlots = doctors.map(doctor => ({
        doctorName: doctor.doctorName,
        timeSlots: doctor.timeSlots.filter(slot => slot.date === date && slot.isAvailable) // Only include available slots
    }));

    return availableSlots.filter(doctor => doctor.timeSlots.length > 0);
};




const bookSlot = async (doctorName, date, startTime, patientName) => {
    const doctor = await docterSchema.findOne({ doctorName });

    if (!doctor) {
        throw new Error('Doctor not found');
    }

    const formattedStartTime = Number(startTime); 

    const slot = doctor.timeSlots.find(
        slot => slot.date === date && 
                slot.startTime === formattedStartTime && 
                slot.isAvailable
    );

    if (!slot) {
        throw new Error('Slot is either already booked or not available');
    }

    slot.isAvailable = false;
    slot.bookedBy = patientName;

    await doctor.save();

    return slot;  
};


const cancelSlot = async (doctorName, date, startTime, patientName) => {
    const doctor = await docterSchema.findOne({ doctorName });

    if (!doctor) {
        throw new Error('Doctor not found');
    }

    const numericStartTime = Number(startTime); 

    const slot = doctor.timeSlots.find(
        s => s.date === date && s.startTime === numericStartTime && !s.isAvailable && s.bookedBy === patientName
    );

    if (!slot) {
        throw new Error('No booking found for this slot or it has already been canceled.');
    }

    slot.isAvailable = true;
    slot.bookedBy = null; 

    await doctor.save(); 

    return slot;
};

const viewBookedAppointments = async (doctorName, date) => {

    if (!doctorName || !date) {
        throw new Error('Doctor name and date must be provided.');
    }

    const doctor = await docterSchema.findOne(
        { doctorName, 'timeSlots.date': date },
        { timeSlots: 1 }
    );


    if (!doctor) {
        throw new Error('Doctor not found or has no slots for the specified date.');
    }

    const bookedSlots = doctor.timeSlots.filter(slot => slot.date === date && !slot.isAvailable);


    if (bookedSlots.length === 0) {
        throw new Error('No booked slots found for this doctor on the specified date.');
    }

    return bookedSlots;
};



module.exports = {
  createTimeSlotServices,
  viewDoctorSlots,
  viewAllSlots,
  bookSlot,
  cancelSlot,
  viewBookedAppointments,
  getAllDoctors
};
