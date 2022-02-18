// routing
const express = require('express')
const cors = require("cors");
const app = express();
require('dotenv').config();
app.use(cors())
app.use(express.json())
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

////////////////
// SCHEMAS /////
////////////////

const userSchema = {
    username: String,
    email: String,
    password: String,
}

const User = mongoose.model("Users", userSchema);




// Default route

app.get("/", (req, res) => {
    res.send("Welcome To the Azure Backend Using Mongoose")
})

// Register route
// TODO: see if there is a duplicate email or username

app.post("/register", async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: password
    });

    newUser.save()
    .then(user => {res.json(user)})
    .catch(err => {res.status(400).json("Error" + err)})
})

// Sign in route

app.post("/signin", async (req, res) => {
    User.find({username: req.body.username})
    .then(async (user) => {
        if (user.length !== 0) {
            const validPassword = await bcrypt.compare(req.body.password, user[0].password)
            if (validPassword){
                // TODO: Send JWT token
                res.send("User found, log them in!")
            } else {
                res.send("Wrong password!")
            }
        } else {
            res.send("No user with username found!")
        }
    }).catch((e) => {console.log(e)})
})

app.listen(PORT, () => console.log("Listening on port " + PORT));