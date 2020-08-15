const dotenv = require("dotenv");
dotenv.config();
//Declare the file name
const FILE_NAME = "userController.js";
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
const awss3Middleware = require("../middleware/awss3Middleware");

//This functionality adds a new user with all the required fields from the body.
const addNewUser = (req, res, next) => {
  if (
    req.body.hasOwnProperty("firstname") &&
    req.body.hasOwnProperty("lastname") &&
    req.body.hasOwnProperty("email") &&
    req.body.hasOwnProperty("password")
  ) {
    let newUser = {
      firstName: req.body.firstname,
      lastName: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
    };
    adduser.addnewUser(req, res, next, FILE_NAME, req.body.password, newUser);
  } else {
    //Create the log message
    CONSTANTS.createLogMessage(
      FILE_NAME,
      "BAD REQUEST FROM USER",
      "BADREQUEST"
    );
    let data = "BAD REQUEST FROM USER";
    //Send the response
    CONSTANTS.createResponses(
      res,
      CONSTANTS.ERROR_CODE.INVALID_MISSING_PARAMETER,
      data,
      next
    );
  }
};

//This functionality forgot password.
const forgotPassword = (req, res, next) => {
  loginMiddleware
    .checkifDataExists(req.body.email, FILE_NAME)
    .then((result) => {
      if (result != undefined && result != null) {
        awss3Middleware.forgotPassword(req,res,next);
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

//This function will retrieve the user with the given id.
const getUserWithID = (req, res, next) => {
  console.log(`user id : ${JSON.stringify(req.params.userID)}`);
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
          result,
          null
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

//Updates the user information.
const updateUser = (req, res, next) => {
  loginMiddleware
    .checkifUserIdExists(req.params.userID, FILE_NAME)
    .then((result) => {
      if (result != undefined && result != null) {
        let updatedUser = result;
        for (var key in req.body) {
          if (key === "email" || key === "password") {
            //Create the log message
            CONSTANTS.createLogMessage(
              FILE_NAME,
              `CANNOT UPDATE ${key}`,
              "NOUPDATE"
            );
            //Send the response
            CONSTANTS.createResponses(
              res,
              CONSTANTS.ERROR_CODE.INVALID_MISSING_PARAMETER,
              `CANNOT UPDATE ${key}`,
              next
            );
            return;
          } else if (!updatedUser.hasOwnProperty(key)) {
            //Create the log message
            CONSTANTS.createLogMessage(
              FILE_NAME,
              `REQUEST BODY PROPERTY INVALID ${key}`,
              "NOUPDATE"
            );
            //Send the response
            CONSTANTS.createResponses(
              res,
              CONSTANTS.ERROR_CODE.INVALID_MISSING_PARAMETER,
              `REQUEST BODY PROPERTY INVALID ${key}`,
              next
            );
            return;
          }
          var value = req.body[key];
          updatedUser[key] = value;
        }
        postAuthentication.postAuthentication(
          req,
          res,
          next,
          publicKEY,
          FILE_NAME,
          updatedUser,
          mysqlMiddleware.updateUser
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

//Authenticate the user.
const getUserLogin = (req, res, next) => {
  //Check of the user exists using their email ID.
  if (req.params === undefined) {
    CONSTANTS.createLogMessage(FILE_NAME, "Parameter not found", "ERROR");
    CONSTANTS.createResponses(
      res,
      CONSTANTS.ERROR_CODE.NOT_FOUND,
      "Parameter not found",
      next
    );
  } else {
    loginMiddleware
      .checkifDataExists(req.body.email, FILE_NAME)
      .then((result) => {
        if (result != undefined && result != null) {
          loginController.loginAuthentication(
            privateKey,
            req.body.email,
            req.body.password,
            FILE_NAME,
            res,
            next
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
  }
};

const resetPassword = (req, res, next) => {
  loginMiddleware
    .checkifUserIdExists(req.params.userID, FILE_NAME)
    .then((result) => {
      if (result != undefined && result != null) {
        let oldPassword = req.body.oldpassword;
        let newPassword = req.body.newpassword;
        var pwd = result.password.toString();
        bcrypt.compare(oldPassword, pwd.toString(), (err, match) => {
          if (err) {
            CONSTANTS.createLogMessage(FILE_NAME, "Server Error", "ERROR");
            CONSTANTS.createResponses(
              res,
              CONSTANTS.ERROR_CODE.NO_DATA_FOUND,
              err.errmsg,
              next
            );
          }
          //If password same update the new password.
          if (match === true) {
            //Encrypt the password
            bcrypt.hash(newPassword, 10, (err, hash) => {
              //Error
              if (err) {
                //Add data to the logger file
                CONSTANTS.createLogMessage(FILE_NAME, err, "Error");
                //send back the json response
                CONSTANTS.createResponses(
                  res,
                  CONSTANTS.ERROR_CODE.FAILED,
                  err.errmsg,
                  next
                );
              }
              result.password = hash;
              //Update the data
              postAuthentication.postAuthentication(
                req,
                res,
                next,
                publicKEY,
                FILE_NAME,
                result,
                mysqlMiddleware.updateUser
              );
            });
          } else {
            CONSTANTS.createLogMessage(
              FILE_NAME,
              "INCORRECT OLD PASSWORD",
              "ERROR"
            );
            CONSTANTS.createResponses(
              res,
              CONSTANTS.ERROR_CODE.NO_DATA_FOUND,
              "INCORRECT OLD PASSWORD",
              next
            );
          }
        });
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
  addNewUser,
  getUserLogin,
  getUserWithID,
  updateUser,
  resetPassword,
  forgotPassword
};
