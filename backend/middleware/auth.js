const errorHandler = require("../utils/errorHandler");

const authorizeRoles = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return next(
        errorHandler(400, "you are not allowed to access this resouce")
      );
    }
    next();
  };
};

module.exports = { authorizeRoles };
