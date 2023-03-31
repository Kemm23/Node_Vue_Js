import express from 'express'
import bodyParser from 'body-parser'
import initApiRoutes from './routes/api'
require('dotenv').config()

let app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

initApiRoutes(app)

let port = process.env.PORT || 8080
app.listen(port, () => {
    console.log('Start success backend at port', port)
})