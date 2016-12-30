// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ameApp')

.controller('QueenCtrl', function($scope, $location, $stateParams, $ionicPopup, ionicDatePicker, ColonyHelper, YardHelper, QueenHelper) {

  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //timezone offset in milliseconds

  var newQueen = {
    id: "new",
    name: null,
    in_colony_id: $stateParams.colonyId,
    mother_queen_id: null, //motherId
    origin: null,
    //date emerge is prepopulated with 20 days ago.
    date_emerged: (new Date(Date.now()-tzoffset - 1728000000)).toISOString().slice(0,-1),
    mark_color_hex:'#000000', //hexColor
  };

  datePickerObj = {
    callback: function (val) {  //Mandatory
      console.log('Return value from the datepicker popup is : ' + val, new Date(val));
      $scope.queen.date_emerged = (new Date(val).toISOString().slice(0,-1));
    },
    from: new Date(2014, 1, 1), //Optional
    to: new Date(), //Optional
    inputDate: new Date(),      //Optional
    closeOnSelect: false,       //Optional
    templateType: 'modal'       //Optional
  };

  //Load current yard into currentYard for nav at the bottom.
  YardHelper.getYardById($stateParams.yardId).then(function (yard){
    $scope.currentYard = yard;
  })

  QueenHelper.getNamedQueens().then(function (namedQueens){
    $scope.breeders = namedQueens;
  })

  //Load current colony into currentYard for nav at the bottom.
  ColonyHelper.getColonyById($stateParams.colonyId).then(function (colony){
    $scope.currentColony = colony;
    newQueen.in_colony_number = colony.number;
  })

  $scope.visitId = $stateParams.visitId;

  //Load current queen into queen
  QueenHelper.getQueenById($stateParams.queenId).then(function (queen){
    if (queen != null){
      $scope.queen = queen;
    }else {
      $scope.queen = newQueen;
    }
    document.getElementById("queenColorButton").style.color = $scope.queen.mark_color_hex;
    if ($scope.queen.in_colony_id != $scope.currentColony.id){
      document.getElementById("inColonyWord").style.color = "#FF5533";
    }

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
              $scope.queen.mark_color_hex = $scope.hexColor.hex;
            }
          }
        ]
      })

  };

  $scope.openDatePicker = function(){
    ionicDatePicker.openDatePicker(datePickerObj);
  };


  // A confirm dialog
 $scope.showRemoveQueenFromColony = function(queen) {
   var removeQueenFromColonyPopup = $ionicPopup.show({
     title: 'Remove This Queen?',
     subTitle: 'PUT HER # ON CAGE: ' + queen.id ,
     buttons: [
       {text: 'Cancel'},
       {text: 'Remove',
        type: 'button-assertive',
        onTap: function(e) {
          queen.in_colony_id = null;
          queen.in_colony_number = null;
          $scope.queen = queen;
        }
       }]
    });
  }
 /*
  $scope.removeQueenPopup = function(queen) {
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
                console.log("move queen " +queen.id+ " to " +destinationColony.number);
                queen.in_colony_id = destinationColony.id;
                queen.in_colony_number = destinationColony.number;
                $scope.queen = queen;

                moveQueenPopup.close();
              //  $scope.goToColony($scope.currentColony)
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
  }; */

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

  $scope.saveQueen = function (queen){
    console.log("saving queen");
    QueenHelper.saveQueen(queen).then(function (insertId){
      if (insertId != null){
        $scope.queen.id = insertId;
      }
    });
  }

  $scope.goToVisit = function(visit) {
    $location.url('/yard/' + $scope.currentYard.id + '/colony/' + $scope.currentColony.id  + '/visit/' + $scope.visitId);
  }

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
