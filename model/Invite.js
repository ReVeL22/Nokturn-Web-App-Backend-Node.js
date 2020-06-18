const mongoose = require('mongoose');

const InviteSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
        min: 5,
        max: 1024
    },
    endUserId: {
        type: String,
        required: true,
        min: 2,
        max: 1024
    },
    name: {
        type: String,
        required: true,
        min: 1,
        max: 25
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Invite', InviteSchema);