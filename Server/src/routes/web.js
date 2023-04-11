import express from "express"
import { userController } from "../controller"
import auth from "../middleware/auth"

let route = express.Router()

let initWebRoutes = (app) => {
    route.get('/', (req, res) => res.render('handleFiles.ejs'))
  return app.use("/", route)
}

export default initWebRoutes
