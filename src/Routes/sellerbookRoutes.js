//Importing book Controller
const bookController = require("../controller/bookController");
const express = require("express");
const router = express.Router();
const sdc = require("../../statsdclient");
//Add a new book
router.post("/add/:userID", function (req, res, next) {
  bookController.addNewBook(req, res, next);
});

//Get books
router.get("/:userID", function (req, res, next) {
  bookController.getBooks(req, res, next);
});

//Update a book
router.put("/update/:userID", function (req, res, next) {
  bookController.updateBook(req, res, next);
});

// delete books
router.delete("/delete/:userID", function (req, res, next) {
  bookController.deleteBooks(req, res, next);
});

// upload images to s3
router.post("/uploadImages/:userID", function (req, res, next) {
  bookController.uploadImages(req, res, next);
});

// get images from s3
router.post("/getImages/:userID", function (req, res, next) {
  bookController.getImages(req, res, next);
});
// get images from db
router.get("/getImagesDb/:userID", function (req, res, next) {
  sdc.increment(`${req.params.userID}_${req.query.isbn}`); // Increment by one
  bookController.getImagesFromDb(req, res, next);
});

// delete image from s3
router.delete("/deleteImage/:userID", function (req, res, next) {
  bookController.deleteImage(req, res, next);
});

// delete image from db
router.delete("/deleteImageDb/:userID", function (req, res, next) {
  bookController.deleteImageDb(req, res, next);
});
module.exports = router;
