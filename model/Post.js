const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    userId: {
        type: String,
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
    email: {
        type: String,
        required: true,
        min: 4,
        max: 45
    },
    city: {
        type: String,
        required: true,
        min: 3,
        max: 15
    },
    instruments: {
        type: Array,
        required: true,
        min: 0,
        max: 10
    },
    band: {
        type: Array,
        required: true,
        min: 0,
        max: 10
    },
    about: {
        type: String,
        required: true,
        min: 0,
        max: 150
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Post', PostSchema);