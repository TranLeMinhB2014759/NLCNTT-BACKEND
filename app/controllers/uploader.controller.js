const cloudinary = require("../config/cloudinary.config");

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const image = req.file;
    const results = await cloudinary.uploader.upload(image.path, {
      eager: false,
    });

    // If you want to save the file details in your database, you can do it here
    return res.status(201).json({
      message: "Uploaded image successfully!",
      data: { 
        publicID: results.public_id,
        imgURL : results.secure_url,
      }
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ message: "Upload failed!" });
  }
};

exports.removeImage = async (req, res) => {
  try {
    if (!req.params.publicID) {
      return res.status(400).json({ message: 'No publicID provided' });
    }
    
    const public_id = req.params.publicID;
    const results = await cloudinary.uploader.destroy(public_id);

    if (results.result === "not found") {
      throw new Error("File does not exist!");
    }

    return res.status(200).json({
      message: "Deleted image successfully!",
      data: results
    });
  } catch (error) {
    console.error('Error removing image:', error);
    return res.status(500).json({ 
      name: error.name,
      message: error.message, 
    });
  }
};
