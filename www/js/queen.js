// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ameApp')

.controller('QueenCtrl', function($scope, $location, $stateParams, $cordovaSQLite, ColonyHelper, YardHelper) {
  // No need for testing data anymore

  //Load current yard into currentYard


  currentYard = [];

  //Load current yard into currentYard
  currentYard = YardHelper.getYardById($stateParams.yardId);

  //Load current colony into currentColony
  currentColony = ColonyHelper.getColonyById($stateParams.colonyId);
  $scope.currentColony = currentColony;

  //Load current queen into currentQueen
  currentQueen = [];
  var query = "SELECT * FROM Queens WHERE id = ?";
  $cordovaSQLite.execute(db, query, [$stateParams.queenId]).then(function(res) {
    $scope.currentQueen = res.rows.item(0);
  });



  $scope.goToColony = function() {
    $location.url('/yard/' + currentYard.id + '/colony/' + currentColony.id);
  }

  $scope.goToYard = function() {
    console.log("nav to yard");
    $location.url('/yard/' + currentYard.id );
  }

  $scope.goHome = function () {
    $location.url('/')
  }

});
