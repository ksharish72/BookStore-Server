const dotenv = require("dotenv");
dotenv.config();
//Declare the file name
const FILE_NAME = "bookController.js";
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
//import aws s3 middleware
const awss3Middleware = require("../middleware/awss3Middleware");
//import login controller
const loginController = require("./common_controllers/loginController");
//import add user queries
const adduser = require("./common_controllers/addUserController");
//import post authentication controller
const postAuthentication = require("./common_controllers/postAuthenticationController");
//import login constants
const loginMiddleware = require("../middleware/loginMiddleware");

//This functionality adds a new book with all the required fields from the body.
const addNewBook = (req, res, next) => {
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
          mysqlMiddleware.addNewBook
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

//this function will retrieve books
const getBooks = (req, res, next) => {
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
          mysqlMiddleware.getBooks
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
//this function will retrieve books for the buyer
const getBuyerBooks = (req, res, next) => {
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
          mysqlMiddleware.getBuyerBooks
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

//this function will upload images to s3
const uploadImages = (req, res, next) => {
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
          awss3Middleware.uploadImages
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

//this function will get images from database
const getImagesFromDb = (req, res, next) => {
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
          mysqlMiddleware.getImagesFromDb
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


//this function will get images from s3
const getImages = (req, res, next) => {
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
          awss3Middleware.getSellerBookImages
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


//Updates the book information.
const updateBook = (req, res, next) => {
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
          mysqlMiddleware.updateBook
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

//Deletes books.
const deleteBooks = (req, res, next) => {
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
          mysqlMiddleware.deleteBooks
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
//Deletes images.
const deleteImage = (req, res, next) => {
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
          awss3Middleware.deleteBookImage
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

//Deletes image from db
const deleteImageDb = (req, res, next) => {
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
          mysqlMiddleware.deleteBookImageFromDb
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
  addNewBook,
  getBooks,
  updateBook,
  deleteBooks,
  getBuyerBooks,
  uploadImages,
  getImages,
  deleteImage,
  deleteImageDb,
  getImagesFromDb
};
