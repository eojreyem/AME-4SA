// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ame', ['ionic'])

.controller('AMECtrl', function($scope) {
  // No need for testing data anymore
  $scope.yards = [
    { name: 'Maple Acres', numColonies: "3" }
  ];


  // Called when the form is submitted
  $scope.createYard = function(yard) {
    $scope.yards.push({
      name: yard.name,
      numColonies: yard.numColonies
    });
    yard.name = "";
    yard.numColonies="";

  };

  


});
