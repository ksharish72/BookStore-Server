//Importing user Controller
const userController = require("../controller/userController");
const express = require("express");
const router = express.Router();

//Register a new user
router.post("/registration", function (req, res, next) {
  userController.addNewUser(req, res, next);
});

//Forgot password
router.post("/forgotPassword", function (req, res, next) {
  userController.forgotPassword(req, res, next);
});

//Get a particular user
router.get("/:userID", function (req, res, next) {
  userController.getUserWithID(req, res, next);
});

//Update a user
router.put("/update/:userID", function (req, res, next) {
  userController.updateUser(req, res, next);
});

//Authenticate a user
router.post("/login", function (req, res, next) {
  userController.getUserLogin(req, res);
});

//Update password
router.put("/resetpassword/:userID", function (req, res, next) {
  userController.resetPassword(req, res, next);
});

module.exports = router;
