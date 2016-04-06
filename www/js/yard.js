// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ame2', ['ionic'])

.controller('AME2Ctrl', function($scope) {
  // No need for testing data anymore
  $scope.colonies = [
      { name: '16-025'},
      { name: '16-024'},
      { name: '15-106'}
  ];


  // Called when the form is submitted
  $scope.createColony = function(colony) {
    $scope.colonies.push({
      name: colony.name,
    });
    colony.name = "";

  };

  $scope.goHome = function() {
    window.location = 'index.html'
  }

});
