const express = require("express");
const {
  createUser,
  singIn,
  addtocart,
  getUserCartItems,
  addCartQuantity,
  subCartQuantity,
  removeCart,
} = require("../controllers/user.controller");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.route("/signup").post(createUser);
router.route("/signin").post(singIn);
router.route("/addQuantity/:userId").put(verifyToken, addCartQuantity);
router.route("/subQuantity/:userId").put(verifyToken, subCartQuantity);
router.route("/removecart/:userId").put(verifyToken, removeCart);
router
  .route("/cart/:userId")
  .put(verifyToken, addtocart)
  .get(verifyToken, getUserCartItems);

module.exports = router;
