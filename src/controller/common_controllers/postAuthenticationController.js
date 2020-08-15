//import constants file
const CONSTANTS = require("../../CONSTANTS/constants");
//import authenticate user constants
const authenticationMiddleware = require("../../middleware/authenticationMiddleware");

const postAuthentication = (
  req,
  res,
  next,
  publicKEY,
  FILE_NAME,
  data,
  callback
) => {
  var result = authenticationMiddleware.authenticateUser(
    req,
    publicKEY,
    FILE_NAME
  );
  if (result === null) {
    //Create the log message
    CONSTANTS.createLogMessage(
      FILE_NAME,
      "User not authorized",
      "UNAUTHORIZED"
    );
    //Send the response
    CONSTANTS.createResponses(
      res,
      CONSTANTS.ERROR_CODE.UNAUTHORIZED,
      CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED,
      next
    );
    return;
  }

  if (result === "Token not present") {
    //Create the log message
    CONSTANTS.createLogMessage(FILE_NAME, "Token invalid", "UNAUTHORIZED");
    //Send the response
    CONSTANTS.createResponses(
      res,
      CONSTANTS.ERROR_CODE.BAD_REQUEST,
      CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED,
      next
    );
  }
  if (result.message !== undefined && result.message !== null) {
    if (result.message === "invalid signature") {
      //Create the log message
      CONSTANTS.createLogMessage(FILE_NAME, "Token invalid", "UNAUTHORIZED");
      //Send the response
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.BAD_REQUEST,
        CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED,
        next
      );
    } else if (result.message === "invalid token") {
      //Create the log message
      CONSTANTS.createLogMessage(FILE_NAME, "Token invalid", "UNAUTHORIZED");
      //Send the response
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.BAD_REQUEST,
        CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED,
        next
      );
    } else if (result.message === "jwt expired") {
      CONSTANTS.createLogMessage(FILE_NAME, "Token expired", "UNAUTHORIZED");
      //Send the response
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.FAILED,
        CONSTANTS.ERROR_DESCRIPTION.TOKENEXPIRED,
        next
      );
    }
  } else {
    if (result === null) {
      //Create the log message
      CONSTANTS.createLogMessage(
        FILE_NAME,
        "User not authorized",
        "UNAUTHORIZED"
      );
      //Send the response
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.UNAUTHORIZED,
        CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED,
        next
      );
    }
    //If the checkauthentication variable does not have an id property then give unauthorized error.
    else if (result.hasOwnProperty("id") === false) {
      //Create the log messages
      CONSTANTS.createLogMessage(
        FILE_NAME,
        "User not authorized",
        "UNAUTHORIZED"
      );
      //Send the response
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.UNAUTHORIZED,
        CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED,
        next
      );
    } else if (result != null) {
      if (callback !== null) {
        callback(req, res, next, data, FILE_NAME);
      } else {
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.SUCCESS,
          data,
          next
        );
      }
    }
  }
};

module.exports = { postAuthentication };
