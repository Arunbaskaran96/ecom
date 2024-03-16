const errorHandler = (code, msg) => {
  const error = new Error();
  (error.statuscode = code), (error.message = msg);
  return error;
};

module.exports = errorHandler;
