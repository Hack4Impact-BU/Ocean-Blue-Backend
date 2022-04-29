const mongoose = require('mongoose');

const userSchema = {
    username: String,
    email: String,
    password: String,
    birthday: String,
    points: Number,
    animals: Number,
    eventsCreated: Number,
    eventsParticipated: Number,
    phoneNumber: Number,
    description: String,
    admin: Boolean,
    crewLeader: Boolean,
    events: Array,
}

const User = mongoose.model("Users", userSchema);

module.exports = User;