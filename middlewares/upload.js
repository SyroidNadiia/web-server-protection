const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const tmpDir = path.join(__dirname, "../", "./tmp");

const multerConfig = multer.diskStorage({
  destination: tmpDir,
  filename: (req, file, cb) => {
    const uniqueFilename = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueFilename);
  },
});

const upload = multer({
  storage: multerConfig,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Неприпустимий тип файлу"));
    }
  },
});

const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ error: "Помилка завантаження файлу" });
  } else {
    res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
};

module.exports = { upload, handleUploadError };
