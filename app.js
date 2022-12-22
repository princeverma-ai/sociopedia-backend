//imports ----------------------------------------------------->
const express = require("express");
const cors = require("cors");

//routes imports ---------------------------------------------->
const authRouter = require("./routes/authRouter");

//initialize app ---------------------------------------------->
const app = express();

//middleware -------------------------------------------------->
app.use(express.json());
app.use(cors());

//routes ------------------------------------------------------>
app.use("/auth", authRouter);

//Export app -------------------------------------------------->
module.exports = app;
