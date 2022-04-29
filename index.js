// Initialization.
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const axios = require("axios");
const app = express();
var env = require('dotenv').config();
app.use(cors());
app.use(express.json());

// API Keys.
const GEOAPIFY_KEY = process.env.GEOAPIFY_KEY;


// schemas
const User = require('./models/user');
const Event = require('./models/event');
const ObjectId = require('mongodb').ObjectId;

// password encryption
const bcrypt = require('bcrypt');

// jwt token
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth")

const PORT = process.env.PORT || 3000;

//connect to Azure Cosmos DB through mongoose
const URI = `mongodb://${process.env.COSMOSDB_HOST}:${process.env.COSMOSDB_PORT}/${process.env.COSMOSDB_DBNAME}?ssl=true&retrywrites=false&maxIdleTimeMS=120000&replicaSet=globaldb`;
mongoose.connect(URI, {
   auth: {
     username: process.env.COSMOSDB_USER,
     password: process.env.COSMOSDB_PASSWORD
   }
});

// Routing.
const blob = require("./blob");

// Default route
app.get("/", (req, res) => {
    res.send("Welcome To the Azure Backend Using Mongoose")
})

//////////////////
///// USERS //////
//////////////////

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
                points: 0,
                animals: 0,
                eventsCreated: 0,
                eventsParticipated: 0,
                phoneNumber: req.body.phoneNumber,
                description: req.body.description,
                admin: false,
                crewLeader: false,
                events: []
            });
        
            newUser.save()
            .then(user => {
                const payload = { id: user.id, username: user.username, isAdmin: user.admin, isCrewLeader: user.crewLeader };
                res.json(jwt.sign(payload, process.env.JWT_SECRET));
            })

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
                console.log(user)
                const payload = { id: user[0].id, username: user[0].username, isAdmin: user[0].admin, isCrewLeader: user[0].crewLeader };
                res.json(jwt.sign(payload, process.env.JWT_SECRET));
            } else {
                res.status(401).json("Invalid password.")
            }
        } else {
            res.status(401).json("Invalid email.")
        }
    }).catch((e) => {console.log(e)})
})

// Retreieve User by Username
app.get("/retrieveUser", auth, (req, res) => {
    User.find({"username" : (req.headers.username)})
    .then((user) => {
        if (user.length !== 0) {
            res.json(user)
        } else {
            res.status(404).json("User not found.")
        }
    })
})

// Retrieve User by ID
app.get("/retrieveUserID", auth, (req, res) => {
    User.find({"_id" : ObjectId(req.headers.id)})
    .then((user) => {
        if (user.length !== 0) {
            res.json(user)
        } else {
            res.status(404).json("User not found.")
        }
    })
})

// Retrieve all Users
app.get("/retrieveUsers", auth, (req, res) => {
    // Find all users
    const query = User.find({});

    // Select the username email and admin feilds
    query.select('username email admin');
    
    query.exec(function (err, users) {
        if (err) return handleError(err);
        res.json(users)
    });
})

// Update user
app.put("/updateUser", auth, (req, res) => {
    User.updateOne({"_id": ObjectId(req.headers.id)}, {
        $set: {
            crewLeader: req.headers.crewleader,
            admin: req.headers.admin,
        }, $inc: {
            points: req.headers.points,
        }
    }).then((val) => {
        res.json(val)
    }).catch(e => {
        res.status(404).json("Could not update")
    })
})

app.get("/getCurrentUser", auth, (req, res) => {
    res.json(req.user)
})

//////////////////
//// EVENTS //////
//////////////////

// Set event
app.post("/createEvent", auth, (req, res) => {
    const newEvent = new Event({
        eventCreator: req.user.id,
        title: req.body.title,
        date: req.body.date,
        description: req.body.description,
        address: req.body.address,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        garbageCollected: 0,
        isPublic: req.body.isPublic,
        volunteers: [],
        imageAzureURIs: req.body.imageAzureURIs
    });

    newEvent.save()
    .then(event => {res.json(event)})
    .catch(err => {res.status(400).json("Error" + err)})
})

// Retrieve Event
app.get("/retrieveEvent", auth, (req, res) => {
    Event.find({"_id" : ObjectId(req.headers.id)})
    .then((event) => {
        if (event.length !== 0) {
            res.json(event)
        } else {
            res.status(404).json("Event not found.")
        }
    })
})

// Retrieve all Events
app.get("/retrieveEvents", auth, (req, res) => {
    // Find all users
    const query = Event.find({});

    // Select the eventCreator description address and date fields
    query.select('eventCreator description address date latitude longitude volunteers');

    query.exec(function (err, users) {
        if (err) return handleError(err);
        res.json(users)
    });
})

// Add to event
app.put("/addToEvent", auth, (req, res) => {
    Event.updateOne({"_id": ObjectId(req.headers.eventid)}, {
        $push: {
            volunteers: [[req.headers.userid, req.headers.username]]
        }
    }).then((val) => {
        User.updateOne({"_id": ObjectId(req.headers.userid)}, {
            $push: {
                events: [req.headers.eventid]
            }
        }).then((response) => {
            res.json(response)
        })
    }).catch(e => {
        res.status("404").json("Could not add to event")
    })

})

// Delete event
app.delete("/deleteEvent", auth, (req, res) => {
    Event.deleteOne({"_id": ObjectId(req.headers.id)})
    .then(val => {res.json(val)})
    .catch(e => {res.status(404).json("Could not delete")})
})


// Query GEOAPIFY for event address field.
app.post("/geoapify", (req, res) => {
    const formattedAddress = req.body.formattedAddress;

    axios.get("https://api.geoapify.com/v1/geocode/autocomplete?text=" + formattedAddress + "&format=json&apiKey=" + GEOAPIFY_KEY)
        .then(response => {
            const results = response.data.results;
            res.send(results);
        })
})

//////////////////////////////
//// AZURE BLOB STORAGE //////
//////////////////////////////
app.use("/blob", blob);

app.listen(PORT, () => console.log("Listening on port " + PORT));
