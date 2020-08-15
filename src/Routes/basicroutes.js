const express = require("express");
const router = express.Router();
const CONSTANTS = require("../CONSTANTS/constants");
const LOGGER = require("../Logger/logger");
// File name to be logged
const FILE_NAME = "basicRoute.js";

router.get("/health", function (req, res) {
  let responseObj = {};
  LOGGER.info("Hello world " + FILE_NAME);
  res.statusCode = CONSTANTS.ERROR_CODE.SUCCESS;
  res.statusMessage = CONSTANTS.ERROR_DESCRIPTION.SUCCESS;
  responseObj.result = "API is still healthy";
  res.send(responseObj);
});

module.exports = router;
