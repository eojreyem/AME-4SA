// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ameApp')

.controller('YardCtrl', function($scope, $ionicPopup, $stateParams, $location, $cordovaSQLite, $ionicSideMenuDelegate, ColonyHelper, YardHelper) {

  var moveYardPopup = $ionicPopup;
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
    $scope.selectedColony = colony;
    console.log(yards);
    var moveYardPopup = $ionicPopup.show({
      template: '<ion-list>                                '+
                '  <ion-item ng-repeat="yard in yards" ng-click="moveColony(selectedColony.id, yard.id)"">    '+
                '    {{yard.name}}                         '+
                '  </ion-item>                             '+
                '</ion-list>                               ',
      title: 'Select a Yard',
      subTitle: 'to move colony ' +colony.number+ " to.",
      scope: $scope,
      buttons: [
        { text: 'Done',
          type: 'button-positive'},
      ]
    });
  };

  $scope.moveColony = function(colonyId, yardId) {
    ColonyHelper.updateColonyYard(colonyId, yardId);
    $scope.colonies = YardHelper.getColoniesInYard($stateParams.yardId);
    console.log("moving colony ID" + colonyId + "to yard ID:" +yardId)
  }



  $scope.goToColony = function (colony){
    $location.url('/yard/'+ currentYard.id + '/colony/' + colony.id);
  }

  $scope.goHome = function () {
    $location.url('/')
  }


});
