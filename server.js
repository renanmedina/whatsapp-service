const app = require('./src/app')
const { baseWebhookURL } = require('./src/config')
require('dotenv').config()
const ApplicationLogger = require('./src/logger');

// Start the server
const port = process.env.PORT || 3000

// Check if BASE_WEBHOOK_URL environment variable is available
if (!baseWebhookURL) {
  ApplicationLogger.error('BASE_WEBHOOK_URL environment variable is not available. Exiting...')
  process.exit(1) // Terminate the application with an error code
}

app.listen(port, () => {
  ApplicationLogger.info(`Server running on port ${port}`)
})
