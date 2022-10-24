// middleware that will send the file to cloudinary
// cloudinary config

const cloudinary = require("cloudinary").v2
const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")

// cloudinary credentials

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
})

// bundle config
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    allowedFormats: ["jpg", "png", "svg"],
    folder: "ironpictures"
  }
})

const uploader = multer({
  storage
})

module.exports = uploader