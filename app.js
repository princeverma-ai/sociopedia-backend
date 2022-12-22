//imports ----------------------------------------------------->
const express = require("express");
const cors = require("cors");

//initialize app ---------------------------------------------->
const app = express();

//middleware -------------------------------------------------->
app.use(express.json());
app.use(cors());

//routes ------------------------------------------------------>
app.route("/").get((req, res) => {
    res.send("Hello World");
});

//Export app -------------------------------------------------->
module.exports = app;
