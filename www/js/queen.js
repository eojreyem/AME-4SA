// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ameApp')

.controller('QueenCtrl', function($scope, $location, $stateParams, $ionicPopup, ColonyHelper, YardHelper, QueenHelper) {

  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //timezone offset in milliseconds


  //Load current queen into currentQueen
  QueenHelper.getQueenById($stateParams.queenId).then(function (queen){
    $scope.currentQueen = queen;
    document.getElementById("queenColorButton").style.color = queen.mark_color_hex;
    //Load her colony into currentColony
    ColonyHelper.getColonyById(queen.in_colony_id).then(function (colony){
      $scope.currentColony = colony;
      //Load colony's yard into currentYard
      YardHelper.getYardById(colony.in_yard_id).then(function (yard){
        $scope.currentYard = yard;
      });
    });
  });

  $scope.showQueenColorPopup = function(queen) {
    var markColors = [
      {text:' (1 or 6) - White', hexcode:'#ffffff', ionicColor: 'light'},
      {text:'  (2 or 7) - Yellow', hexcode:'#ffff00', ionicColor: 'energized'},
      {text:' (3 or 7) - Red', hexcode:'#ff3333', ionicColor: 'assertive'},
      {text:' (4 or 8) - Green', hexcode:'#55cc55', ionicColor: 'balanced'},
      {text:' (5 or 0) - Blue', hexcode:'#3366ff', ionicColor: 'calm'},
      {text:' Unmarked ', hexcode:'#000000', ionicColor: 'dark'}]

    $scope.markColors = markColors;

    $scope.hexColor = {};
      var queenColorPopup = $ionicPopup.show({
        title: 'Queen Mark Color',
        template: '<div class="list">                                '+
                  '  <ion-radio ng-repeat="color in markColors" ng-model="hexColor.hex" ng-value=color.hexcode > <i class="icon ion-record {{color.ionicColor}}"></i>{{color.text}}</ion-radio>'+
                  '</div>  ',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          { text: 'Select',
            type: 'button-positive',
            onTap: function(e) {
              document.getElementById("queenColorButton").style.color = $scope.hexColor.hex;
              queen.mark_color_hex = $scope.hexColor.hex;
              QueenHelper.saveQueen(queen);

            }
          }
        ]
      })

  };

  $scope.showGiveQueenNamePopup = function(queen) {
    var queenNamePopup = $ionicPopup.show({
      title: 'Enter a Name for queen #' + queen.id,
      subTitle: 'This is optional and typically done just for breeders',
      template: '<label class="item item-input">  <input type="text" ng-model="currentQueen.name"></label>',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        { text: 'Name',
          type: 'button-positive',
          onTap: function(e) {
            //TODO save queen    check to make sure name is unique
            QueenHelper.saveQueen($scope.currentQueen);
          }
        }
      ]
    });
  }

  $scope.showMoveQueenPopup = function(queen) {
    $scope.destination = {};
    var moveQueenPopup = $ionicPopup.show({
      title: 'Enter the Colony\'s number',
      subTitle: 'that queen ' +queen.id +" - "+queen.name+ " will move to.",
      template: '<label class="item item-input">  <input type="number" ng-model="destination.colonyNum"></label>',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        { text: 'Move',
          type: 'button-positive',
          onTap: function(e) {
          if ($scope.destination.colonyNum>0) {
            e.preventDefault();
            ColonyHelper.getColonyByNumber($scope.destination.colonyNum).then(function (destinationColony){
              //TODO: if destinationColony is not null.
              if (destinationColony!= null){
                console.log("move queen " +queen.name+ " to " +destinationColony.number);
                queen.in_colony_id = destinationColony.id;
                console.log(queen);
                QueenHelper.saveQueen(queen)

                moveQueenPopup.close();
                $scope.goToColony($scope.currentColony)
              }
              else{
                console.log("Enter Valid Colony Number.");
              }
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
              queen.reason_inactive_id = $scope.choice.reasonId;
              queen.date_inactive = (new Date(Date.now()-tzoffset)).toISOString().slice(0,-1);
              queen.in_colony_id = null;
              QueenHelper.saveQueen(queen);
              $scope.goToColony($scope.currentColony);
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
