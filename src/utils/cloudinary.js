const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload image to Cloudinary
 * @param {string} filePath - Path to the file to upload
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - Upload result
 */
const uploadImage = async (filePath, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'blog_posts',
      ...options
    });

    return result;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Upload image (buffer) to Cloudinary
 * @param {Buffer} buffer - File buffer
 * @param {string} mimetype - File mimetype
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - Upload result
 */
const uploadImageBuffer = async (buffer, mimetype, options = {}) => {
  try {
    const b64 = buffer.toString('base64');
    const dataUri = `data:${mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'blog_posts',
      ...options
    });

    return result;
  } catch (error) {
    console.error('Error uploading image buffer to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of the image to delete
 * @returns {Promise<Object>} - Deletion result
 */
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);

    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw new Error('Failed to delete image');
  }
};

module.exports = {
  uploadImage,
  uploadImageBuffer,
  deleteImage,
  cloudinary
};