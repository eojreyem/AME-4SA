// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ameApp')

.controller('YardCtrl', function($scope, $ionicPopup, $stateParams, $location, $cordovaSQLite, $ionicSideMenuDelegate, ColonyHelper, YardHelper) {

  var moveColonyPopup = $ionicPopup;
  //Load current yard into currentYard
  currentYard = [];
  //Load current yard into currentYard
  currentYard = YardHelper.getYardById($stateParams.yardId);

  //loads a list of colonies in currentYard
  $scope.loadColonies = function() {
    $scope.colonies = YardHelper.getColoniesInYard($stateParams.yardId);
  };

  $scope.createColony = function() {
    var newColonyActiveDate = "Apr 10"
    var newColonyNumber = document.getElementById("newColonyNumber").value;
    var newColonyOrigin = document.getElementById("newColonyOrigin").value;

    ColonyHelper.saveColony(currentYard.id, newColonyNumber, newColonyActiveDate, newColonyOrigin);
    $scope.loadColonies();
    $ionicSideMenuDelegate.toggleRight();
  };

  $scope.showMoveColonyPopup = function(colony) {
    $scope.yards = YardHelper.getAllYards();
    $scope.choice = {};
    var moveColonyPopup = $ionicPopup.show({
      template: '<ion-list>                                '+
                '  <ion-radio ng-repeat="yard in yards" ng-model="choice.yardId" ng-value="{{yard.id}}">{{yard.name}}</ion-radio>'+
                '</ion-list>                               ',
      title: 'Select a Yard',
      subTitle: 'to move colony ' +colony.number+ " to.",
      scope: $scope,
      buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Move</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.choice.yardId) {
            console.log("nothing selected?");
            //don't allow "move" button to do anything if no yard is selected.
            e.preventDefault();
          } else {
            ColonyHelper.updateColonyYard(colony.id, $scope.choice.yardId);
            $scope.colonies = YardHelper.getColoniesInYard($stateParams.yardId);
            console.log("moving colony ID" + colony.id + "to yard ID:" +$scope.choice.yardId)
            }
        }
      }
      ]
    });
  };


  $scope.goToColony = function (colony){
    $location.url('/yard/'+ currentYard.id + '/colony/' + colony.id);
  }

  $scope.goHome = function () {
    $location.url('/')
  }


});
