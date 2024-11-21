const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
 name: {
        type: String,
        required: true,
    },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { 
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum:['patient','doctor'],
    default: 'patient',  
},

  isAdmin: {
    type: Boolean,
    default: false,
},

  created_at: {
    type: Date,
    default: Date.now, 
  },

  Created_By: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: false,
  },

});


patientSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});
module.exports = mongoose.model('User', patientSchema);