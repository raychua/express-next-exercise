const jwt = require("jsonwebtoken");

const checkJSON = (req, res, next) => {
  if (req.headers["content-type"] !== "application/json") {
    res.status(400).send("Please send a json message");
  } else next();
};

const protectRoute = (req, res, next) => {
  try {
    console.log("in protectRoute");
    const cookieName = "loginToken";
    const tokenCookie = req.signedCookies[cookieName];
    if (!tokenCookie) {
      const notAuthorisedError = new Error("You are not logged in");
      notAuthorisedError.statusCode = 401;
      throw notAuthorisedError;
    }
    req.user = jwt.verify(tokenCookie, process.env.JWT_SECRET_KEY);
    //req.user = jwt.verify(tokenCookie, "s");
    next();
  } catch (err) {
    next(err);
  }
};

const createJWTToken = (username) => {
  const today = new Date();
  const exp = new Date(today);

  const secret = process.env.JWT_SECRET_KEY;
  exp.setTime(today.getTime() + 900000); // adding 15 mins
  const payload = { name: username, exp: parseInt(exp.getTime() / 1000) };
  const token = jwt.sign(payload, secret);
  return { token, exp };
};

module.exports = {
  checkJSON,
  protectRoute,
  createJWTToken,
};
