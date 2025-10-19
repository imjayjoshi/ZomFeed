const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const foodPartnerController = require("../controllers/food-partner.controller");

// GET /api/food/foodpartner/:id
router.get(
  "/:id",
  authMiddleware.authUser,
  foodPartnerController.getFoodPartnerById
);

module.exports = router;
