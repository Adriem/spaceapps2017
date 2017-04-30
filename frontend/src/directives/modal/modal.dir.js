angular
  .module('EarthTionary')
  .directive('modal', [
    'events',
    function (events) {
      return {
        templateUrl: 'modal2.html',
        restrict: 'AE',
        transclude: {
          header: 'modalHeader',
          body: '?modalBody',
          footer: '?modalFooter'
        },
        scope: {},
        link: function (scope, element, attrs) {
          scope.hidden = true

          scope.$on(events.SHOW_MODAL, function (event, payload) {
            console.log(payload.id, attrs.id)
            if (payload.id === attrs.id) scope.hidden = false
          })

          scope.$on(events.HIDE_MODAL, function (event, payload) {
            if (payload.id === attrs.id) scope.hidden = true
          })
        }
      }
    }
  ])
  .directive('modalBootstrap', [
    'events',
    function (events) {
      return {
        templateUrl: 'modal.html',
        restrict: 'AE',
        transclude: {
          header: 'modalHeader',
          body: '?modalBody',
          footer: '?modalFooter'
        },
        scope: {},
        link: function (scope, element, attrs) {
          scope.closeModal = function () {
            element.modal('hide')
          }

          scope.$on(events.SHOW_MODAL, function (event, payload) {
            if (payload.id === attrs.id) element.modal('show')
          })

          scope.$on(events.HIDE_MODAL, function (event, payload) {
            if (payload.id === attrs.id) element.modal('hide')
          })
        }
      }
    }
  ])
