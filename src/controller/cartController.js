const dotenv = require("dotenv");
dotenv.config();
//Declare the file name
const FILE_NAME = "cartController.js";
//import constants file
const CONSTANTS = require("../CONSTANTS/constants");
const decodedkey = require("./common_controllers/keydecoder");
var privateKey = decodedkey.decodedkey(
  process.env.USER_PRIVATE_KEY.toString("utf8")
);
var publicKEY = decodedkey.decodedkey(
  process.env.USER_PUBLIC_KEY.toString("utf8")
);
//importing bcrypt to hash the user entered password for security.
const bcrypt = require("bcrypt");

//import mysql queries
const mysqlMiddleware = require("../middleware/mysqlMiddleware");
//import login controller
const loginController = require("./common_controllers/loginController");
//import add user queries
const adduser = require("./common_controllers/addUserController");
//import post authentication controller
const postAuthentication = require("./common_controllers/postAuthenticationController");
//import login constants
const loginMiddleware = require("../middleware/loginMiddleware");

//This functionality adds a new book to cart with all the required fields from the body.
const addToCart = (req, res, next) => {
  loginMiddleware
    .checkifUserIdExists(req.params.userID, FILE_NAME)
    .then((result) => {
      if (result != undefined && result != null) {
        postAuthentication.postAuthentication(
          req,
          res,
          next,
          publicKEY,
          FILE_NAME,
          req.body,
          mysqlMiddleware.addToCart
        );
      } else {
        //Create the log message
        CONSTANTS.createLogMessage(FILE_NAME, "No data Found", "NODATA");
        //Send the response
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.NOT_FOUND,
          CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND,
          next
        );
      }
    });
};

//this function will retrieve cart items
const getCartItem = (req, res, next) => {
  loginMiddleware
    .checkifUserIdExists(req.params.userID, FILE_NAME)
    .then((result) => {
      if (result != undefined && result != null) {
        postAuthentication.postAuthentication(
          req,
          res,
          next,
          publicKEY,
          FILE_NAME,
          null,
          mysqlMiddleware.getCartItem
        );
      } else {
        //Create the log message
        CONSTANTS.createLogMessage(FILE_NAME, "No data Found", "NODATA");
        //Send the response
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.NOT_FOUND,
          CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND,
          next
        );
      }
    });
};

//Updates the Cart item information.
const updateCartItem = (req, res, next) => {
  loginMiddleware
    .checkifUserIdExists(req.params.userID, FILE_NAME)
    .then((result) => {
      if (result != undefined && result != null) {
        postAuthentication.postAuthentication(
          req,
          res,
          next,
          publicKEY,
          FILE_NAME,
          req.body,
          mysqlMiddleware.updateCartItem
        );
      } else {
        //Create the log message
        CONSTANTS.createLogMessage(FILE_NAME, "No data Found", "NODATA");
        //Send the response
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.NOT_FOUND,
          CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND,
          next
        );
      }
    });
};

//Delete cart item.
const deleteCartItem = (req, res, next) => {
  loginMiddleware
    .checkifUserIdExists(req.params.userID, FILE_NAME)
    .then((result) => {
      if (result != undefined && result != null) {
        postAuthentication.postAuthentication(
          req,
          res,
          next,
          publicKEY,
          FILE_NAME,
          null,
          mysqlMiddleware.deleteCartItem
        );
      } else {
        //Create the log message
        CONSTANTS.createLogMessage(FILE_NAME, "No data Found", "NODATA");
        //Send the response
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.NOT_FOUND,
          CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND,
          next
        );
      }
    });
};

module.exports = {
  addToCart,
  getCartItem,
  updateCartItem,
  deleteCartItem,
};
