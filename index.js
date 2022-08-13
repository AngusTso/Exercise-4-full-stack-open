const http = require('http')
const logger = require('./utils/logger')
const config =  require('./utils/config')
const app = require('./App')

const server = http.createServer(app)

const PORT = config.PORT || 3002
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})