const express = require("express");
const router = express.Router();
const {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  addReview,
  removeRating,
} = require("../controllers/product.controller");
const { authorizeRoles } = require("../middleware/auth");
const verifyToken = require("../middleware/verifyToken");

router.route("/addProduct").post(addProduct);
router.route("/getProducts").get(getProducts);
router.route("/addReview/:id").put(addReview);
router.route("/deleteReview/:id").put(removeRating);
router
  .route("/product/:id")
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
