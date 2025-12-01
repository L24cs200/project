// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../User'); // User model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- Register a new user ---
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Check if all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // 2. Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // 3. Create a new user instance
    user = new User({
      name,
      email,
      password,
    });

    // 4. Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 5. Save the user to the database
    await user.save();

    res.status(201).json({ msg: 'User registered successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- Login an existing user ---
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please provide email and password' });
    }

    // 2. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 3. Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 4. Create a JWT payload
    const payload = {
      user: {
        id: user.id,
      },
    };

    // 5. Sign the JWT
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' }, // Token expires in 5 hours
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { name: user.name } }); // Send token and user name back
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;