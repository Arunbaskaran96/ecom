const orderModel = require("../models/order.model");
const errorHandler = require("../utils/errorHandler");
//add order
const addOrder = async (req, res, next) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      userId,
      paidAt,
    } = req.body;

    const newOrder = new orderModel({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      userId,
      paidAt,
    });
    await newOrder.save();
    res.status(200).json({ success: true, order: newOrder });
  } catch (error) {
    next(error);
  }
};

//get single order
const getSingleOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await orderModel.findById(orderId);
    if (order) {
      res.status(200).json(order);
    } else {
      next(errorHandler(400, "No order found"));
    }
  } catch (error) {
    next(error);
  }
};

//get user orders
const getUserOrders = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const userOrders = await orderModel.find({ userId: userId });
    res.status(200).json(userOrders);
  } catch (error) {
    next(error);
  }
};

//getallorders

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderModel.find();
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

module.exports = { addOrder, getSingleOrder, getUserOrders, getAllOrders };
