// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ameApp')

.controller('VisitCtrl', function($scope, $location, $stateParams, $cordovaSQLite, $ionicSideMenuDelegate) {
  // No need for testing data anymore

  //Load current yard into currentYard
  $scope.currentVisit = [];
  currentYard = [];
  var query = "SELECT * FROM Yards WHERE id = ?";
  $cordovaSQLite.execute(db, query, [$stateParams.yardId]).then(function(res) {
    currentYard = res.rows.item(0);
    $scope.yardName = currentYard.name;
  });

  //Load current colony into currentColony
  currentColony = [];
  var query = "SELECT * FROM Colonies WHERE id = ?";
  $cordovaSQLite.execute(db, query, [$stateParams.colonyId]).then(function(res) {
    currentColony = res.rows.item(0);
    $scope.colonyName = currentColony.name;
  });

  $scope.createQueen = function() {
    //TODO: check if queen name is unique
    var queenNumber = document.getElementById("newQueenNumber").value;
    var queenOrigin = document.getElementById("newQueenOrigin").value;
    var query = "INSERT INTO Queens (name, in_colony_id, origin) VALUES (?,?,?)";
    $cordovaSQLite.execute(db, query, [queenNumber, currentColony.id, queenOrigin]).then(function(res) {
        console.log("INSERT ID -> " + res.insertId);

        $ionicSideMenuDelegate.toggleRight();
    }, function (err) {
        console.error(err);
    });
  };

  $scope.saveVisit = function() {
    console.log($scope.currentVisit);

    /*
    TODO: create or update visit in db
    var query = "INSERT INTO Visits VALUES ?";
    $cordovaSQLite.execute(db, query, $scope.currentVisit).then(function(res) {
        console.log("INSERT ID -> " + res.insertId);
    }, function (err) {
        console.error(err);
    });
    */
    $location.url('/yard/' + currentYard.id + '/colony/' + currentColony.id);
  };

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
