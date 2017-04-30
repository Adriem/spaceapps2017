angular.module('EarthTionary').controller('searchController', [
  '$rootScope',
  '$state',
  'events',
  'restApiFactory',
  function ($rootScope, $state, events, restApi) {
    var vm = this
    var firstSearchPerformed = false

    function isSearchFormExpanded () {
      return !firstSearchPerformed
    }

    function isSearchCompleted () {
      return !!vm.queryResults
    }

    function performSearch () {
      firstSearchPerformed = true
      vm.queryResults = null
      $rootScope.$broadcast(events.SHOW_SPINNER, {})
      restApi.performSearch(vm.query, vm.queryType)
             .then(function (searchResults) {
               $rootScope.$broadcast(events.HIDE_SPINNER, {})
               vm.queryResults = searchResults
             })
             .catch(function (response) {
               $rootScope.$broadcast(events.HIDE_SPINNER, {})
               vm.queryResults = null
             })
    }

    function editDefinition (definition) {
      $rootScope.selectedDefinition = definition
      $rootScope.newDefinition = false
      $state.go('edit')
    }

    function createDefinition () {
      console.log("DERP")
      $rootScope.selectedDefinition = {
        _id: null,
        term: null,
        body: null,
        acronyms: [],
        alt: [],
        positiveVotes: 0,
        negativeVotes: 0
      }
      $rootScope.newDefinition = true
      $state.go('edit')
    }

    vm.queryResults = null
    vm.query = ''
    vm.queryType = ''

    vm.isSearchFormExpanded = isSearchFormExpanded
    vm.isSearchCompleted = isSearchCompleted
    vm.performSearch = performSearch
    vm.editDefinition = editDefinition
    vm.createDefinition = createDefinition
  }
])
