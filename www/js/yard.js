
angular.module('ameApp')

.controller('YardCtrl', function($scope, $ionicPopup, $stateParams, $location, $cordovaSQLite, $ionicSideMenuDelegate, ColonyHelper, YardHelper, ionicDatePicker) {

  var moveColonyPopup = $ionicPopup;
  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //timezone offset in milliseconds

  $scope.newColonyActiveDate = (new Date(Date.now()-tzoffset)).toISOString().slice(0,-1);

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

  $scope.changeTextBlack = function() { //changes tag number to black (incase it was red) when user clicks to edit
    document.getElementById("newColonyNumber").style.color = "black";
  }

  $scope.createColony = function() {
    var newColonyNumber = document.getElementById("newColonyNumber").value;
    var newColonyOrigin = document.getElementById("newColonyOrigin").value;

    ColonyHelper.getColonyByNumber(newColonyNumber).then(function (colony){ //check if tag is assigned
      if (colony==null){ //If no active colony is assigned the tag allow new colony create
        ColonyHelper.saveColony($scope.currentYard.id, newColonyNumber, $scope.newColonyActiveDate, newColonyOrigin);
        //refresh list of colonies in yard
        YardHelper.getColoniesInYard($scope.currentYard.id).then(function (colonies){
          $scope.colonies = colonies;
        });
        $ionicSideMenuDelegate.toggleRight();
      }
      console.log(colony); //TODO: tell user there is an active colony w/ that tag in yard X
      document.getElementById("newColonyNumber").style.color = "red";
    });
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
