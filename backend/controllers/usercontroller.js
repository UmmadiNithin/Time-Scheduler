const userService = require('../services/userservices');

exports.signupUser = async (req, res) => {
  const { name, email, password, confirmPassword,role } = req.body;

  try {
    const user = await userService.signupUser(name, email, password, confirmPassword,role);
    console.log({ name, email, password, confirmPassword,role })
    return res.status(201).json({
      result: user,
      message: 'User signed up successfully',
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

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { token, isAdmin ,name, role} = await userService.loginUser(email, password);
    console.log('Generated Token:', token); 

    return res.status(200).json({
      result: { token, isAdmin ,name,role},
      message: 'Logged in successfully',
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
