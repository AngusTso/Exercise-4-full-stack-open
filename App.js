const logger = require('./utils/logger')
const config =  require('./utils/config')
const {requestLogger, unknownEndpoint, errorHandler , userExtractor} =  require('./utils/middleware')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogRoute = require('./controller/Blogs')
const userRoute = require('./controller/Users')
const loginRoute = require('./controller/Login')

const mongoUrl = config.MONGODB_URI
logger.info(`Connecting to ${mongoUrl}`)
mongoose.connect(mongoUrl).then(() => logger.info(`Connected to ${mongoUrl}`)).catch((error) => {
    logger.error(`Error connecting to ${mongoUrl}`)
})

app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use('/api/login', loginRoute)
app.use('/api/blogs' , userExtractor, blogRoute)
app.use('/api/users' , userRoute)
app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app