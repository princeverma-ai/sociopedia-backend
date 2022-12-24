//imports ----------------------------------------------------->
const express = require("express");
const cors = require("cors");

//routes imports ---------------------------------------------->
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const postRouter = require("./routes/postRouter");

//initialize app ---------------------------------------------->
const app = express();

//middleware -------------------------------------------------->
app.use(express.json());
app.use(cors());

//routes ------------------------------------------------------>
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/post", postRouter);

//Export app -------------------------------------------------->
module.exports = app;
