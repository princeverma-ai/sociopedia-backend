//imports ---------------------------------------------->
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");
const sockerHandler = require("./socketHandler");

//config  settings------------------------------------------->
dotenv.config({ path: "./config.env" });

//database -------------------------------------------->
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DB_URL_CLOUD, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Database connected successfully");
    //server ---------------------------------------------->
    const port = process.env.PORT || 8000;
    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    //socket ---------------------------------------------->
    sockerHandler.initializeSocketServer(server);
  })
  .catch((error) => {
    console.log(error);
  });
