import bcrypt from 'bcryptjs'
import userService from '../services/userServices'
import jwt from 'jsonwebtoken'
require('dotenv').config()

let handleLogin = async (req, res) => {
    console.log(req.body)
    let userEmail = req.body.email
    let userPassword = req.body.password
    if (userEmail && userPassword) {
        let dataUser = await userService.getUserData(userEmail, userPassword)
        if (dataUser) {
            let options = {
                expiresIn: '1h'
            }
            let token = jwt.sign(dataUser, process.env.SECRET_TOKEN, options)
            return res.status(200).json({
                message: 'login success',
                data: dataUser,
                access_token: token
            })
        } else {
            return res.status(500).json({
                message: 'User validation'
            })
        }
    } else {
        return res.status(500).json({
            message: 'Missing params email or password'
        })
    }
}

let handleGetUserData = async (req, res) => {
    const userId = req.params.id
    let dataUser = await userService.getInfoUser(userId)
    if (!dataUser) {
        return res.json({
            message: 0,
            data: {},
            errors: {
                errCode: 1,
                errMsg: 'Can not find the user'
            }
        })
    }
    return res.json({
        message: 1,
        data: dataUser,
    })
}

export default {
    handleLogin,
    handleGetUserData
}