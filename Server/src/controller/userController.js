import jwt from "jsonwebtoken"
import db from "../models"
import appRoot from "app-root-path"
import userService from "../services/userServices"
import messageResponse from "@/utils/message"
import path from 'path'
import multer from "multer"
const fs = require("fs")
const csv = require("fast-csv")
const csvtojson = require("csvtojson")
require("dotenv").config()

let loginUser = async (req, res) => {
  let email = req.body.email
  let password = req.body.password
  if (!email) {
    return res.json({
      message: 0,
      errors: {
        errCode: "E1000",
        errMsg: "The email field is required",
      },
    })
  }
  if (!password) {
    return res.json({
      message: 0,
      errors: {
        errCode: "E1001",
        errMsg: "The password field is required",
      },
    })
  }
  let isExist = await userService.checkEmailUser(email)
  if (!isExist) {
    return res.json({
      message: 0,
      errors: {
        errCode: "E1002",
        errMsg: "The email is invalid",
      },
    })
  }
  let isValidUser = await userService.checkPasswordUser(email, password)
  if (!isValidUser) {
    return res.json({
      massage: 0,
      errors: {
        errCode: "E1003",
        errMsg: "Password is wrong",
      },
    })
  }
  let token = jwt.sign(isValidUser.dataValues, process.env.SECRET_TOKEN, { expiresIn: "1h" })
  return res.json({
    message: 1,
    accessToken: token,
  })
}

let registerUser = async (req, res) => {
  let data = req.body
  let isExitEmail = await userService.checkEmailUser(data.email)
  if (isExitEmail) {
    return res.json(messageResponse("error", "Email is already exist"))
  }
  let result = await userService.handleRegister(data)
  if (!result) {
    return res.json(messageResponse("error", "Register Failed"))
  }
  return res.json({
    message: 1,
    data: result,
  })
}

let getListUser = async (req, res) => {
  let listUser = await userService.handleGetListUser()
  if (!listUser) {
    return res.json(messageResponse("error", "Cannot get the list user"))
  }
  return res.json(messageResponse("success", listUser))
}

let getDetailUser = async (req, res) => {
  const id = req.params.id
  let user = await userService.handleGetUser(id)
  if (!user) {
    return res.json(messageResponse("error", "Cannot find the specific user"))
  }
  return res.json(messageResponse("success", user))
}

let createUser = async (req, res) => {
  let data = req.body
  let isExitEmail = await userService.checkEmailUser(data.email)
  if (isExitEmail) {
    return res.json(messageResponse("error", "Email is already exist"))
  }
  let result = await userService.handleRegister(data)
  if (!result) {
    return res.json(messageResponse("error", "Create New User Failed"))
  }
  return res.json({
    message: 1,
    data: result,
  })
}

let deleteUser = async (req, res) => {
  let userId = req.params.id 
  let result = await userService.handleDeleteUser(userId)
  if (!result) {
    return res.json(messageResponse('error', 'Cannot delete user'))
  }
  return res.json(messageResponse('success', result))
}

let updateUser = async (req, res) => {
  let userId = req.params.id
  let result =  await userService.handleUpdateUser(req.body, userId)
  if (result[0] === 0) {
    return res.json(messageResponse('error', 'Cannot find the user to update'))
  }
  return res.json(messageResponse('success',result))
}

let exportFile = async (req, res) => {
  const dataDB = await userService.handleGetListUser()
  if (!dataDB) {
    return res.json(messageResponse("error", "Cannot export the user file"))
  }

  const fileName = Date.now() + "_users.csv"

  const ws = fs.createWriteStream(`src/export/${fileName}`)

  const csvOptions = { writeBOM: true, headers: true }

  csv
    .write(dataDB, csvOptions)
    .pipe(ws)

  ws.on("finish", () => {
    res.setHeader("Content-disposition", `attachment; filename=${fileName}`)
    res.set("Content-Type", "text/csv")
    fs.createReadStream(`src/export/${fileName}`).pipe(res)
  })

}

let importFile = (req, res) => {
  const results = []
  fs.createReadStream(req.file.path)
    .pipe(csv.parse({headers: true}))
    .on("error", (error) => console.error(error))
    .on("data", (row) => {
      delete row.id
      results.push(row)
    })
    .on("end", () => {
      db.User.bulkCreate(results)
        .then((result) => {
          res.send(`Imported ${result.length} rows`)
        })
        .catch((error) => {
          console.error(error)
          res.status(500).send("Error importing data")
        })
    })
}

let importImg = (req, res) => {
  const filePath = req.file.path
  const fileName = req.file.filename
  const html = `<img src="${process.env.BASE_URL}/${fileName}" alt="image">`
  return res.send(html)
  // let result = "You have uploaded these images: <hr />"
  // const files = req.files
  // let index, len

  // for (index = 0, len = files.length; index < len; ++index) {
  //   result += `<img src="${process.env.BASE_URL}/${files[index].filename}" width="300" style="margin-right: 20px;">`
  // }
  // res.send(result)
}


export default {
  loginUser,
  registerUser,
  getListUser,
  getDetailUser,
  createUser,
  deleteUser,
  updateUser,
  exportFile,
  importFile,
  importImg
}
