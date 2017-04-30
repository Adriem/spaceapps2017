// This file defines the routes for the express application

var express = require('express')
var _ = require('lodash')
var Definition = require('../mongoose/definition')
var Acronym = require('../mongoose/acronym')
var routes = express.Router()
var acronymRoutes = express.Router()
var wordRoutes = express.Router()
var definitionRoutes = express.Router()

routes.get('/', function (req,res) {
  res.json({ message: 'Welcome to Earthtionary' })
})

acronymRoutes.route('/acronym')

definitionRoutes.route('/definition/:id')
    .put(function(req, res) {

                // get definition
                Definition.findById(req.params.id, function(err, definition) {

                    if (err)
                        res.send(err);

                    definition.text = req.body.text;  // update definition text
                    definition.words = definition.words;

                    // save definition text
                    definition.save(function(err) {
                        if (err)
                            res.send(err);

                        res.json(definition);
                    });

                });
            });



    acronymRoutes.route('/acronym/:name').get(function (req, res) {
        if (req.params.name) {
          Acronym.find({ name: req.params.name }, function (err, acronyms) {
              var words = acronyms.map(function(acronym){
               console.log(acronym.words)
               console.log(req.params.name)
               //Hago la busqueda de la definicion
               Definition.find({ words: acronym.words }, function (err, definitions) {
                    console.log(definitions)
                 var defArray = definitions.map(function(defini){
                    var dObject = {
                             def_id: defini._id,
                             acronym: acronym.name,
                             word: defini.words,
                             text:defini.text,
                             positive_vote: defini.positive_vote,
                             negative_vote: defini.negative_vote};
                    return dObject
                 });
                 res.json(defArray)
               });
          });
        });
      }});


      wordRoutes.route('/word/:word').get(function (req, res) {
              if (req.params.name) {
                Definition.find({ words: req.params.word }, function (err, definitions) {
                    var words = definitions.map(function(definition){
                     console.log(definition.words)
                     console.log(req.params.name)
                     //Hago la busqueda de la definicion
                     Acronym.find({ words: definition.words }, function (err, acronyms) {
                          console.log(acronyms)
                       var defArray = acronyms.map(function(acronym){
                          var dObject = {
                                   def_id: defini._id,
                                   acronym: acronym.name,
                                   word: defini.words,
                                   text:defini.text,
                                   positive_vote: defini.positive_vote,
                                   negative_vote: defini.negative_vote};
                          return dObject
                       });
                       res.json(defArray)
                     });
                });
              });
            }});


   // REGISTER OUR ROUTES -------------------------------
   // all of our routes will be prefixed with /earthtionary
   routes.use('/earthtionary', acronymRoutes);
   routes.use('/earthtionary', wordRoutes);
   routes.use('/earthtionary', definitionRoutes);

   module.exports = routes

