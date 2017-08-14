module.exports = (req, res, next) => {
  // console.log(req);
  if (req.user) {
    next();
  } else {
    res
    .status(401)
    .json({
      error: 'unauthorized ... from only-Logged-In'
    });
  }
};
