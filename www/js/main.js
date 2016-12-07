// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('ameApp')

.controller('MainCtrl', function($ionicPlatform, $scope, $location, $cordovaSQLite, YardHelper) {
  //loads a list of yards in 4SA
  $ionicPlatform.ready(function() {
    YardHelper.getAllYards().then(function(yards){

      YardHelper.getColoniesInYard(yards[0].id).then(function(colonies){
        //TODO: expand so this works for all yards.
        yards[0].numColoniesInYard = colonies.length;
      });

      $scope.yards = yards;
    });
  });


  //Create a new yard
  $scope.createYard = function() {
    var name = document.getElementById("newyardname");
    YardHelper.saveYard(name.value);
    name.value = ""
    YardHelper.getAllYards().then(function(yards){
      $scope.yards = yards;
    });
  };

  $scope.goToYard = function (yard){
    $location.url('/yard/' + yard.id);
  }

  $scope.deleteYard = function (yard){
    //TODO: if ($scope.numColoniesInYard == 0){    Remove redundant check in yard_helper.js
    YardHelper.deleteYard(yard)
    $scope.yards = $scope.yards.filter(function(el){
      return el.name !== yard.name;
    });

    //TODO: refresh list of yards after deletion.
    //TODO: archive yards instead of deleting.
  }

/*  $scope.dropColonies = function (){
    $cordovaSQLite.execute(db, "DROP TABLE Colonies"); //Use to remove a table
  } */
  $scope.dropQueens = function (){
    $cordovaSQLite.execute(db, "DROP TABLE Queens"); //Use to remove a table
  }
  $scope.dropVisits = function (){
    $cordovaSQLite.execute(db, "DROP TABLE Visits"); //Use to remove a table
  }


});
