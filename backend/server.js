const server = require("./app");
const dotenv = require("dotenv");
const errorMiddleware = require("./middleware/error");
const connectDB = require("./connection/db");
dotenv.config({ path: "./backend/config/config.env" });
connectDB();

server.use(errorMiddleware);

server.listen(3000, () => {
  console.log("server connected");
});
