angular.module('EarthTionary', ['ui.router', 'ui-notification']).config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('search', {
        url: '/',
        templateUrl: 'search.tpl.html'
      })
      .state('edit', {
        url: '/edit',
        templateUrl: 'edit.tpl.html'
      })

    $urlRouterProvider.otherwise('/')
  }
])