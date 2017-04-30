angular.module('EarthTionary').directive('loader', [
  'events',
  function (events) {
    return {
      scope: {},
      templateUrl: 'loader.html',
      link: function (scope) {
        var showSpinnerCount = 0

        scope.displaySpinner = false

        scope.$on(events.SHOW_SPINNER, function () {
          showSpinnerCount++

          if (showSpinnerCount > 0) scope.displaySpinner = true
        })

        scope.$on(events.HIDE_SPINNER, function () {
          showSpinnerCount--

          if (showSpinnerCount <= 0) scope.displaySpinner = false
        })
      }
    }
  }
])