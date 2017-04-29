// This file defines the routes for the express application

var express = require('express')

var routes = express.router()

routes.get('/', function () {
  res.json({ message: 'No te rayes que son pilares' })
})

module.exports = routes
