const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
}

// @desc   Register a New User
// @route  POST /api/auth/register
// @access Public

const registerUser = async (req, res) => {
    const { name, email, password, profileImageUrl } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl
        });

        // return user data with JWT token
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id)
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// @desc   Login User
// @route  POST /api/auth/login
// @access Public

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check if password matches
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Return user data with JWT token
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id)
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });

    }
}

// @desc   get User Profile
// @route  POST /api/auth/profile
// @access Private (Required JWT Token)

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({user});
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });

    }
}

module.exports = {
    registerUser,
    loginUser,
    getUserProfile
};