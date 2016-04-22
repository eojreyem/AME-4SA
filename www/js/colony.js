angular.module('ameApp')

.controller('ColonyCtrl', function($scope, $location, $ionicPopup, $stateParams, YardHelper, ColonyHelper, QueenHelper, VisitHelper) {
  console.log($stateParams.colonyId);


  //Load current colony into currentColony
  ColonyHelper.getColonyById($stateParams.colonyId).then(function (colony){
    $scope.currentColony = colony;
    $scope.queens = QueenHelper.getQueensInColony(colony.id);
    $scope.visits = VisitHelper.getVisitsForColony(colony.id);
    //Load colony's yard into currentYard
    YardHelper.getYardById(colony.in_yard_id).then(function (yard){
      $scope.currentYard = yard;
    });

  });

  $scope.showMoveQueenPopup = function(queen) {
    $scope.destination = {};
    var moveQueenPopup = $ionicPopup.show({
      title: 'Enter the Colony\'s number',
      subTitle: 'that queen ' +queen.name+ " will move to.",
      template: '<label class="item item-input">  <input type="number" ng-model="destination.colonyNum"></label>',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        { text: 'Move',
          type: 'button-positive',
          onTap: function(e) {
          //TODO: determine if colony number is valid.
          if ($scope.destination.colonyNum>0) {
            console.log($scope.destination.colonyNum);
            ColonyHelper.getColonyByNumber($scope.destination.colonyNum).then(function (destinationColony){
              console.log("move queen " +queen.name+ " to " +destinationColony.number);
              QueenHelper.updateQueenColony(queen.id, destinationColony.id)
              $scope.queens = QueenHelper.getQueensInColony($scope.currentColony.id);
            });

          } else {
            console.log("Enter Valid Colony Number.");
            e.preventDefault();
            }
          }
        }
      ]
    })
  };


  //Navigation functions
  $scope.newVisit = function() {
    $location.url('/yard/' + $scope.currentYard.id + '/colony/' + $scope.currentColony.id  + '/visit/new');
  }
  $scope.goToQueen = function(queen) {
    $location.url('/yard/' + $scope.currentYard.id + '/colony/' + $scope.currentColony.id  + '/queen/' + queen.id);
  }
  $scope.goToVisit = function(visit) {
    $location.url('/yard/' + $scope.currentYard.id + '/colony/' + $scope.currentColony.id  + '/visit/' + visit.id);
  }
  $scope.goToYard = function() {
    console.log("nav to yard");
    $location.url('/yard/' + $scope.currentYard.id );
  }
  $scope.goHome = function () {
    $location.url('/')
  }
});
