var mongoose = require('mongoose')

/*
 * Establish connection with the database.
 *
 * callback: Callback that will be called on connect. It takes one argument,
 *           which represents the error.
 */
function connect (callback) {
  var _cb = callback || function (err) {
      if (err) throw err
      console.log('Connected to database')
    }
  var connection = mongoose.connect('mongodb://localhost/earthtionary')
  mongoose.connection.on('error', console.error.bind(console, 'connection-error:'))
  mongoose.connection.once('open', _cb)
}

/*
 * Close connection with the database.
 *
 * callback: Callback that will be called on disconnect. It takes an argument
 *           that represents the error.
 */
function disconnect (callback) {
  var _cb = callback || function (err) {
      if (err) throw err
      console.log('Disconnected from database')
    }
  mongoose.connection.close(_cb)
}

module.exports = {
  connect: connect,
  disconnect: disconnect
}
