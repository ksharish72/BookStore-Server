//import constants file
const CONSTANTS = require("../CONSTANTS/constants");
const db = require("../../db");

/// function to find specific data by userid
const checkifUserIdExists = (userid, FILE_NAME) => {
  try {
    return new Promise((resolve, reject) => {
      let query = `SELECT * FROM users WHERE id='${userid}'`;
      db.query(query, (err, rows) => {
        if (err) {
          CONSTANTS.createLogMessage(
            FILE_NAME,
            "ERROR in searching for user",
            "ERROR"
          );
          reject(err);
        } else {
          if (rows.length === 0) {
            resolve(null);
          } else {
            CONSTANTS.createLogMessage(
              FILE_NAME,
              "Successfully searched for user",
              "SUCCESS"
            );
            resolve(rows[0]);
          }
        }
      });
    });
  } catch (Exception) {
    console.log("Here");
    CONSTANTS.createLogMessage(FILE_NAME, "Parameter in wrong format", "ERROR");
  }
};
//Function to find a specific data
const checkifDataExists = (email, FILE_NAME) => {
  try {
    return new Promise((resolve, reject) => {
      let query = `SELECT * FROM users WHERE email='${email}'`;
      db.query(query, (err, rows) => {
        if (err) {
          CONSTANTS.createLogMessage(
            FILE_NAME,
            "ERROR in searching for user",
            "ERROR"
          );
          reject(err);
        } else {
          if (rows.length === 0) {
            resolve(null);
          } else {
            CONSTANTS.createLogMessage(
              FILE_NAME,
              "Successfully searched for user",
              "SUCCESS"
            );
            resolve(rows[0]);
          }
        }
      });
    });
  } catch (Exception) {
    console.log("Here");
    CONSTANTS.createLogMessage(FILE_NAME, "Parameter in wrong format", "ERROR");
  }
};

//Export the modules
module.exports = {
  checkifUserIdExists,
  checkifDataExists,
};
