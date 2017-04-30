angular.module('EarthTionary').controller('editController', [
  '$rootScope',
  '$state',
  'events',
  'restApiFactory',
  'notificationFactory',
  function ($rootScope, $state, events, restApi, notification) {
    var vm = this

    function addAcronym () {
      vm.selectedDefinition.acronyms.push(vm.newAcronym)
    }

    function addAltTerm () {
      vm.selectedDefinition.acronyms.push(vm.newAltTerm)
    }

    function onEnter () {
      if (!$rootScope.selectedDefinition) $state.go('search')
      else {
        vm.selectedDefinition = $rootScope.selectedDefinition
        vm.newDefinition = $rootScope.newDefinition
        vm.acronymsField = vm.selectedDefinition.acronyms.join(', ')
        vm.altTermsField = vm.selectedDefinition.alt.join(', ')
      }
    }

    function handleSubmit () {
      vm.selectedDefinition.acronyms = vm.acronymsField
                                         .split(',')
                                         .map(function (x) { return x.trim() })

      vm.selectedDefinition.alt = vm.altTermsField
                                    .split(',')
                                    .map(function (x) { return x.trim() })

      $rootScope.$broadcast(events.SHOW_SPINNER, {})

      if (vm.newDefinition) {
        restApi.createDefinition(vm.selectedDefinition)
               .then(function (result) {
                 $rootScope.$broadcast(events.HIDE_SPINNER, {})
                 notification.success('Definition updated successfully')
                 $state.go('search')
               })
               .catch(function (result) {
                 $rootScope.$broadcast(events.HIDE_SPINNER, {})
                 notification.error('Could not update the definition :(')
               })
      } else {
        restApi.updateDefinition(vm.selectedDefinition)
               .then(function (result) {
                 $rootScope.$broadcast(events.HIDE_SPINNER, {})
                 notification.success('Definition updated successfully')
                 $state.go('search')
               })
               .catch(function (result) {
                 $rootScope.$broadcast(events.HIDE_SPINNER, {})
                 notification.error('Could not update the definition :(')
               })
      }
    }

    function handleCancel () {
      $state.go('search')
    }

    vm.addAcronym = addAcronym
    vm.addAltTerm = addAltTerm
    vm.handleSubmit = handleSubmit
    vm.handleCancel = handleCancel

    onEnter()
  }
])