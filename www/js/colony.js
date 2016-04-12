angular.module('ameApp')

.controller('ColonyCtrl', function($scope, $location, $stateParams, $cordovaSQLite, ColonyHelper, QueenHelper) {


  //Load current yard into currentYard
  currentYard = [];
  var query = "SELECT * FROM Yards WHERE id = ?";
  $cordovaSQLite.execute(db, query, [$stateParams.yardId]).then(function(res) {
    currentYard = res.rows.item(0);
    $scope.yardName = currentYard.name;
  });

  //Load current colony into currentColony
  currentColony = ColonyHelper.getColonyById($stateParams.colonyId);
  console.log("cur col>" +currentColony);
  $scope.currentColony = currentColony;


  //loads a list of Visits for currentColony
  $scope.loadVisits = function() {
    //clear current list
    $scope.visits = [];
    var query = "SELECT * FROM Visits WHERE colony_id = ?";
    $cordovaSQLite.execute(db, query, [$stateParams.colonyId]).then(function(res) {
      if(res.rows.length > 0) {
        for (i = 0; i < res.rows.length; i++) {
          console.log("SELECTED -> " + res.rows.item(i));
          $scope.visits.push(res.rows.item(i));
        }

      } else {
          console.log("No visits found for colony");
      }
    }, function (err) {
        console.error(err);
    });
  };


  //loads a list of Queens in currentColony
  $scope.loadQueens = function() {
    //clear current list
    $scope.queens = [];
    var query = "SELECT * FROM Queens WHERE in_colony_id = ?";
    $cordovaSQLite.execute(db, query, [$stateParams.colonyId]).then(function(res) {
      if(res.rows.length > 0) {
        for (i = 0; i < res.rows.length; i++) {
          console.log("SELECTED -> " + res.rows.item(i));
          $scope.queens.push(res.rows.item(i));
        }

      } else {
          console.log("No queens found in colony");
      }
    }, function (err) {
        console.error(err);
    });
  };

  $scope.moveQueen = function(queen) {
    //TODO: popup to get colony target
    //testing this just moves queen to colony_id = 1
    selectedColony = { id: '1'};
    console.log("moving Q:" + queen.id + "to colony:" +selectedColony.id)
    QueenHelper.updateQueenColony(queen.id, selectedColony.id)
    $scope.loadQueens();
  };


  //Navigation functions
  $scope.newVisit = function() {
    $location.url('/yard/' + currentYard.id + '/colony/' + currentColony.id  + '/visit/new');
  }

  $scope.goToQueen = function(queen) {
    $location.url('/yard/' + currentYard.id + '/colony/' + currentColony.id  + '/queen/' + queen.id);
  }

  $scope.goToVisit = function(visit) {
    $location.url('/yard/' + currentYard.id + '/colony/' + currentColony.id  + '/visit/' + visit.id);
  }

  $scope.goToYard = function() {
    console.log("nav to yard");
    $location.url('/yard/' + currentYard.id );
  }

  $scope.goHome = function () {
    $location.url('/')
  }



});
