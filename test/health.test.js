const express = require("express");
const router = express.Router();
const assert = require("assert");
const axios = require("axios");

describe("Main page status", () => {
  it("Main page status", (done) => {
    axios
      .get("http://google.com")
      .then((res) => {
        console.log(res.data);
        done();
      })
      .catch((err) => {
        console.log(err.message);
        done();
      });
  });
});
