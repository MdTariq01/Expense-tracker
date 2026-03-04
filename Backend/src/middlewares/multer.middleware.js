import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // not a good way to store what if we got same name file 2 times so change the name of file most of the time
  }
})

export const upload = multer({
    storage,
})