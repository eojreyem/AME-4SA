angular.module('ameApp')

.controller('ColonyCtrl', function($scope, $location, $ionicPopup, $stateParams, $cordovaSQLite, YardHelper, ColonyHelper, QueenHelper) {
  console.log($stateParams.colonyId);
  currentColony = [];
  //Load current yard into currentYard
  currentYard = YardHelper.getYardById($stateParams.yardId);

  //Load current colony into currentColony
  currentColony = ColonyHelper.getColonyById($stateParams.colonyId);

  //loads a list of Visits for currentColony
  $scope.loadVisits = function() {
    //clear current list
    $scope.visits = [];
    var query = "SELECT * FROM Visits WHERE colony_id = ?";
    $cordovaSQLite.execute(db, query, [currentColony.id]).then(function(res) {
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
    $cordovaSQLite.execute(db, query, [currentColony.id]).then(function(res) {
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

  $scope.showMoveQueenPopup = function(queen) {
    $scope.selectedQueen = queen;
    $scope.destination = {};
    var moveQueenPopup = $ionicPopup.show({
      title: 'Enter the Colony\'s number',
      subTitle: 'that queen ' +queen.name+ " will move to.",
      template: '<label class="item item-input">  <input type="number" ng-model="destination.ColonyNum"></label>',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        { text: 'Move',
          type: 'button-positive',
          onTap: function(e) {
          if ($scope.destinationColonyNum>0) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
            console.log("move queen " +queen.name+ " to " +$scope.destination.ColonyNum);
            //TODO: convert destination.ColonyNum to colonyId
            QueenHelper.updateQueenColony(queen.id, 2)
            $scope.loadQueens();
            }
          }
        }
      ]
    })


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
