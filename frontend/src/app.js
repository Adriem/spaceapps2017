angular.module('EarthTionary', ['ui.router']).config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('search', {
        url: '/',
        templateUrl: 'search.tpl.html'
      })
      .state('results', {
        url: '/results',
        templateUrl: 'results.tpl.html'
      })
      .state('edit', {
        url: '/edit',
        templateUrl: 'edit.tpl.html'
      })

    $urlRouterProvider.otherwise('/')
  }
])