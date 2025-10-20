const foodModel = require("../models/food.model");
const Like = require("../models/likes.model");
const Save = require("../models/save.model");
const storageService = require("../services/storage.service");
const { v4: uuid } = require("uuid");

async function createFood(req, res) {
  const fileUploadResult = await storageService.uploadFile(
    req.file.buffer,
    uuid()
  );

  const foodItem = await foodModel.create({
    name: req.body.name,
    video: fileUploadResult.url,
    description: req.body.description,
    foodPartner: req.foodPartner._id,
  });
  res.status(201).json({
    message: "Food created successfully",
    food: foodItem,
  });
}

async function getFoodItems(req, res) {
  const foodItems = await foodModel.find({});
  res.status(200).json({
    message: "Food items fetched successfully",
    foodItems: foodItems,
  });
}

async function likeFood(req, res) {
  const { foodId } = req.body;
  const userId = req.user._id;
  const isFoodLiked = await Like.findOne({ user: userId, food: foodId });

  if (isFoodLiked) {
    await Like.deleteOne({ user: userId, food: foodId });
    const updatedFood = await foodModel.findOneAndUpdate(
      { _id: foodId },
      { $inc: { likeCount: -1 } },
      { new: true }
    );
    return res.status(200).json({
      message: "Food unliked successfully",
      likeCount: updatedFood.likeCount,
    });
  }

  const like = await Like.create({ user: userId, food: foodId });
  const updatedFood = await foodModel.findOneAndUpdate(
    { _id: foodId },
    { $inc: { likeCount: 1 } },
    { new: true }
  );
  return res.status(201).json({
    message: "Food liked successfully",
    likeCount: updatedFood.likeCount,
  });
}

async function saveFood(req, res) {
  const { foodId } = req.body;
  const userId = req.user._id;
  const isFoodSaved = await Save.findOne({ user: userId, food: foodId });

  if (isFoodSaved) {
    await Save.deleteOne({ user: userId, food: foodId });
    const updatedFood = await foodModel.findOneAndUpdate(
      { _id: foodId },
      { $inc: { saveCount: -1 } },
      { new: true }
    );
    return res.status(200).json({
      message: "Food unsaved successfully",
      saveCount: updatedFood.saveCount,
    });
  }

  const save = await Save.create({ user: userId, food: foodId });
  const updatedFood = await foodModel.findOneAndUpdate(
    { _id: foodId },
    { $inc: { saveCount: 1 } },
    { new: true }
  );
  return res.status(201).json({
    message: "Food saved successfully",
    saveCount: updatedFood.saveCount,
  });
}

// In your controller file
async function getSavedFoodItems(req, res) {
  try {
    const userId = req.user._id;
    const savedFoodItems = await Save.find({ user: userId }).populate("food");

    return res.status(200).json({
      message: "Saved food items fetched successfully",
      savedFood: savedFoodItems,
    });
  } catch (error) {
    console.error("Error in getSavedFoodItems:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

module.exports = {
  createFood,
  getFoodItems,
  likeFood,
  saveFood,
  getSavedFoodItems,
};
