const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const bodyParser = require("body-parser");
var responseTime = require("response-time");
const sdc = require("./statsdclient");
require("./stopwatch");
const app = express();
const cors = require("cors");
app.use(cors());
require("./db");
const path = require("path");
//Save the log details
const LOGGER = require("./src/Logger/logger.js");
//Port to expose
const port = 3000;
//import the basic routes folder
const basicRoutes = require("./src/Routes/basicroutes.js");
//import the user routes
const userRoutes = require("./src/Routes/userRoutes.js");
//import the seller book routes
const sellerbookRoutes = require("./src/Routes/sellerbookRoutes.js");
//import the buyer book routes
const buyerBookRoutes = require("./src/Routes/buyerbookRoutes.js");

//import the cart routes
const cartRoutes = require("./src/Routes/cartRoutes.js");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "10000kb" }));
app.use(
  responseTime(function (req, res, time) {
    var stat = (req.method + req.url)
      .toLowerCase()
      .replace(/[:\.]/g, "")
      .replace(/\//g, "_");
    sdc.timing(stat, time);
    sdc.increment(stat);
  })
);
//basic route
app.use("/", basicRoutes);
//Routes for users
app.use("/dev/user", userRoutes);
//Routes for seller books
app.use("/dev/seller/book", sellerbookRoutes);
//Routes for buyer books
app.use("/dev/buyer/book", buyerBookRoutes);
//Routes for cart
app.use("/dev/cart", cartRoutes);
app.listen(port, function () {
  LOGGER.debug("Started....")
  LOGGER.debug("Express server listening on port %s.", port);
});
module.exports = app;
