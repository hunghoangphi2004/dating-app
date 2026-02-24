const mongoose = require('mongoose');
const generate = require("../helpers/generate.helper")

const UserSchema = new mongoose.Schema(
    {
        name: String,
        age: Number,
        email: String,
        password: String,
        gender: String,
        bio: String,
        avatar: {
            type: String,
            default: "https://res.cloudinary.com/dblcbne27/image/upload/v1771824143/avatar-default_mvtnhx.jpg"
        },
        token: {
            type: String,
            default: () => generate.generateRandomString(20)
        },
        status: {
            type: String,
            default: "active"
        },
        deleted: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true
    }
)

const User = mongoose.model('User', UserSchema, 'users')

module.exports = User;