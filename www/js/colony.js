angular.module('ameApp')

.controller('ColonyCtrl', function($scope, $location, $ionicPopup, $stateParams, ionicDatePicker, $ionicSideMenuDelegate, YardHelper, ColonyHelper, QueenHelper, VisitHelper, VisitNotesHelper) {

  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //timezone offset in milliseconds

  datePickerObj = {
    callback: function (val) {  //Mandatory
      console.log('Return value from the datepicker popup is : ' + val, new Date(val));
      $scope.newQueen.date_emerged = (new Date(val).toISOString().slice(0,-1));
    },
    from: new Date(2014, 1, 1), //Optional
    to: new Date(), //Optional
    inputDate: new Date(),      //Optional
    closeOnSelect: false,       //Optional
    templateType: 'modal'       //Optional
  };
  $scope.queens = [];
  var newQueen = {
    id: "new",
    name: null,
    in_colony_id: $stateParams.colonyId,
    mother_queen_id: null, //motherId
    origin: null,
    date_emerged: (new Date(Date.now()-tzoffset)).toISOString().slice(0,-1), //dateEmerged
    mark_color_hex:'#000000', //hexColor
  };

  visitViewI = 0; //visit viewer index for colony's visits array
  colonysVisits = [];  // to be filled with visits for the current colony


  document.getElementById("queenColorButton").style.color = newQueen.mark_color_hex;

  $scope.newQueen = newQueen;

  //Load current colony into currentColony
  ColonyHelper.getColonyById($stateParams.colonyId).then(function (colony){
    $scope.currentColony = colony;
    VisitHelper.getVisitsForColony(colony.id).then(function(visits){
      colonysVisits = visits;
      $scope.changeVisitViewBy(0);
      $scope.numOfVisits = visits.length;
    });
    VisitNotesHelper.getRemindersByColonyId(colony.id).then(function(reminders){
      $scope.reminders = reminders;
      console.log(reminders);
    });

    QueenHelper.getQueensInColony(colony.id).then(function(queens){
      $scope.queens = queens;
    });
    //Load colony's yard into currentYard
    YardHelper.getYardById(colony.in_yard_id).then(function (yard){
      $scope.currentYard = yard;
    });

  });

  $scope.changeVisitViewBy = function(num){
    console.log("change by " + num);

      visitViewI=visitViewI+num;
      if (visitViewI<0){
        visitViewI = 0;
      }
      if (visitViewI>colonysVisits.length-1){
        visitViewI = colonysVisits.length-1;
      }

      $scope.visit = colonysVisits[visitViewI];
      $scope.visitIndex = visitViewI;

      //Color change to draw attention to problematic queen statuses

      if (colonysVisits[visitViewI].queen_status_id>2){
        document.getElementById("pastQueenStatus").style.color = 'red';
      }else {
        document.getElementById("pastQueenStatus").style.color = 'black';
      }

      if (colonysVisits[visitViewI].queen_id!=null){
        QueenHelper.getQueenById(colonysVisits[visitViewI].queen_id).then(function(queen){
          $scope.visitQueen = queen;
          document.getElementById("visitQueenColorBtn").style.color = queen.mark_color_hex;
        });
      }else{
        $scope.visitQueen = null;
        document.getElementById("visitQueenColorBtn").style.color = 'black';
      }


  }

  $scope.dismissReminder = function(reminderNote){
    console.log("dismissing?");
    VisitNotesHelper.dismissReminder(reminderNote);
  }

  $scope.showColonyInactivePopup = function(colony) {
    $scope.choice = {};
    ColonyHelper.getColonyInactiveReasons().then(function(reasons){
      $scope.reasons = reasons;
      var colonyInactivePopup = $ionicPopup.show({
        title: 'Choose the Reason',
        subTitle: 'that colony ' +colony.number+ " is inactive.",
        template: '<ion-list>                                '+
                  '  <ion-radio ng-repeat="reason in reasons" ng-model="choice.reasonId" ng-value="{{reason.id}}">{{reason.reason}}</ion-radio>'+
                  '</ion-list>  ',
        scope: $scope,
        buttons: [
          { text: 'Cancel'},
          { text: 'Remove',
            type: 'button-assertive',
            onTap: function(e) {
            if ($scope.choice.reasonId>0) {
              console.log("selected "+reasons[$scope.choice.reasonId-1].reason+", store to colony");
              ColonyHelper.setColonyInactive(colony.id, $scope.choice.reasonId);
            } else {
              console.log("UPDATE THIS WHEN YOU KNOW MORE.");
              e.preventDefault();
              }
            }
          }
        ]
      })
    });
    //TODO: What happens to the queens in that colony?
  };

  $scope.showQueenColorPopup = function() {
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
              newQueen.mark_color_hex = $scope.hexColor.hex;
            }
          }
        ]
      })

  };

  $scope.createQueen = function(newQueen) {
    QueenHelper.saveQueen(newQueen).then(function(insertId){
      if (insertId !=null){
        newQueen.id = insertId;
        QueenHelper.getQueensInColony($scope.currentColony.id).then(function(queens){
          $scope.queens = queens;
        });
      }
    });
    //TODO saveQueen must return promise, then refresh queen list

  };



  $scope.openDatePicker = function(){
    ionicDatePicker.openDatePicker(datePickerObj);
  };


  //Navigation functions
  $scope.newVisit = function() {
    $location.url('/yard/' + $scope.currentYard.id + '/colony/' + $scope.currentColony.id  + '/visit/new');
  }
  $scope.goToQueen = function(queen) {
    $location.url('/yard/' + $scope.currentYard.id + '/colony/' + $scope.currentColony.id  + '/queen/' + queen.id);
  }
  $scope.goToVisit = function(visit) {
    console.log("ID PASSED:" + visit);
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
