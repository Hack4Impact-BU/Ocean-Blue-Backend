// routing
const express = require('express')
const cors = require("cors");
const app = express();
<<<<<<< Updated upstream
app.use(cors())
app.use(express.json())
=======
require('dotenv').config();
app.use(cors())
app.use(express.json())
// password encryption
const bcrypt = require('bcrypt');
// jwt token
const jwt = require("jsonwebtoken");

>>>>>>> Stashed changes
const PORT = process.env.PORT || 3000;
//imports

<<<<<<< Updated upstream
//routes
app.get("/", (req, res) => {
    res.send("Welcome Ocean Blue engineers!")
})

app.listen(PORT, () => console.log("Listening on port " + PORT));