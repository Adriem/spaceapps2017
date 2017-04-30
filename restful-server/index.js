var readline = require('readline')

var expressApp = require('./express-app/app.js')
var databaseConnector = require('./mongoose/connector.js')

var port = process.env.PORT || 3000
var serverInstance

// If running on windows, emit SIGINT on ^C from stdin, watch
// http://stackoverflow.com/a/14861513/3376793 for more info
if (process.platform === 'win32') {
  var lineReader = readline.createInterface({
                                              input: process.stdin,
                                              output: process.stdout
                                            })
  lineReader.on('SIGINT', function () { process.emit('SIGINT') })
}

// Properly close server on Ctrl-c
process.on('SIGINT', function () {
  console.log('Closing server')
  stop()
  process.exit()
})

/**
 * Start application
 * @param port - Port for the application to listen
 */
function start (port) {
  serverInstance = expressApp.listen(port)
  databaseConnector.connect()
}

/**
 * Stop application
 */
function stop () {
  serverInstance.close()
  databaseConnector.disconnect()
}

// Start server
start(port)
console.log('Something beautiful is happening on port ' + port)
