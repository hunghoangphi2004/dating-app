const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema(
    {
        userAId: { type: String, required: true },
        userBId: { type: String, required: true },

        actionA: {
            type: String,
            enum: ["like", "dislike", null],
            default: null
        },

        actionB: {
            type: String,
            enum: ["like", "dislike", null],
            default: null
        },

        actionAAt: Date,
        actionBAt: Date,

        matchedAt: Date,

        status: {
            type: String,
            enum: ["pending", "matched", "scheduled", "rejected"],
            default: "pending"
        },

        scheduledDate: String,
        scheduledStart: String,
        scheduledEnd: String,
        deleted: {
            type: Boolean,
            default: false
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Match", MatchSchema, 'matchs');