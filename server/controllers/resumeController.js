const fs = require('fs');
const path = require('node:path');
const Resume = require('../models/Resume');
const { findOneAndDelete } = require('../models/User');

// @dec     Create a new Resume
// @route   POST /api/resume
// @access  Private

const createResume = async (req, res) => {
    try {
        const { title } = req.body;

        // default template 
        const defaultResumeData = {
            profileInfo: {
                profileImg: null,
                previewUrl: '',
                name: '',
                designation: '',
                summary: '',
            },
            contactInfo: {
                email: '',
                phone: '',
                location: '',
                linkedin: '',
                github: '',
                website: ''
            },
            workExperience: [
                {
                    company: '',
                    role: '',
                    startDate: '',
                    endDate: '',
                    description: ''
                }
            ],
            education: [
                {
                    degree: '',
                    institution: '',
                    startDate: '',
                    endDate: ''
                }
            ],
            skills: [
                {
                    name: '',
                    progress: 0
                }
            ],
            projects: [
                {
                    title: '',
                    description: '',
                    github: '',
                    liveDemo: ''
                }
            ],
            certifications: [
                {
                    title: '',
                    issuer: '',
                    year: ''
                }
            ],
            languages: [
                {
                    name: '',
                    progress: 0
                }
            ],
            interests: [''],
        };

        // Create a new resume instance
        const resume = await Resume.create({
            userId: req.user._id,
            title: title || 'My Resume',
            ...defaultResumeData,
        });

        res.status(201).json({ resume, message: 'Resume created successfully' });

    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });

    }
};

// @dec     Get all Resumes for logged-in userr
// @route   GET /api/resume
// @access  Private
const getUserResume = async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.user._id }).sort({ updatedAt: -1 });
        res.status(200).json(resumes);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @dec     Get single Resume by ID
// @route   GET /api/resume/:id
// @access  Private
const getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        res.status(200).json(resume);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @dec     Update Resume by ID
// @route   PUT /api/resume/:id
// @access  Private
const updateResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        Object.assign(resume, req.body); // Update resume with request body
        const updatedResume = await resume.save(); // Save the updated resume
        res.status(200).json(updatedResume);
    } catch (error) {
         console.error('Update error:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @dec     Delete Resume by ID
// @route   DELETE /api/resume/:id
// @access  Private

const deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        //  delete thumbnailLink and profilePreviewUrl image from uploads folder
        const uploadsFolder = path.join(__dirname, '..', 'uploads');
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        if (resume.thumbnailLink) {
            const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink));
            if (fs.existsSync(oldThumbnail)) fs.unlinkSync(oldThumbnail);
        }

        if (resume.profileInfo?.profilePreviewUrl) {
            const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl));
            if (fs.existsSync(oldProfile)) fs.unlinkSync(oldProfile);
        }

        const deleted = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!deleted) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        res.status(200).json({ message: 'Resume deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });

    }
};


module.exports = {
    createResume,
    getUserResume,
    getResumeById,
    updateResume,
    deleteResume
};