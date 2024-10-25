const mongoose = require('mongoose');

const docterSchema = new mongoose.Schema({
    doctorName: {
        type: String,  
        required: true,
    },
    timeSlots: [{
        startTime: {
            type: Number,  
            required: true,
        },
        endTime: {
            type: Number, 
            required: true,
        },
        date: {
            type: String, 
            required: true,
        },
        isAvailable: {
            type: Boolean,
            default: true,  
        },
        bookedBy: {
            type: String,  
            required: false,
        }
    }]
});

module.exports = mongoose.model('Schedule', docterSchema);
