const doctorService = require('../services/docterServices');

exports.createTimeSlots = async (req, res) => {
  const { doctorName, date, startTime, endTime, intervalInHours } = req.body;

  try {
    const slots = await doctorService.createTimeSlotServices(doctorName, date, startTime, endTime, intervalInHours);
    return res.status(201).json({
      result: slots,
      message: 'Time slots created successfully',
      status: 'success',
      responseCode: 201,
    });
  } catch (err) {
    return res.status(400).json({
      result: {},
      message: err.message,
      status: 'error',
      responseCode: 400,
    });
  }
};

exports.viewDoctorSlots = async (req, res) => {
  const { doctorName, date } = req.query;
  console.log(doctorName)

  try {
    const slots = await doctorService.viewDoctorSlots(doctorName, date);
    return res.status(200).json({
      result: slots,
      message: 'Slots fetched successfully',
      status: 'success',
      responseCode: 200,
    });
  } catch (err) {
    return res.status(400).json({
      result: {},
      message: err.message,
      status: 'error',
      responseCode: 400,
    });
  }
};

exports.bookSlot = async (req, res) => {
  const { doctorName, date, startTime, patientName } = req.body;

  try {
    const slot = await doctorService.bookSlot(doctorName, date, startTime, patientName);
    return res.status(200).json({
      result: slot,
      message: 'Slot booked successfully',
      status: 'success',
      responseCode: 200,
    });
  } catch (err) {
    return res.status(400).json({
      result: {},
      message: err.message,
      status: 'error',
      responseCode: 400,
    });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctorService.getAllDoctors();
    return res.status(200).json({
      result: doctors,
      message: 'Doctors fetched successfully',
      status: 'success',
      responseCode: 200,
    });
  } catch (err) {
    return res.status(400).json({
      result: {},
      message: err.message,
      status: 'error',
      responseCode: 400,
    });
  }
};

exports.viewAllSlots = async (req, res) => {
  const { date } = req.params;  

  try {
      const slots = await doctorService.viewAllSlots(date); 
      return res.status(200).json({
          result: slots,
          message: 'All slots for the date fetched successfully',
          status: 'success',
          responseCode: 200,
      });
  } catch (err) {
      return res.status(400).json({
          result: {},
          message: err.message,
          status: 'error',
          responseCode: 400,
      });
  }
};




exports.cancelSlot = async (req, res) => {
    const { doctorName, date, startTime, patientName } = req.body;
  
    try {
      const result = await doctorService.cancelSlot(doctorName, date, startTime, patientName);
      return res.status(200).json({
        result,
        message: 'Slot cancelled successfully',
        status: 'success',
        responseCode: 200,
      });
    } catch (err) {
      return res.status(400).json({
        result: {},
        message: err.message,
        status: 'error',
        responseCode: 400,
      });
    }
  };



exports.viewBookedAppointments = async (req, res) => {
    const { doctorName, date } = req.body; 

    console.log('Received request to view booked appointments:', { doctorName, date });

    try {
        const bookedSlots = await doctorService.viewBookedAppointments(doctorName, date);
        return res.status(200).json({
            result: bookedSlots,
            message: 'Booked slots for the doctor fetched successfully',
            status: 'success',
            responseCode: 200,
        });
    } catch (err) {
        console.error('Error fetching booked appointments:', err.message);
        
        return res.status(400).json({
            result: {},
            message: err.message,
            status: 'error',
            responseCode: 400,
        });
    }
};