const cartModel = require("../models/cart.model");
const errorHandler = require("../utils/errorHandler");

const addToCart = async (req, res, next) => {
  try {
    const { cartItems, userId } = req.body;
    const isCartExist = await cartModel.findOne({ userId });
    const addCart = new cartModel({
      cartItems,
      userId,
    });
    if (isCartExist) {
      const updateCart = await cartModel.findOneAndUpdate(
        { userId },
        {
          $push: {
            cartItems: req.body.cartItems,
          },
        },
        { new: true }
      );
      res.status(200).json(updateCart);
    } else {
      await addCart.save();
      res.status(200).json(addCart);
    }
  } catch (error) {
    next(error);
  }
};

const getUsersCart = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const usersCart = await cartModel
      .findOne({ userId })
      .populate("cartItems.productId");
    if (usersCart) {
      res.status(200).json({
        success: true,
        cart: usersCart,
      });
    } else {
      next(errorHandler(400, "no cart found"));
    }
  } catch (error) {
    next(error);
  }
};

const getUserCartCount = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const userCartCount = await cartModel.findOne({ userId });
    if (userCartCount) {
      res.status(200).json({
        success: true,
        message: "ok",
        count: userCartCount.cartItems.length,
      });
    } else {
      next(errorHandler(400, "no cart found"));
    }
  } catch (error) {
    next(error);
  }
};

const fetchCartCount = async (req, res, next) => {
  try {
    const { userId } = req.params;
    let cartExist = await cartModel.findOne({ userId });
    if (cartExist) {
      cartExist = cartExist.cartItems.map((item) => item.productId._id);
      res.status(200).json({
        status: true,
        message: "ok",
        length: cartExist,
      });
    } else {
      next(errorHandler(400, "no cart found"));
    }
  } catch (error) {
    next(error);
  }
};

const addQuantity = (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
module.exports = {
  addToCart,
  getUsersCart,
  fetchCartCount,
  fetchCartCount,
  addQuantity,
};
