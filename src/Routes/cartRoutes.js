//Importing cart Controller
const cartController = require("../controller/cartController");
const express = require("express");
const router = express.Router();

//Add items to cart
router.post("/add/:userID", function (req, res, next) {
  cartController.addToCart(req, res, next);
});

//Get cart item query params cart id
router.get("/:userID", function (req, res, next) {
  cartController.getCartItem(req, res, next);
});

//Update a cart item
router.put("/update/:userID", function (req, res, next) {
  cartController.updateCartItem(req, res, next);
});

//Delete cart item  query params cart id
router.delete("/delete/:userID", function (req, res, next) {
  cartController.deleteCartItem(req, res, next);
});

module.exports = router;
