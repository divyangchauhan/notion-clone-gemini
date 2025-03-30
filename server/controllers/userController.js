const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
  // We need a JWT_SECRET in the .env file
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Example: token expires in 30 days
  });
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user (password hashing is handled by the model pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
        // Don't send back the password field even if selected explicitly
        const userResponse = user.toObject();
        delete userResponse.password;

      res.status(201).json({
        ...userResponse,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for user email
    // Explicitly select password because it's set to select: false in the schema
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      // Don't send back the password field
      const userResponse = user.toObject();
      delete userResponse.password;

      res.json({
        ...userResponse,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' }); // 401 Unauthorized
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// @desc    Get user data (Example of a protected route)
// @route   GET /api/users/me
// @access  Private
// const getMe = async (req, res) => {
//   // We get req.user from the protect middleware
//   // const user = await User.findById(req.user.id).select('-password');
//   // res.status(200).json(user);
//   res.status(200).json({ message: 'Get Me route placeholder'}) // Placeholder
// };

module.exports = {
  registerUser,
  loginUser,
  // getMe,
};
