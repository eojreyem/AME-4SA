// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ameApp')

.controller('QueenCtrl', function($scope, $location, $stateParams, $ionicPopup, ColonyHelper, YardHelper, QueenHelper) {

  //Load current queen into currentQueen
  QueenHelper.getQueenById($stateParams.queenId).then(function (queen){
    $scope.currentQueen = queen;
    //Load her colony into currentColony
    ColonyHelper.getColonyById(queen.in_colony_id).then(function (colony){
      $scope.currentColony = colony;
      //Load colony's yard into currentYard
      YardHelper.getYardById(colony.in_yard_id).then(function (yard){
        $scope.currentYard = yard;
      });
    });
  });

  $scope.showQueenInactivePopup = function(queen) {
    $scope.choice = {};
    QueenHelper.getQueenInactiveReasons().then(function(reasons){
      $scope.reasons = reasons;
      var queenInactivePopup = $ionicPopup.show({
        title: 'Choose the Reason',
        subTitle: 'that queen ' +queen.name+ " is inactive.",
        template: '<ion-list>                                '+
                  '  <ion-radio ng-repeat="reason in reasons" ng-model="choice.reasonId" ng-value="{{reason.id}}">{{reason.reason}}</ion-radio>'+
                  '</ion-list>  ',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          { text: 'Remove',
            type: 'button-assertive',
            onTap: function(e) {
            if ($scope.choice.reasonId>0) {
              console.log("selected "+reasons[$scope.choice.reasonId-1].reason+", store to queen");
              QueenHelper.updateQueenInactive(queen.id, $scope.choice.reasonId);
            } else {
              console.log("Select reason to remove queen.");
              e.preventDefault();
              }
            }
          }
        ]
      })
    });

  };

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
