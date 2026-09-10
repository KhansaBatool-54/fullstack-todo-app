const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'todo-app', 
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
  },
});

const upload = multer({ storage });

module.exports = upload;