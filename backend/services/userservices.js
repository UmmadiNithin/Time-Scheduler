const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const patientSchema = require('../models/user');

const userService = {
  async signupUser(name, email, password, confirmPassword,role) {
    try {
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      const existingUser = await patientSchema.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await patientSchema.create({ name, email, password: hashedPassword ,role});
      return user;
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  },

  async loginUser(email, password) {
    try {
      const user = await patientSchema.findOne({ email });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new Error('Invalid email or password');
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role,name: user.name },
        process.env.JWT_SECRET || 'secretkey',
        { expiresIn: '12h' }
      );
      console.log('Generated Token:', token);

      return { token, isAdmin: user.isAdmin, name: user.name, role: user.role }; 
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  },
};

module.exports = userService;
