const express = require('express');
const { 
  signupUser, 
  loginUser, 

} = require('../controllers/usercontroller');
const validationMiddleware = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post('/signup', validationMiddleware, signupUser);
router.post('/login', validationMiddleware, loginUser);


module.exports = router;
