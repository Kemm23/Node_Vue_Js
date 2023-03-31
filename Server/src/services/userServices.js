import db from '../models'
const { Sequelize } = require("sequelize")

let getUserData = (userEmail, userPassword) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({where: {
                email: userEmail
            }})
            if (!user) {
                resolve(false)
            }
            let checkPass = Boolean(user.password == userPassword)
            if (checkPass) {
                resolve(user)
            } else {
                resolve(false)
            }
        } catch(e) {
            reject(e)
        }
    })
} 

let getInfoUser = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let result = await db.User.findOne({
            where: {
                id: userId
            },
            attributes: {
                include: [[Sequelize.col('Role.text'), 'roleText']]
            },
            include: [
            {
                model: db.Role,
                attributes: [],
            }
            ],
            raw: true,
            nest: true,
        })
        if (!result) {
            resolve(false)
        }
            resolve(result)
        } catch(e) {
            reject(e)
        }
    })
}

export default {
    getUserData,
    getInfoUser
}