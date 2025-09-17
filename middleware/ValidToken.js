const jwt = require("jsonwebtoken");

async function verifyToken(req, res, next) {
  var authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Invaild token" });
  }
  var token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Invaild token" });
  }
  var decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded; // attach user info to request
  next();
}
module.exports = { verifyToken };

