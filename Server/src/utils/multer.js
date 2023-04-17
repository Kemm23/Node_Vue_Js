import multer from "multer"
import path from 'path'

let storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "src/upload/")
  },
  filename: (req, file, callBack) => {
    callBack(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
  },
})

const csvFilter = function (req, file, cb) {
  // Accept images only (jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only csv files are allowed!"
    return cb(new Error("Only csv files are allowed!"), false)
  }
  cb(null, true)
}

let upload = multer({
  storage: storage,
  fileFilter: csvFilter,
})

export default upload