const express = require('express');
const {
  createTimeSlots,
  viewDoctorSlots,
  viewAllSlots,
  bookSlot,
  cancelSlot,
  viewBookedAppointments,
  getAllDoctors
} = require('../controllers/docterController');
const authenticateToken = require('../middlewares/authMiddleware');

const validationMiddleware = require('../middlewares/validationMiddleware');


const router = express.Router();

router.post('/create-slots',authenticateToken,validationMiddleware, createTimeSlots);

router.get('/view-slots', authenticateToken, validationMiddleware, viewDoctorSlots);

router.get('/viewAll-slots/:date',authenticateToken,validationMiddleware, viewAllSlots);

router.post('/book-slot', authenticateToken,validationMiddleware,bookSlot);
router.post('/cancel-slot', authenticateToken, validationMiddleware, cancelSlot);
router.post('/booked-appointments', authenticateToken, viewBookedAppointments);
router.get('/fetchalldoctors', authenticateToken, getAllDoctors);


module.exports = router;
