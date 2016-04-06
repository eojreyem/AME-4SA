// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ame4', ['ionic'])

.controller('AME4Ctrl', function($scope) {
  // No need for testing data anymore
  $scope.queens = [
      { name: '15-021'}
  ];

});
