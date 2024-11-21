const Joi = require('joi');

const signupSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please enter a valid email address',
        'string.empty': 'Email cannot be empty',
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.empty': 'Password cannot be empty',
        'any.required': 'Password is required'
    }),
    confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
        'any.only': 'Confirm password must match the password',
        'any.required': 'Confirm password is required'
    }),
    role: Joi.string().valid('Patient', 'Doctor').default('Patient').messages({
        'any.only': 'Role must be either Patient or Doctor',
      })
});


const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please enter a valid email address',
        'string.empty': 'Email cannot be empty',
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.empty': 'Password cannot be empty',
        'any.required': 'Password is required'
    })
});



const createSlotSchema = Joi.object({
    doctorName: Joi.string().required().messages({
      'string.empty': 'Doctor name is required',
      'any.required': 'Doctor name is required',
    }),
    date: Joi.string().required().messages({
      'string.empty': 'Date is required',
      'any.required': 'Date is required',
    }),
    startTime: Joi.number().integer().min(0).max(23).required().messages({
      'number.base': 'Start time must be a valid number between 0 and 23',
      'any.required': 'Start time is required',
    }),
    endTime: Joi.number().integer().min(1).max(24).greater(Joi.ref('startTime')).required().messages({
      'number.base': 'End time must be a valid number between 1 and 24',
      'any.required': 'End time is required',
      'number.greater': 'End time must be greater than start time',
    }),
    intervalInHours: Joi.number().integer().min(1).max(24).required().messages({
      'number.base': 'Interval must be a valid number',
      'any.required': 'Interval is required',
    })
  });
  
  const viewDoctorSlotsSchema = Joi.object({
    doctorName: Joi.string().required().messages({
      'string.empty': 'Doctor name is required',
      'any.required': 'Doctor name is required',
    }),
    date: Joi.string().required().messages({
      'string.empty': 'Date is required',
      'any.required': 'Date is required',
    })
  });
  
  const viewAllSlotsSchema = Joi.object({
    date: Joi.string().required().messages({
      'string.empty': 'Date is required',
      'any.required': 'Date is required',
    })
  });
  
  const bookSlotSchema = Joi.object({
    doctorName: Joi.string().required().messages({
      'string.empty': 'Doctor name is required',
      'any.required': 'Doctor name is required',
    }),
    date: Joi.string().required().messages({
      'string.empty': 'Date is required',
      'any.required': 'Date is required',
    }),
    startTime: Joi.string().required().messages({
      'string.empty': 'Time slot is required',
      'any.required': 'Time slot is required',
    }),
    patientName: Joi.string().required().messages({
      'string.empty': 'Patient name is required',
      'any.required': 'Patient name is required',
    })
  });

  const cancelSlotSchema = Joi.object({
    doctorName: Joi.string().required().messages({
      'string.empty': 'Doctor name is required',
      'any.required': 'Doctor name is required',
    }),
    date: Joi.string().required().messages({
      'string.empty': 'Date is required',
      'any.required': 'Date is required',
    }),
    startTime: Joi.string().required().messages({
      'string.empty': 'Time slot is required',
      'any.required': 'Time slot is required',
    }),
    patientName: Joi.string().required().messages({
      'string.empty': 'Patient name is required',
      'any.required': 'Patient name is required',
    })
  });





module.exports = {
    signupSchema,
    loginSchema,
    bookSlotSchema,
    viewAllSlotsSchema,
    viewDoctorSlotsSchema,
    createSlotSchema,
    cancelSlotSchema
   
};
