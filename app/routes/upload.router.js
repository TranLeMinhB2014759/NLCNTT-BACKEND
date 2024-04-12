const express = require("express");
const uploaderController = require("../controllers/uploader.controller");
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require("../config/cloudinary.config");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const { type } = req.params;
    return {
      allowedFormats: ['jpg', 'png'],
      folder: `image_upload_${type}`
    };
  },
});

const upload = multer({ storage: storage });

router.post("/upload/:type", upload.single('image'), uploaderController.uploadImage);
router.delete("/remove/:publicID", uploaderController.removeImage);

module.exports = router;
