//imports ----------------------------------------------------->
const express = require("express");
const cors = require("cors");

//routes imports ---------------------------------------------->
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");

//initialize app ---------------------------------------------->
const app = express();

//middleware -------------------------------------------------->
app.use(express.json());
app.use(cors());

//routes ------------------------------------------------------>
app.use("/auth", authRouter);
app.use("/user", userRouter);

//Export app -------------------------------------------------->
module.exports = app;
