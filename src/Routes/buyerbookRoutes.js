//Importing book Controller
const bookController = require("../controller/bookController");
const express = require("express");
const router = express.Router();

//Get books
router.get("/:userID", function (req, res, next) {
  bookController.getBuyerBooks(req, res, next);
});
module.exports = router;
