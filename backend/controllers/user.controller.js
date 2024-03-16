const userModel = require("../models/user.model");
const errorHandler = require("../utils/errorHandler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, mobile } = req.body;
    const userExist = await userModel.findOne({ email });
    if (!userExist) {
      const newUser = new userModel({ name, email, password, mobile });
      await newUser.save();
      res.status(200).json({
        success: true,
        message: "Register Successfully",
      });
    } else {
      next(errorHandler(400, "User Already Exist"));
    }
  } catch (error) {
    next(error);
  }
};

const singIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      const verifyPassword = await bcrypt.compare(password, user.password);
      if (verifyPassword) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SCT, {
          expiresIn: "30d",
        });
        const { password, ...rest } = user._doc;
        res.status(200).json({
          success: true,
          message: "Logged in successfully",
          user: rest,
          token,
        });
      } else {
        next(errorHandler(400, "Incorrect Username/Password"));
      }
    } else {
      next(errorHandler(400, "user not found"));
    }
  } catch (error) {
    next(error);
  }
};

const addtocart = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId);
    if (user) {
      const addCart = await userModel.findByIdAndUpdate(
        userId,
        {
          $push: {
            cartItems: req.body,
          },
        },
        { new: true, runValidators: true }
      );
      res.status(200).json({
        success: true,
        result: addCart.cartItems,
      });
    } else {
      next(errorHandler(400, "no user found"));
    }
  } catch (error) {
    next(error);
  }
};

const getUserCartItems = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId);
    if (user) {
      const user = await userModel
        .findById(userId)
        .populate("cartItems.productId");
      let { cartItems, ...rest } = user._doc;
      res.status(200).json({
        success: true,
        cartItems,
      });
    } else {
      next(errorHandler(400, "no user found"));
    }
  } catch (error) {
    next(error);
  }
};

const addCartQuantity = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId);
    if (user) {
      const { productId, quantity, subTotal } = req.body;
      const user = await userModel.findOneAndUpdate(
        {
          _id: userId,
          "cartItems._id": productId,
        },
        {
          $set: {
            "cartItems.$[cartKey].quantity": quantity,
            "cartItems.$[cartKey].subTotal": subTotal,
          },
        },
        {
          arrayFilters: [{ "cartKey._id": productId }],
        }
      );
      res.status(200).json({
        success: true,
        user,
      });
    } else {
      next(errorHandler(400, "user not found"));
    }
  } catch (error) {
    next(error);
  }
};

const subCartQuantity = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId);
    if (user) {
      const { productId, quantity } = req.body;
      const user = await userModel.findOneAndUpdate(
        {
          _id: userId,
          "cartItems._id": productId,
        },
        {
          $set: { "cartItems.$[cartId].quantity": quantity },
        },
        {
          arrayFilters: [{ "cartId._id": productId }],
        }
      );
      res.status(200).json({
        success: true,
        user,
      });
    } else {
      next(errorHandler(400, "user not found"));
    }
  } catch (error) {
    next(error);
  }
};

const removeCart = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId);
    if (user) {
      const { productId } = req.body;
      const user = await userModel.findByIdAndUpdate(userId, {
        $pull: {
          cartItems: {
            _id: productId,
          },
        },
      });
      res.status(200).json({
        success: false,
        user,
      });
    } else {
      next(errorHandler(400, "no user found"));
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  singIn,
  addtocart,
  getUserCartItems,
  addCartQuantity,
  subCartQuantity,
  removeCart,
};
