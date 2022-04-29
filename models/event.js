const mongoose = require('mongoose');

const eventSchema = {
    eventCreator: String,
    title: String,
    date: String,
    description: String,
    address: String,
    latitude: Number,
    longitude: Number,
    garbageCollected: Number,
    isPublic: Boolean,
    volunteers: Array,
    imageAzureURIs: Array
}

const Event = mongoose.model("Events", eventSchema);

module.exports = Event;