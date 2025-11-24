const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const OTP = require('../models/OTP');
const auth = require('../middleware/auth');
const { sendWelcomeEmail, sendLoginEmail, sendOTPEmail } = require('../utils/emailService');

const router = express.Router();

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP for email verification
router.post(
  '/send-otp',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('name').notEmpty().withMessage('Name is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        return res.status(400).json({ message: firstError.msg || 'Validation failed' });
      }

      const { email, name } = req.body;
      const normalizedEmail = email.toLowerCase().trim();

      // Check if user already exists
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      // Generate OTP
      const otp = generateOTP();

      // Delete any existing OTP for this email
      await OTP.deleteMany({ email: normalizedEmail });

      // Create new OTP
      const otpRecord = new OTP({
        email: normalizedEmail,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      });
      await otpRecord.save();

      // Send OTP email
      try {
        await sendOTPEmail(normalizedEmail, otp);
        console.log(`✅ OTP sent to ${normalizedEmail}`);
      } catch (emailError) {
        console.error('Failed to send OTP email:', emailError);
        // Delete OTP record if email fails
        await OTP.deleteOne({ email: normalizedEmail });
        return res.status(500).json({ 
          message: 'Failed to send verification email. Please check your email address and try again.' 
        });
      }

      res.json({
        message: 'OTP sent to your email. Please check your inbox.',
        email: normalizedEmail,
      });
    } catch (error) {
      console.error('Send OTP error:', error);
      res.status(500).json({ message: error.message || 'Server error. Please try again.' });
    }
  }
);

// Verify OTP and Register
router.post(
  '/verify-otp-and-register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        return res.status(400).json({ message: firstError.msg || 'Validation failed' });
      }

      const { name, email, password, phone, otp } = req.body;
      const normalizedEmail = email.toLowerCase().trim();

      // Find OTP record
      const otpRecord = await OTP.findOne({ email: normalizedEmail });
      
      if (!otpRecord) {
        return res.status(400).json({ message: 'OTP not found or expired. Please request a new OTP.' });
      }

      // Check if OTP is expired
      if (new Date() > otpRecord.expiresAt) {
        await OTP.deleteOne({ email: normalizedEmail });
        return res.status(400).json({ message: 'OTP has expired. Please request a new OTP.' });
      }

      // Check if already verified
      if (otpRecord.verified) {
        return res.status(400).json({ message: 'This OTP has already been used. Please request a new OTP.' });
      }

      // Check attempts
      if (otpRecord.attempts >= 5) {
        await OTP.deleteOne({ email: normalizedEmail });
        return res.status(400).json({ message: 'Too many failed attempts. Please request a new OTP.' });
      }

      // Verify OTP
      if (otpRecord.otp !== otp) {
        otpRecord.attempts += 1;
        await otpRecord.save();
        return res.status(400).json({ 
          message: `Invalid OTP. ${5 - otpRecord.attempts} attempts remaining.` 
        });
      }

      // Check if user already exists (double check)
      let user = await User.findOne({ email: normalizedEmail });
      if (user) {
        await OTP.deleteOne({ email: normalizedEmail });
        return res.status(400).json({ message: 'User already exists' });
      }

      // Mark OTP as verified
      otpRecord.verified = true;
      await otpRecord.save();

      // Create user
      user = new User({ name, email: normalizedEmail, password, phone });
      await user.save();

      // Delete OTP record after successful registration
      await OTP.deleteOne({ email: normalizedEmail });

      // Generate token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      // Send welcome email (non-blocking)
      sendWelcomeEmail(user.email, user.name).catch((err) => {
        console.error('Failed to send welcome email:', err);
      });

      res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        message: 'Email verified and account created successfully!',
      });
    } catch (error) {
      console.error('Registration error:', error);
      if (error.code === 11000) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      res.status(500).json({ message: error.message || 'Server error. Please try again.' });
    }
  }
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        return res.status(400).json({ message: firstError.msg || 'Validation failed' });
      }

      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Generate token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      // Send login notification email (non-blocking)
      const loginTime = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'full',
        timeStyle: 'long',
      });
      sendLoginEmail(user.email, user.name, loginTime).catch((err) => {
        console.error('Failed to send login email:', err);
      });

      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: error.message || 'Server error. Please try again.' });
    }
  }
);

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

