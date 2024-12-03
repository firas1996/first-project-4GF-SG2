const { signup, login } = require("../controllers/authController");
const {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} = require("../controllers/userController");
const express = require("express");
const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);

router.route("/").get(getAllUsers).post(createUser);

router.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);

module.exports = router;
