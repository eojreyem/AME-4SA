// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ameApp')

.controller('QueenCtrl', function($scope, $location, $stateParams, $cordovaSQLite, ColonyHelper, YardHelper) {

  //Load current yard into currentYard
  YardHelper.getYardById($stateParams.yardId).then(function (yard){
    $scope.currentYard = yard;
  });

  //Load current colony into currentColony
  ColonyHelper.getColonyById($stateParams.colonyId).then(function (currentColony){
    $scope.currentColony = currentColony;
  });

  //Load current queen into currentQueen
  currentQueen = [];
  var query = "SELECT * FROM Queens WHERE id = ?";
  $cordovaSQLite.execute(db, query, [$stateParams.queenId]).then(function(res) {
    $scope.currentQueen = res.rows.item(0);
  });



  $scope.goToColony = function() {
    $location.url('/yard/' + $scope.currentYard.id + '/colony/' + $scope.currentColony.id);
  }

  $scope.goToYard = function() {
    console.log("nav to yard");
    $location.url('/yard/' + $scope.currentYard.id );
  }

  $scope.goHome = function () {
    $location.url('/')
  }

});
