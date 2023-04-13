const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  console.log(req.cookies);
  const token =
    req.header("Authorization")?.replace("Bearer ", "") ||
    req.cookies.token ||
    req.body.token;
  if (!token) {
    return res.status(400).send("token missing");
  }
  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decode);
  } catch (error) {
    console.log(error.message);
    return res.status(401).send("invalid token");
  }
  return next();
};

module.exports = isAuth;
