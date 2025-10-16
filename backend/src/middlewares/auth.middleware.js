const foodPartnerModel = require("../models/foodpartner.model");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function authFoodPartner(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.foodPartner = await foodPartnerModel.findById(decoded.id);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

async function authUser(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Please login to continue" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await userModel.findById(decoded.id);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Please login to continue" });
  }
}

module.exports = {
  authFoodPartner,
  authUser,
};
