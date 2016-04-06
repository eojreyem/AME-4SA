// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ame5', ['ionic'])

.controller('AME5Ctrl', function($scope) {
  // No need for testing data anymore
  $scope.visits = [
    { date: 'May 9, 2016'},
    { date: 'Apr 31, 2016'},
    { date: 'Apr 22, 2016'},
  ];
  $scope.colonies = [
    { name: '16-012'},
    { name: '15-129'},
  ];

  $scope.goToColony = function(colony) {
    window.location = 'colony.html'
  }

});
