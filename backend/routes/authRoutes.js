const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const upload = require("../middlewares/uploadMiddleware");

// Use multer for register route
router.post("/register", upload.single("profilePhoto"), registerUser);
router.post("/login", loginUser);

module.exports = router;
