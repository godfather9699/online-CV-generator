const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware'); // Assuming you have a middleware for handling file uploads

const router = express.Router();

// Auth Routes
router.post('/register', registerUser); // Register Route
router.post('/login', loginUser); // Login Route
router.get('/profile', protect, getUserProfile); // Get User Profile Route
router.post('/upload-image', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
})


module.exports = router;