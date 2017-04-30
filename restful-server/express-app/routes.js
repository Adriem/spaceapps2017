// This file defines the routes for the express application

var express = require('express')
var _ = require('lodash')
var Definition = require('../mongoose/definition')
var Acronym = require('../mongoose/acronym')
var User = require('../mongoose/user')
var Update = require('../mongoose/update')

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
                  console.log(definition, "definition text")
                  if (err)
                    res.send(err);

                  if(definition){
                       definition.text = req.body.text;  // update definition text
                       definition.words = definition.words;
                       definition.positive_vote = definition.positive_vote;
                       definition.negative_vote = definition.negative_vote;
                        // save definition text
                        definition.save(function(err) {
                          if (err)
                            res.send(err);

                          res.json(definition);
                        });
                      }
                    });
              });

definitionRoutes.route('/definition')
.post(function(req, res) {

 var definition = new Definition();
               definition.text = req.body.text;  // update definition text
               var words = req.body.words.split(".");
               definition.words = words[0]
               console.log(definition.words)
               definition.positive_vote = req.body.positive_vote;
               definition.negative_vote = req.body.negative_vote;
                // save definition text
                definition.save(function(err) {
                  if (err)
                    res.send(err);
                  res.json(definition);
                });

              });

definitionRoutes.route('/vote/:id')
.put(function(req, res) {

  Definition.findById(req.params.id, function(err, definition) {

    if (err)
      res.send(err);

            definition.text = definition.text;  // update definition text
            definition.words = definition.words;
            if (req.params.type === "positivo") {
              definition.positive_vote = definition.positive_vote + 1;
            }else{
              definition.negative_vote = definition.negative_vote - 1;
            }

            // save definition text
            definition.save(function(err) {
              if (err)
                res.send(err);

              res.json(definition);
            });

          });
});


acronymRoutes.route('/acronym/:name').get(function (req, res) {
  var defArray = []
  if (req.params.name) {
    Acronym.find({ name: req.params.name }, function (err, acronyms) {
      if (acronyms.length === 0){
       res.json(defArray)
     } else {
      var words = acronyms.map(function(acronym){
       console.log(acronym.words)
       console.log(req.params.name)
                   //Hago la busqueda de la definicion
                   Definition.find({ words: acronym.words }, function (err, definitions) {
                    console.log(definitions)
                    defArray = definitions.map(function(defini){
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
    }
  });
  }});


wordRoutes.route('/word/:name').get(function (req, res) {
  var defArray = []
  if (req.params.name) {
   Acronym.find({ words: req.params.name }, function (err, acronyms) {
    //console.log(acronyms,"acronimos")
    if (acronyms.length === 0){
     res.json(defArray)
   } else {
    var promiseArray = []

    var words = acronyms.map(function(acronym){
      console.log(acronym.words)
      //Hago la busqueda de la definicion
      promiseArray.push(new Promise(function(resolve, reject) {

        Definition.find({ words: acronym.words }, function (err, definitions) {
          resolve(definitions.map(function(defini){
            var dObject = {
              def_id: defini._id,
              acronym: acronym.name,
              word: defini.words,
              text:defini.text,
              positive_vote: defini.positive_vote,
              negative_vote: defini.negative_vote
            };
            return dObject
          }));
        })
      }));
          });
      Promise.all(promiseArray).then(function(promises) {
        res.json(_.flatten(promises))
      })

    };
  })
  }
});


   // REGISTER OUR ROUTES -------------------------------
   // all of our routes will be prefixed with /earthtionary
   routes.use('/earthtionary', acronymRoutes);
   routes.use('/earthtionary', wordRoutes);
   routes.use('/earthtionary', definitionRoutes);

   module.exports = routes

