const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (token && token.startsWith('Bearer ')) {
            token = token.split(' ')[1]; // Extract the token from the Bearer string
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decode.id).select('-password');
            next();
        }else{
            return res.status(401).json({ message: "Not authorized, no token" });
        }
    } catch (error) {
        return res.status(401).json({ message: " token failed", error: error.message });
    }
}

module.exports = { protect };