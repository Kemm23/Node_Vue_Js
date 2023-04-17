import express from 'express'

let configViewEngine = (app) => {
    app.use(express.static('./src/public'))
    app.use(express.static("./src/upload"))
    app.set("view engine", "ejs")
    app.set("views", "./src/views")
}

export default configViewEngine