const express = require('express');
const router = express.Router();
const multer = require('multer');
const { MediaUploadProject } = require('../controllers/MediaUpload.controller');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB size limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  },
});

// Middleware for handling file uploads
const mediaUpload = upload.single('file');

const handleFileUploadErrors = (err, req, res, next) => {
  if (err) {
    let errorMessage = err.message;
    if (err.code === 'LIMIT_FILE_SIZE') {
      errorMessage = 'File size exceeds the 10MB limit.';
    }
    return res.status(400).json({ message: errorMessage });
  }
  next();
};
// @POST /api/media/uploadMedia
// Route to handle media upload
router.post(
  '/uploadMedia',
  mediaUpload,
  handleFileUploadErrors,
  MediaUploadProject
);

module.exports = router;
