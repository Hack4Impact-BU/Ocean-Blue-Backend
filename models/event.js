const mongoose = require('mongoose');

const eventSchema = {
    eventCreator: String,
    date: String,
    description: String,
    address: String,
    latitude: Number,
    longitude: Number,
}

const Event = mongoose.model("Events", eventSchema);

module.exports = Event;