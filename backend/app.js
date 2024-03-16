const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cors = require("cors");

app.use(bodyparser.json());
app.use(cors());

const product = require("./routers/product.router");
const user = require("./routers/user.router");
const order = require("./routers/order.router");
const cart = require("./routers/cart.router");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", cart);

module.exports = app;
