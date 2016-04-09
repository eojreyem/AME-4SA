// Ionic Starter App
var db = null;
var currentYards = [];

// angular.module is a global place for creating, registering and retrieving Angular modules
angular
.module('ameApp', [
  'ionic',
  'ngCordova'
])

.config(function ($stateProvider, $urlRouterProvider, $sceDelegateProvider) {

  $stateProvider

  .state('index', {
    url: '/',
    templateUrl: 'views/main.html',
    controller: 'MainCtrl'
  })
  .state('yard', {
    url: '/{yardName}',
    templateUrl: 'views/yard.html',
    controller: 'YardCtrl'
  })
  .state('colony', {
    url: '/{yardName}/C{colonyName}',
    templateUrl: 'views/colony.html',
    controller: 'ColonyCtrl'
  })
  .state('queen', {
    url: '/{yardName}/C{colonyName}/Q{queenName}',
    templateUrl: 'views/queen.html',
    controller: 'QueenCtrl'
  })
  .state('visit', {
    url: '/{yardName}/C{colonyName}/Visit/{visitDate}',
    templateUrl: 'views/visit.html',
    controller: 'VisitCtrl'
  })
});
