const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {protect} = require("../middleware/authMiddleware");
const { generateOTP, sendOTPEmail } = require("../utils/emailService");

const router = express.Router();

// @route  POST /api/users/register
// @desc   Register a new user
// @access Public
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Registration Logic
    let user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "User Already Exists" });

    user = new User({ name, email, password });
    await user.save();

    // Create JWT payload
    const payload = { user: { id: user._id, role: user.role } };

    // Sign and return the token along with user data
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res.status(201).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error!");
  }
});

// @route  POST /api/users/login
// @desc   Authenticate User
// @access Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Add .select('+password') to include the password field
    let user = await User.findOne({ email }).select('+password');

    if (!user) return res.status(400).json({ message: "Invalid Credentials" }); 

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

    // Create JWT payload
    const payload = { user: { id: user._id, role: user.role } };

    // Sign and return the token along with user data
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});


// @route GET /api/users/profiles
// @desc  Get Logged-in  user's profile (Protected Route)
// @ acess Private

router.get("/profile", protect, async (req, res) => {
    res.json(req.user);
});

// @route POST /api/users/forgot-password
// @desc Send OTP for password reset
// @access Public
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    // Validate email
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found with this email address" });
    }

    // Check for cooldown (optional: prevent spam)
    const now = new Date();
    if (user.resetOTPExpiry && user.resetOTPExpiry > now) {
      const timeLeft = Math.ceil((user.resetOTPExpiry - now) / 1000 / 60);
      if (timeLeft > 8) { // If more than 8 minutes left, enforce cooldown
        return res.status(429).json({ 
          message: `Please wait ${timeLeft - 8} more minutes before requesting another OTP` 
        });
      }
    }

    // Generate OTP and set expiry (10 minutes from now)
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to database
    user.resetOTP = otp;
    user.resetOTPExpiry = otpExpiry;
    await user.save();

    // Send OTP email
    await sendOTPEmail(email, otp);

    res.status(200).json({
      message: "OTP sent successfully to your email address",
      email: email,
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// @route POST /api/users/reset-password
// @desc Reset password using OTP
// @access Public
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Validate required fields
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    // Validate password length
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found with this email address" });
    }

    // Check if OTP exists
    if (!user.resetOTP || !user.resetOTPExpiry) {
      return res.status(400).json({ message: "No password reset request found. Please request a new OTP." });
    }

    // Check if OTP has expired
    const now = new Date();
    if (user.resetOTPExpiry < now) {
      // Clear expired OTP
      user.resetOTP = null;
      user.resetOTPExpiry = null;
      await user.save();
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Verify OTP
    if (user.resetOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP. Please check and try again." });
    }

    // Update password and clear OTP fields
    user.password = newPassword;
    user.resetOTP = null;
    user.resetOTPExpiry = null;
    await user.save();

    res.status(200).json({
      message: "Password reset successfully. You can now login with your new password.",
    });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;
