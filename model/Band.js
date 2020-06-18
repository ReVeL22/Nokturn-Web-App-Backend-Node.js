const mongoose = require('mongoose');

const BandSchema = mongoose.Schema({
    usersId: {
        type: Array,
        required: true,
        min: 5,
        max: 1024
    },
    name: {
        type: String,
        required: true,
        min: 2,
        max: 15
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Band', BandSchema);