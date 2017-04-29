// General configuration for the express application

var express = require('express')
var parser = require('body-parser')
var morgan = require('morgan')

var routes = require('./routes')

var app = express()

app.use(parser.json())
app.use(parser.urlencoded({ extended: true }))
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'HEAD, OPTIONS, GET, POST, PUT, DELETE')
  res.header('Access-Control-Allow-Headers',
             'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  next()
})

// Log request if not testing
app.use(morgan('dev', {
  skip: function () { return process.env.NODE_ENV === 'test' }
}))

app.use(routes)

module.exports = app
