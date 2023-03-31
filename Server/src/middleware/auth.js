import jwt from 'jsonwebtoken'
require('dotenv').config()

let validateJWT = (req, res, next) => {
    let authorizationHeader = req.headers.authorization
    let result
    if(authorizationHeader) {
        const token = authorizationHeader.split(" ")[1]
        const options = {
            expiredIn: '1h'
        }
        try {
            result = jwt.verify(token, process.env.SECRET_TOKEN, options)
            req.decode = result
            next()
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({
                message: 'Something wrong with versification'
            })
        }
    }
    else {
        return res.status(401).json({
            message: 'Authentication error. Token required'
        })
    }
}

export default {
    validateJWT
}