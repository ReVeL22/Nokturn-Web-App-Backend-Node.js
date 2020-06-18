const mongoose = require('mongoose');

const TourSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
        min: 5,
        max: 1024
    },
    city: {
        type: String,
        required: true,
        min: 2,
        max: 15
    },
    eventDate: {
        type: Date,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Tour', TourSchema);