import express from "express"
import { userController } from "../controller"
import auth from "../middleware/auth"
import upload from "../utils/multer"


let route = express.Router()

let initApiRoutes = (app) => {
  route.post("/login", userController.loginUser)
  route.post("/register", userController.registerUser)
  route.get("/users", userController.getListUser)
  route.get("/users/:id", userController.getDetailUser)
  route.post("/create-user", userController.createUser)
  route.post("/delete-user/:id", userController.deleteUser)
  route.post("/update-user/:id", userController.updateUser)
  route.get("/exportFileUser", userController.exportFile)
  route.post("/uploadFileUser", upload.single("uploadfile"), userController.importFile)

  route.post("/uploadFileImg", upload.single("uploadfile"), userController.importImg)
  return app.use("/api", route)
}

export default initApiRoutes
