//imports ---------------------------------------------->
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");

//config ---------------------------------------------->
dotenv.config({ path: "./config.env" });

//database -------------------------------------------->
mongoose.set("strictQuery", false);
mongoose
    .connect(process.env.DB_URL, {
        useNewUrlParser: true,
    })
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((error) => {
        console.log(error);
    });

//server ---------------------------------------------->
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
