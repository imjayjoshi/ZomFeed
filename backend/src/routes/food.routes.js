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

router.post("/like", authMiddleware.authUser, foodController.likeFood);

router.post("/save", authMiddleware.authUser, foodController.saveFood);

router.get("/save", authMiddleware.authUser, foodController.getSavedFoodItems);
module.exports = router;
