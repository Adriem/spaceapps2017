angular.module('EarthTionary').factory('restApiFactory', [
  '$http',
  '$q',
  '$timeout', // DEMO
  function ($http, $q, $timeout) {
    var baseUrl = 'http://10.10.11.35:3000'

    function getAcronyms (query) {
      var acronymsUrl = baseUrl + '/earthtionary/acronym/' + encodeURI(query)
      return $http.get(acronymsUrl)
                  .then(function (response) {
                    return response.data.map(function (definition) {
                      return {
                        _id: definition.def_id,
                        term: _.first(definition.word),
                        body: definition.text,
                        acronyms: [definition.acronym],
                        alt: _.tail(definition.word),
                        positiveVotes: definition.positive_vote,
                        negativeVotes: definition.negative_vote
                      }
                    })
                  })
                  .catch(function (response) {
                    throw response
                  })
    }

    function getTerms (query) {
      var termsUrl = baseUrl + '/earthtionary/word/' + encodeURI(query)
      return $http.get(termsUrl)
                  .then(function (response) {
                    return response.data.map(function (definition) {
                      return {
                        _id: definition.def_id,
                        term: _.first(definition.word),
                        body: definition.text,
                        acronyms: [definition.acronym],
                        alt: _.tail(definition.word),
                        positiveVotes: definition.positive_vote,
                        negativeVotes: definition.negative_vote
                      }
                    })
                  })
                  .catch(function (response) {
                    throw response
                  })
    }

    return {

      /**
       * Perform a query of a term or an acronym against the server
       * @param query     - Term of the query
       * @param queryType - Either 'all', 'term' or 'acronym'
       */
      performSearch: function (query, queryType) {
        switch (queryType) {
          case 'acronyms':
            return getAcronyms(query)
          case 'terms':
            return getTerms(query)
          default:
            return $q.all([
              getAcronyms(query),
              getTerms(query)
            ]).then(function (result) {
              return _.unionBy(result[0], result[1], '_id')
            })
        }
      },

      /**
       * Update a definition into the system
       */
      updateDefinition: function (definition) {
        var updateUrl = [baseUrl, 'earthtionary/definition', definition._id].join('/')

        return $http.put(updateUrl, {
          text: definition.body,
          words: _.concat(definition.term, definition.alt),
        })

        //var deferred = $q.defer()
        //
        //$timeout(function () {
        //  deferred.resolve('Success')
        //}, 1000)
        //
        //return deferred.promise
      },

      /**
       * Create a new definition into the system
       */
      createDefinition: function (definition) {
        var updateUrl = [baseUrl, 'earthtionary/definition'].join('/')

        return $http.post(updateUrl, {
          text: definition.body,
          words: _.concat(definition.term, definition.alt).join(',')
        })
      }
    }
  }
])