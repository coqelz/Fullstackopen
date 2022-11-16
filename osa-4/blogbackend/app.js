const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const config = require('./utils/config')
const middleware = require('./utils/middleware')

logger.info('connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('Error with MongoDB:', error.message)
  })

  app.use(express.json())
  app.use(cors())
  app.use(middleware.requestLogger)

  app.use('/api/blogs', blogsRouter)

  app.use(middleware.unknownEndpoint)
  app.use(middleware.errorHandler)
  module.exports = app
  