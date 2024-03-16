const express = require("express");
const {
  addOrder,
  getSingleOrder,
  getAllOrders,
  getUserOrders,
} = require("../controllers/order.controller");
const router = express.Router();

router.route("/addOrder").post(addOrder);
router.route("/:orderId").get(getSingleOrder);
router.route("/allorders").get(getAllOrders);
router.route("/orders/:userId").get(getUserOrders);

module.exports = router;
