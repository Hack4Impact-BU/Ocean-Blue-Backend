// routing
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const app = express();
var env = require('dotenv').config();
app.use(cors());
app.use(express.json());


// schemas
const User = require('./models/user');
const Event = require('./models/event');

// password encryption
const bcrypt = require('bcrypt');

// jwt token
const jwt = require("jsonwebtoken");

const PORT = process.env.PORT || 3000;

//connect to Azure Cosmos DB through mongoose
mongoose.connect("mongodb://"+process.env.COSMOSDB_HOST+":"+process.env.COSMOSDB_PORT+"/"+process.env.COSMOSDB_DBNAME+"?ssl=true&retrywrites=false&maxIdleTimeMS=120000&replicaSet=globaldb", {
   auth: {
     username: process.env.COSMOSDB_USER,
     password: process.env.COSMOSDB_PASSWORD
   }
});

// Default route
app.get("/", (req, res) => {
    res.send("Welcome To the Azure Backend Using Mongoose")
})

// Register route
app.post("/register", async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    User.find({email: req.body.email})
    .then(async (user) => {
        console.log(user)
        if (user.length == 0) {
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: password,
                birthday: req.body.birthday,
                points: req.body.points,
                animals: req.body.animals,
                eventsCreated: req.body.eventsCreated,
                eventsParticipated: req.body.eventsParticipated,
                phoneNumber: req.body.phoneNumber,
                description: req.body.description,
                admin: req.body.admin,
                crewLeader: req.body.crewLeder,
        
            });
        
            newUser.save()
            .then(user => {res.json(user)})
            .catch(err => {res.status(400).json("Error" + err)})
        } else {
            res.status(401).json("Invalid email.")
        }
    })

})


// Sign in route
app.post("/signin", async (req, res) => {
    User.find({email: req.body.email})
    .then(async (user) => {
        if (user.length !== 0) {
            const validPassword = await bcrypt.compare(req.body.password, user[0].password)
            if (validPassword) {
                const payload = { id: user.id, username: user.username, isAdmin: user.admin, isCrewLeader: user.crewLeader };
                res.json(jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN }));
            } else {
                res.status(401).json("Invalid password.")
            }
        } else {
            res.status(401).json("Invalid email.")
        }
    }).catch((e) => {console.log(e)})
})


// Find user
// TODO: add auth guard
const ObjectId = require('mongodb').ObjectId;

// Retreieve User
app.post("/retrieveUser", (req, res) => {
    console.log(req.body.username)
    User.find({"username" : (req.body.username)})
    .then((user) => {
        if (user.length !== 0) {
            res.json(user)
        } else {
            res.status(404).json("User not found.")
        }
    })
})

// Retrieve all Users
app.post("/retrieveUsers", (req, res) => {
    // Find all users
    const query = User.find({});

    // Select the username email and admin feilds
    query.select('username email admin');
    
    query.exec(function (err, users) {
        if (err) return handleError(err);
        res.json(users)
    });
})

// Set event
app.post("/setEvent", (req, res) => {
    const newEvent = new Event({
        eventCreator: req.body.eventCreator,
        date: req.body.date,
        description: req.body.description,
        address: req.body.address,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
    });

    newEvent.save()
    .then(user => {res.json(user)})
    .catch(err => {res.status(400).json("Error" + err)})
})

// Retrieve Event
app.post("/retrieveEvent", (req, res) => {
    Event.find({"eventCreator" :(req.body.eventCreator)})
    .then((event) => {
        if (event.length !== 0) {
            res.json(event)
        } else {
            res.status(404).json("Event not found.")
        }
    })
})

// Retrieve all Events
app.post("/retrieveEvents", (req, res) => {
    // Find all users
    const query = Event.find({});

    // Select the eventCreator description address and date feilds
    query.select('eventCreator description address date');
    
    query.exec(function (err, users) {
        if (err) return handleError(err);
        res.json(users)
    });
})

app.listen(PORT, () => console.log("Listening on port " + PORT));