// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('ameApp')

.controller('MainCtrl', function($scope, $cordovaSQLite, $location, YardHelper) {
  // No need for testing data anymore

  //loads a list of yards in 4SA
  $scope.yards = YardHelper.getAllYards();

  //Create a new yard
  $scope.createYard = function() {
    var name = document.getElementById("newyardname");
    YardHelper.saveYard(name.value);
    name.value = ""
    $scope.yards = YardHelper.getAllYards();
  };

  $scope.goToYard = function (yard){
    $location.url('/yard/' + yard.id);
  }

  $scope.countColoniesInYard = function (yardId) {
    // TODO: make this work!!
    $scope.numColoniesInYard = YardHelper.getColoniesInYard(yardId).length;
  }

  $scope.dropYards = function (){
    $cordovaSQLite.execute(db, "DROP TABLE Yards"); //Use to remove a table
  }
  $scope.dropColonies = function (){
    $cordovaSQLite.execute(db, "DROP TABLE Colonies"); //Use to remove a table
  }
  $scope.dropQueens = function (){
    $cordovaSQLite.execute(db, "DROP TABLE Queens"); //Use to remove a table
  }
  $scope.dropVisits = function (){
    $cordovaSQLite.execute(db, "DROP TABLE Visits"); //Use to remove a table
  }


});
