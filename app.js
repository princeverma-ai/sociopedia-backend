//imports ----------------------------------------------------->
const express = require("express");
const cors = require("cors");
const compression = require("compression");

//routes imports ---------------------------------------------->
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const postRouter = require("./routes/postRouter");
const searchRouter = require("./routes/searchRouter");
const exploreRouter = require("./routes/exploreRouter");

//initialize app ---------------------------------------------->
const app = express();

//middleware -------------------------------------------------->
app.use(express.json());
app.use(compression());
app.use(
  cors({
    origin: "*",
  })
);

app.all("*", (req, res, next) => {
  //logging in relevant information about the request
  console.log(
    `Request received: ${req.method} ${req.protocol}://${req.get("host")}${
      req.originalUrl
    }`
  );
  next();
});

//routes ------------------------------------------------------>
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/search", searchRouter);
app.use("/explore", exploreRouter);

//Export app -------------------------------------------------->
module.exports = app;
