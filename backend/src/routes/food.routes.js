const express = require("express");
const foodController = require("../controllers/food.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
  "/",
  authMiddleware.authFoodPartner,
  upload.single("video"),
  foodController.createFood
);

router.get("/", authMiddleware.authUser, foodController.getFoodItems);

module.exports = router;
