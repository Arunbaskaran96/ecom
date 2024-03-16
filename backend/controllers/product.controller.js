const productModel = require("../models/product.model");
const errorHandler = require("../utils/errorHandler");
const userSchema = require("../models/user.model");

const addProduct = async (req, res, next) => {
  try {
    const { name, description, price, ratings, images, category, stock } =
      req.body;

    const newProduct = new productModel({
      name,
      description,
      price,
      ratings,
      images,
      category,
      stock,
    });
    await newProduct.save();
    res.status(200).json({
      success: true,
      newProduct,
    });
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const name = req.query.name || "";
    const min = req.query.min || 0;
    const max = req.query.max || 50000;
    const category = req.query.category || "";
    const minRating = req.query.minRating || 0;
    const maxRating = req.params.maxRating || 5;
    const products = await productModel.find({
      name: { $regex: name, $options: "i" },
      category: { $regex: category, $options: "i" },
      $and: [{ price: { $gte: min } }, { price: { $lte: max } }],
      $and: [
        { ratings: { $gte: minRating } },
        { ratings: { $lte: maxRating } },
      ],
    });
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product = await productModel.findById(id);
    if (product) {
      res.status(200).json({
        success: true,
        product,
      });
    } else {
      next(errorHandler(400, "Product not found"));
    }
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);
    if (product) {
      const product = await productModel.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true, runValidators: true, useFindAndModify: false }
      );
      res.status(200).json({
        success: true,
        product,
      });
    } else {
      next(errorHandler(400, "Product not found"));
    }
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);
    if (product) {
      await productModel.deleteOne(id);
      res.status(200).json({
        success: true,
        message: "deleted",
      });
    } else {
      next(errorHandler(400, "Product not found"));
    }
  } catch (error) {
    next(error);
  }
};

//add review

const addReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);
    if (product) {
      const { userId, rating, comment } = req.body;
      const isReviewd = product.reviews.some((rev) => rev.userId == userId);

      if (isReviewd) {
        product.reviews.map((rev) => {
          if (rev.userId == userId) {
            (rev.rating = rating), (rev.comment = comment);
          } else {
            return rev;
          }
        });
      } else {
        product.reviews.push({
          userId,
          rating: Number(rating),
          comment,
        });
      }
      const total = product.reviews
        .map((rev) => rev.rating)
        .reduce((acc, val) => acc + val, 0);
      const avgRating = Math.floor(total / product.reviews.length);
      product.ratings = avgRating;
      product.numOfReviews = product.reviews.length;
      res.status(200).json({ success: true, product });
      await product.save({ validateBeforeSave: false });
    } else {
      next(errorHandler(400, "Product not found"));
    }
  } catch (error) {
    next(error);
  }
};

//remove rating

const removeRating = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);
    if (product) {
      const { userId } = req.body;
      product.reviews = product.reviews.filter((rev) => rev.userId != userId);
      const total = product.reviews
        .map((rev) => rev.rating)
        .reduce((acc, val) => acc + val, 0);
      const avgRating = Math.floor(total / product.reviews.length);
      product.ratings = avgRating;
      product.numOfReviews = product.reviews.length;
      await product.save();
      res.status(200).json({ success: true, product });
    } else {
      next(errorHandler(400, "Product not found"));
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  addReview,
  removeRating,
};
