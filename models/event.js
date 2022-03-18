const mongoose = require('mongoose');

const eventSchema = {
    eventCreator: String,
    date: String,
    description: String,
    address: String,
    latitude: Number,
    longitude: Number,
    garbageCollected: Number,
    isPublic: Boolean,
    volunteers: Array,
}

const Event = mongoose.model("Events", eventSchema);

module.exports = Event;