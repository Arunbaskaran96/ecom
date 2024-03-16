const mongoose = require("mongoose");
const connectDB = () => {
  mongoose
    .connect("mongodb+srv://test:test@cluster0.dgszt9m.mongodb.net/")
    .then(() => {
      console.log("connected");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDB;
