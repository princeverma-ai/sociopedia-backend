//imports ---------------------------------------------->
const dotenv = require("dotenv");
const app = require("./app");

//config ---------------------------------------------->
dotenv.config({ path: "./config.env" });

//server ---------------------------------------------->
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
