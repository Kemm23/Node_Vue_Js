import db from '../models'
import bcrypt from 'bcryptjs'

let checkEmailUser = (emailLogin) => {
    return new Promise(async(resolve, reject) => {
        try {
        let data = await db.User.findOne({
            where: {
                email: emailLogin
            },
            attributes: ['email']
        })
        if (data) {
            resolve(true)
        } else {
            resolve(false)
        }
        } catch (e) {
            reject(e)
        }
    })
}

let checkPasswordUser = (emailLogin, passwordLogin) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataUser = await db.User.findOne({
                where: {
                    email: emailLogin
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            })
            let isValidPassword = await bcrypt.compare(passwordLogin, dataUser.password)
            if (!dataUser || !isValidPassword) {
                resolve(false)
            }
            resolve(dataUser)
        } catch (e) {
            reject(e)
        }
    })
}

let handleRegister = (data) => {
    return new Promise(async (resolve, reject) =>{
        try {
            let newPassword = await bcrypt.hash(data.password, 10)
            let result = await db.User.create({...data, password: newPassword})
            if (!result) {
                resolve(false)
            }
            resolve(result)
        } catch (e) {
            reject(e)
        }
    })
}

let handleGetListUser = () => {
    return new Promise(async(resolve, reject) => {
      try {
        let result = await db.User.findAll({
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt']
            }
        })
        if (!result) {
            resolve(false)
        }
        resolve(result)
      } catch (e) {
        reject(e)
      }
    })
} 

let handleGetUser = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let result = await db.User.findByPk(userId, {
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'password']
                }
            })
            if (!result) {
                resolve(false)
            }
            resolve (result)
        } catch (e) {
            reject(e)
        }
    })
}

let handleDeleteUser = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let result = await db.User.destroy({
                where: {
                    id: userId
                }
            })
            resolve(result)
        } catch (e) {
            reject(e)
        }
    })
}

let handleUpdateUser = (data, userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let dataDB = await db.User.update(data, {
                where: {
                    id: userId
                }
            })
            resolve(dataDB)
        } catch (e) {
            reject(e)
        }
    })
}

export default {
  handleGetListUser,
  handleGetUser,
  checkEmailUser,
  handleRegister,
  checkPasswordUser,
  handleDeleteUser,
  handleUpdateUser
}