// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ameApp')

.controller('YardCtrl', function($scope, $ionicPopup, $stateParams, $location, $cordovaSQLite, $ionicSideMenuDelegate, ColonyHelper, YardHelper, ionicDatePicker) {

  var moveColonyPopup = $ionicPopup;

  $scope.newColonyActiveDate = new Date();

  //Load current yard into currentYard
  YardHelper.getYardById($stateParams.yardId).then(function (yard){
    $scope.currentYard = yard;
    YardHelper.getColoniesInYard(yard.id).then(function (colonies){
      $scope.colonies = colonies;
    });
  });


  datePickerObj = {
      callback: function (val) {  //Mandatory
        console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        $scope.newColonyActiveDate = (new Date(val).toISOString().slice(0,-1));
      },
      from: new Date(2014, 1, 1), //Optional
      to: new Date(), //Optional
      inputDate: new Date(),      //Optional
      closeOnSelect: false,       //Optional
      templateType: 'modal'       //Optional
    };


    $scope.openDatePicker = function(){
      ionicDatePicker.openDatePicker(datePickerObj);
    };


  $scope.createColony = function() {
    var newColonyNumber = document.getElementById("newColonyNumber").value;
    var newColonyOrigin = document.getElementById("newColonyOrigin").value;

    ColonyHelper.saveColony($scope.currentYard.id, newColonyNumber, $scope.newColonyActiveDate, newColonyOrigin);
    YardHelper.getColoniesInYard($scope.currentYard.id).then(function (colonies){
      $scope.colonies = colonies;
    });
    $ionicSideMenuDelegate.toggleRight();
  };

  $scope.showMoveColonyPopup = function(colony) {
    YardHelper.getAllYards().then(function (yards){
      $scope.yards = yards;
    });
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
            YardHelper.getColoniesInYard($scope.currentYard.id).then(function (colonies){
              $scope.colonies = colonies;
            });
            console.log("moving colony ID" + colony.id + "to yard ID:" +$scope.choice.yardId)
            }
        }
      }
      ]
    });
  };


  $scope.goToColony = function (colony){
    $location.url('/yard/'+ $scope.currentYard.id + '/colony/' + colony.id);
  }

  $scope.goHome = function () {
    $location.url('/')
  }


});
