// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ame3', ['ionic'])

.controller('AME3Ctrl', function($scope) {
  // No need for testing data anymore
  $scope.visits = [
    { date: 'May 9, 2016'},
    { date: 'Apr 31, 2016'},
    { date: 'Apr 22, 2016'},
  ];


  // Called when the form is submitted
  $scope.createColony = function(colony) {
    $scope.colonies.push({
      name: colony.name,
    });
    colony.name = "";

  };

  $scope.goBack = function() {
    window.history.back();
  }

  $scope.createVisit = function(colony) {
    window.location = 'new-visit.html'
  }

});
