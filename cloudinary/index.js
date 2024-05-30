const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINALY_CLOUD_NAME,
  api_key: process.env.CLOUDINALY_API_KEY,
  api_secret: process.env.CLOUDINALY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'YelpCamp',
        allowed_format: ["jpeg", "jpg", "JPG", "JPEG", "png", "PNG", "gif", "GIF", "webp", "WEBP"],
    },
});

module.exports = {
    cloudinary,
    storage,
}
