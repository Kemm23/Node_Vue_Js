import express from 'express'
import { userController } from '../controller'
import auth from '../middleware/auth'

let route = express.Router()

let initApiRoutes = (app) => {
    route.post('/login', auth.validateJWT, userController.handleLogin)
    route.get('/users/:id', userController.handleGetUserData)
    return app.use('/api', route)
}

export default initApiRoutes