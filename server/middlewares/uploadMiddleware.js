// server/middlewares/uploadMiddleware.js
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // Always allow if this is the “thumbnail” field (we know it's an auto‐generated PNG)
  if (file.fieldname === 'thumbnail') {
    cb(null, true);
    return;
  }

  // Otherwise (profileImage, etc.), only accept actual JPEG/PNG
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'), false);
  }
};

const upload = multer({ storage, fileFilter });
module.exports = upload;
