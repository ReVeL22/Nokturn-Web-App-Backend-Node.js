const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2,
        max: 15
    },
    lastName: {
        type: String,
        required: true,
        min: 2,
        max: 15
    },
    login: {
        type: String,
        required: true,
        min: 4,
        max: 20
    },
    email: {
        type: String,
        required: true,
        min: 4,
        max: 45
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    city: {
        type: String,
        required: true,
        min: 3,
        max: 15
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema)