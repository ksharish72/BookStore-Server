//importing bcrypt to hash the user entered password for security.
const bcrypt = require("bcrypt");
//import constants file
const CONSTANTS = require("../../CONSTANTS/constants");
//import mongoose queries
const mysqlMiddleware = require("../../middleware/mysqlMiddleware");
//import login middleware
const loginMiddleware = require("../../middleware/loginMiddleware");
//import email middleware

const addnewUser = (req, res, next, FILE_NAME, password, data) => {
  loginMiddleware
    .checkifDataExists(data.email, FILE_NAME)
    .catch((error) => console.log(error))
    .then((result) => {
      if (result === null) {
        //Encrypt the password
        bcrypt.hash(password, 10, (err, hash) => {
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
          data.password = hash;
          //Save the data
          mysqlMiddleware.addNewUser(data, FILE_NAME).then((result) => {
            if (result != undefined && result != null) {
              //To Remove
              //Add data to the logger file
              CONSTANTS.createLogMessage(
                FILE_NAME,
                "USER CREATED SUCCESSFULLY",
                "SUCCESS"
              );
              //send back the json response
              CONSTANTS.createResponses(
                res,
                CONSTANTS.ERROR_CODE.SUCCESS,
                "User created Successfully",
                next
              );
            }
          });
        });
      } else {
        //Create the log message
        CONSTANTS.createLogMessage(FILE_NAME, "User already exists", "ERROR");
        //Send the response
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.BAD_REQUEST,
          "User already exists",
          next
        );
      }
    });
};
module.exports = { addnewUser };
