// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ameApp')

.controller('YardCtrl', function($scope, $stateParams, $location, $cordovaSQLite, $ionicSideMenuDelegate, ColonyHelper) {
  // No need for testing data anymore

  //Load current yard into currentYard
  currentYard = [];
  var query = "SELECT * FROM Yards WHERE id = ?";
  $cordovaSQLite.execute(db, query, [$stateParams.yardId]).then(function(res) {
    currentYard = res.rows.item(0);
    $scope.yardName = currentYard.name;
  });

  //loads a list of colonies in currentYard
  $scope.loadColonies = function() {
    //clear current list
    $scope.colonies = [];
    var query = "SELECT * FROM Colonies WHERE in_yard_id = ?";
    $cordovaSQLite.execute(db, query, [$stateParams.yardId]).then(function(res) {
      if(res.rows.length > 0) {
        for (i = 0; i < res.rows.length; i++) {
          console.log("SELECTED -> " + res.rows.item(i));
          $scope.colonies.push(res.rows.item(i));
        }

      } else {
          console.log("No colonies found in this yard");
      }
    }, function (err) {
        console.error(err);
    });
  };


  $scope.goToColony = function (colony){
    $location.url('/yard/'+ currentYard.id + '/colony/' + colony.id);
  }

  $scope.createColony = function() {
    var newColonyActiveDate = "Apr 10"
    var newColonyNumber = document.getElementById("newColonyNumber").value;
    var newColonyOrigin = document.getElementById("newColonyOrigin").value;

    ColonyHelper.saveColony(currentYard.id, newColonyNumber, newColonyActiveDate, newColonyOrigin);
    $scope.loadColonies();
    $ionicSideMenuDelegate.toggleRight();
  };

  $scope.moveColony = function(colony) {
    //TODO: popup list of yards as options
    //testing this just moves colony to yard_id = 1
    selectedYard = { id: '1'};
    console.log("moving C:" + colony.id + "to yard:" +selectedYard.id)
    ColonyHelper.updateColonyYard(colony.id, selectedYard.id)
    $scope.loadColonies();
  };

  $scope.goHome = function () {
    $location.url('/')
  }


});
