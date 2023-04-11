import express from "express"
import { userController } from "../controller"
import auth from "../middleware/auth"
import path from 'path'
const multer = require("multer")

let route = express.Router()

var storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "./uploads/")
  },
  filename: (req, file, callBack) => {
    callBack(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
  },
})

const csvFilter = function (req, file, cb) {
  // Accept images only (jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)
  if (!file.originalname.match(/\.csv$/)) {
    req.fileValidationError = "Only csv files are allowed!"
    return cb(new Error("Only csv files are allowed!"), false)
  }
  cb(null, true)
}

var upload = multer({
  storage: storage,
  fileFilter: csvFilter,
})

let initApiRoutes = (app) => {
  route.post("/login", auth.validateJWT, userController.handleLogin)
  route.get("/users/:id", userController.handleGetUserData)
  route.get("/getInfo", userController.getInfo)
  route.post("/exportFile", userController.exportFile)
  route.post("/uploadfile", upload.single("uploadfile"), userController.importFile)
  return app.use("/api", route)
}

export default initApiRoutes
