const jwt = require("jsonwebtoken");
const { createToken, getToken, removeToken } = require('../services/RefreshToken');
require('dotenv').config();

// authentication
const auth = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer")) {
      return res.sendStatus(403);
    }

    const token = authorization.split(" ")[1];
    if (!token) {
      return res.sendStatus(403);
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.data = data;
      next();
    });
  } catch (err) {
    res.sendStatus(500);
  }
};

// send refresh and access tokens using the past refresh token
const authRefreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.sendStatus(401).json({ massage: "refresh_token required" });
    }

    const dbToken = await getToken(refresh_token);

    if (!dbToken) {
      return res.sendStatus(401);
    }

    // verify refresh token
    jwt.verify(dbToken.refresh_token, process.env.RE_TOKEN_KEY, async (err, data) => {
      if (err) {
        return res.sendStatus(403);
      }

      try {
        await removeToken(refresh_token); // remove the past refresh token from the db
        const user = { id: data.id, role: data.role, phone_number: data.phone_number };
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await createToken(user.id, refreshToken);

        return res.json({ access_token: accessToken, refresh_token: refreshToken });
      } catch (err) {
        console.error(err);
        return res.sendStatus(500);
      }
    });
  } catch (err) {
    console.error(err);
    return res.sendStatus(500).json({ massage: err.message });
  }
};


const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.TOKEN_KEY, { expiresIn: process.env.duration_access_token });
};

const generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.RE_TOKEN_KEY, { expiresIn: process.env.duration_refresh_token });
};


module.exports = {
  auth,
  authRefreshToken
};
