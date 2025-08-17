const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ 
        success: false, 
        message: 'No image data provided' 
      });
    }

    // Log the type of image data received
    console.log('Image type:', typeof image);
    console.log('Image data preview:', image.slice(0, 50) + '...');

    // Validate base64 image
    if (typeof image !== 'string' || !image.startsWith('data:image/')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image format. Must be a base64 encoded image starting with data:image/'
      });
    }

    // Check file size (5MB limit)
    const base64Data = image.split(',')[1];
    if (!base64Data) {
      return res.status(400).json({
        success: false,
        message: 'Invalid base64 image format'
      });
    }

    const base64Size = Buffer.from(base64Data, 'base64').length;
    if (base64Size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'Image size exceeds 5MB limit'
      });
    }

    // Return the base64 image directly
    return res.status(200).json({
      success: true,
      message: 'Image received successfully',
      imageUrl: image  // The base64 string will be stored directly in the database
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// We don't need GET or DELETE endpoints anymore since we're using base64

module.exports = router;
