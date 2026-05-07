const express = require("express");

const {
  createUser,
  getUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  searchUsers,
  exportUsersCSV,
} = require("../controllers/userController");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/", upload.single("profileImage"), createUser);

router.get("/", getUsers);

router.get("/search", searchUsers);

router.get("/export/csv", exportUsersCSV);

router.get("/:id", getSingleUser);

router.put("/:id", upload.single("profileImage"), updateUser);

router.delete("/:id", deleteUser);

module.exports = router;
