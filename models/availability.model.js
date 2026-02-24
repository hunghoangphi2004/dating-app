const mongoose = require("mongoose");

const AvailabilitySchema = new mongoose.Schema(
{
    matchId: {
        type: String,
        required: true,
        index: true
    },

    userId: {
        type: String,
        required: true,
        index: true
    },

    date: {
        type: Date,
        required: true
    },

    start: {
        type: String, // "18:00"
        required: true
    },

    end: {
        type: String, // "21:00"
        required: true
    },

    deleted: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Availability", AvailabilitySchema, "availabilities");