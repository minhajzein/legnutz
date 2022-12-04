const multer = require("multer");
const sharp = require("sharp");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

const uploadFiles = upload.array("PImage",4);

const uploadImages = (req, res, next) => {
  uploadFiles(req, res, err => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.send("Too many files to upload.");
      }
    } else if (err) {
      return res.send(err);
    }

    next();
  });
};

const resizeImages = async (req, res, next) => {
  if (!req.files) return next();

  req.body.images = [];
  await Promise.all(
    req.files.map(async file => {
      const filename = file.originalname.replace(/\..+$/, "");
      const newFilename = `${file.fieldname}-${Date.now()}-${Math.random()}.jpeg`;

      await sharp(file.buffer)
        .resize(350, 350)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`./public/images/${newFilename}`);
        console.log(newFilename);
      req.body.images.push(newFilename);
    })
  );

  next();
};

module.exports = {
  uploadImages: uploadImages,
  resizeImages: resizeImages
};