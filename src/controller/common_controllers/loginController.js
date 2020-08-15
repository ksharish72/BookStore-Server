//importing jwt token to assign to the user once authenticated
const jwt = require("jsonwebtoken");
//import constants file
const CONSTANTS = require("../../CONSTANTS/constants");
//importing bcrypt to hash the user entered password for security.
const bcrypt = require("bcrypt");
//import login constants
const loginMiddleware = require("../../middleware/loginMiddleware");

//Authentication Function
const loginAuthentication = (
  privateKey,
  email,
  password,
  FILE_NAME,
  res,
  next
) => {
  //Check the type of user to be authenticated
  loginMiddleware.checkifDataExists(email, FILE_NAME).then((result) => {
    if (result === null) {
      //Error
      CONSTANTS.createLogMessage(FILE_NAME, "Invalid email/username", "ERROR");
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.NO_DATA_FOUND,
        CONSTANTS.ERROR_DESCRIPTION.LOGINERROR,
        next
      );
    } else if (result !== null) {
      var pwd = result.password.toString();
      bcrypt.compare(password, pwd.toString(), (err, match) => {
        if (err) {
          CONSTANTS.createLogMessage(FILE_NAME, "Server Error", "ERROR");
          CONSTANTS.createResponses(
            res,
            CONSTANTS.ERROR_CODE.NO_DATA_FOUND,
            err.errmsg,
            next
          );
        }
        //If password same create the json web token.
        if (match === true) {
          var payload = {
            id: result.id.toString(),
          };
          var token = jwt.sign(payload, privateKey, CONSTANTS.signOptions);
          //return the token
          CONSTANTS.createLogMessage(FILE_NAME, "Token Generated", "SUCCESS");
          var responsedata = {
            token: token,
            userid: result.id,
          };
          CONSTANTS.createResponses(
            res,
            CONSTANTS.ERROR_CODE.SUCCESS,
            responsedata,
            next
          );
        } else {
          CONSTANTS.createLogMessage(
            FILE_NAME,
            "Invalid email/password",
            "ERROR"
          );
          CONSTANTS.createResponses(
            res,
            CONSTANTS.ERROR_CODE.NO_DATA_FOUND,
            CONSTANTS.ERROR_DESCRIPTION.LOGINERROR,
            next
          );
        }
      });
    }
  });
};

module.exports = { loginAuthentication };
