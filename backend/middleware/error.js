module.exports = (error, req, res, next) => {
  const statuscode = error.statuscode || 500;
  const message = error.message || "Internal server error";
  return res.status(statuscode).json({
    success: false,
    statuscode,
    message,
  });
};
