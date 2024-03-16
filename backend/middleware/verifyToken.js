const errorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    const verify = jwt.verify(token, process.env.JWT_SCT, (err, user) => {
      if (err) {
        return next(errorHandler(400, "Auth failed"));
      } else {
        (req.user = user), next();
      }
    });
  } else {
    next(errorHandler(400, "Auth is required"));
  }
};
