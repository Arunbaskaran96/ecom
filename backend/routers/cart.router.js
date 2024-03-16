const express = require("express");
const {
  addToCart,
  getUsersCart,
  fetchCartCount,
} = require("../controllers/cart.controller");
const router = express.Router();

router.route("/addToCart").post(addToCart);
router.route("/getUserCart/:userId").get(getUsersCart);
router.route("/userCartCount/:userId").get(fetchCartCount);
module.exports = router;
