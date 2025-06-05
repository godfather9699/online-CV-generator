const express = require('express');
const { getUserResume, createResume, getResumeById, updateResume, deleteResume }
 = require('../controllers/resumeController');
const { protect } = require('../middlewares/authMiddleware');
const { uploadResumeImage } = require('../controllers/uploadImages');
const upload = require('../middlewares/uploadMiddleware');
const router = express.Router();

router.post('/', protect, createResume); // Create a new resume
router.get('/', protect, getUserResume); // Get resumes
router.get('/:id', protect, getResumeById); // Get resume by ID
router.put('/:id', protect, updateResume); // Update resume by ID
router.post(
    '/:id/upload-image',
    protect,
    upload.fields([
        { name: 'thumbnail' },
        { name: 'profileImage' }
    ]),
    uploadResumeImage
);// Upload resume image

router.delete('/:id', protect, deleteResume); // Delete resume by ID

module.exports = router;