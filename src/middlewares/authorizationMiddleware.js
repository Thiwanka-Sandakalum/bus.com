require('dotenv').config();
const jwt = require("jsonwebtoken");
const key = process.env.TOKEN_KEY;

function get_token(req) {
  let token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer ")) {
    throw new Error("Forbidden");
  }
  token = token.split(" ")[1];
  try {
    const result = jwt.verify(token, key);
    return result.role;
  } catch (error) {
    return error.message;
  }
  
  
}

const driver_auth = async (req, res, next) => {
  try {
    const role = get_token(req);
    if (role === "driver") {
      next();
    } else {
      res.status(403).json({ "message": "Can't access this resource" });
    }
  } catch (error) {
    res.status(403).json({ "message": "Forbidden" });
  }
};

const customer_auth = async (req, res, next) => {
  try {
    const role = get_token(req);
    if (role === "customer") {
      next();
    } else {
      res.status(403).json({ "message": "Can't access this resource" });
    }
  } catch (error) {
    res.status(403).json({ "message": "Forbidden" });
  }
};

module.exports = {
  driver_auth,
  customer_auth
};
