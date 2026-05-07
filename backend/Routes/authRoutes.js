const express = require("express");
const router = express.Router();

const { register, login, me, logout, forgotPassword, resetPassword } = require("../Controllers/authController");
const { googleAuth } = require("../Controllers/googleAuthController");
const { firebaseAuth } = require("../Controllers/firebaseAuthController");
const { protect } = require("../Middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);
router.post("/logout", protect, logout);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);
router.post("/google", googleAuth);
router.post("/firebase", firebaseAuth);

module.exports = router;
