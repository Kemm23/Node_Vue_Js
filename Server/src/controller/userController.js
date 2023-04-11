import bcrypt from "bcryptjs"
import userService from "../services/userServices"
import jwt from "jsonwebtoken"
import db from "../models"
const csv = require("fast-csv")
require("dotenv").config()

let handleLogin = async (req, res) => {
  console.log(req.body)
  let userEmail = req.body.email
  let userPassword = req.body.password
  if (userEmail && userPassword) {
    let dataUser = await userService.getUserData(userEmail, userPassword)
    if (dataUser) {
      let options = {
        expiresIn: "1h",
      }
      let token = jwt.sign(dataUser, process.env.SECRET_TOKEN, options)
      return res.status(200).json({
        message: "login success",
        data: dataUser,
        access_token: token,
      })
    } else {
      return res.status(500).json({
        message: "User validation",
      })
    }
  } else {
    return res.status(500).json({
      message: "Missing params email or password",
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
        errMsg: "Can not find the user",
      },
    })
  }
  return res.json({
    message: 1,
    data: dataUser,
  })
}

let getInfo = async (req, res) => {
  let result = await db.Doctor.scope("checkId1").findOne({
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: [
      {
        model: db.Patient,
        through: {
          attributes: [],
        },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    ],
  })
  if (result) {
    return res.json({
      message: 0,
      data: result,
    })
  } else {
    return res.json({
      message: 1,
      errors: {
        errCode: 2,
        errMsg: "Code sai r",
      },
    })
  }
}

let exportFile = async (req, res) => {}

let importFile = (req, res) => {
  const fileRows = []
  csv
    .parseFile(req.file.path)
    .on("error", (error) => console.error(error))
    .on("data", (row) => {
      fileRows.push(row)
    })
    .on("end", () => {
      // Xử lý dữ liệu từ file CSV và lưu vào database MySQL bằng Sequelize
      let newVal = fileRows
        .map((row, index) => ({
          name: row[1],
          slug: row[2],
          price: Number(row[3]),
          description: row[4],
          categoryName: row[5],
        }))
      newVal.shift()
      db.Product.bulkCreate(newVal)
        .then((result) => {
          res.send(`Imported ${result.length} rows`)
        })
        .catch((error) => {
          console.error(error)
          res.status(500).send("Error importing data")
        })
    })
}

export default {
  handleLogin,
  handleGetUserData,
  getInfo,
  exportFile,
  importFile,
}
