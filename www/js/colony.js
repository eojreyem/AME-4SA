angular.module('ameApp')

.controller('ColonyCtrl', function($scope, $location, $ionicPopup, $stateParams, ionicDatePicker, $ionicSideMenuDelegate, YardHelper, ColonyHelper, QueenHelper, VisitHelper, VisitNotesHelper) {

  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //timezone offset in milliseconds

  var newColony = {
    id: "new",
    in_yard_id: $stateParams.yardId,
    number: null,
    date_active: (new Date(Date.now()-tzoffset)).toISOString().slice(0,-1),
    origin: null,
    date_inactive: null,
    reason_inactive_id: null,
  };

  datePickerObj = {
    callback: function (val) {  //Mandatory
      console.log('Return value from the datepicker popup is : ' + val, new Date(val));
      $scope.newColony.date_active = (new Date(val).toISOString().slice(0,-1));
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



  $scope.queens = [];

  visitViewI = 0; //visit viewer index for colony's visits array
  colonysVisits = [];  // to be filled with visits for the current colony

  //Load yard into currentYard
  YardHelper.getYardById($stateParams.yardId).then(function (yard){
    $scope.currentYard = yard;
  });

  //Load current colony into currentColony
  ColonyHelper.getColonyById($stateParams.colonyId).then(function (colony){
    if (colony!=null){
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
      /*QueenHelper.getQueensInColony(colony.id).then(function(queens){
        $scope.queens = queens;
      });*/
    }else {
      $scope.currentColony = {number:"new"};
      $scope.newColony = newColony;
    }

  });

  $scope.changeVisitViewBy = function(num){
    console.log("change by " + num);

      $scope.notes = null;
      visitViewI=visitViewI+num;
      if (visitViewI<0){
        visitViewI = 0;
      }
      if (visitViewI>colonysVisits.length-1){
        visitViewI = colonysVisits.length-1;
      }

      $scope.visit = colonysVisits[visitViewI];
      VisitNotesHelper.getNotesForVisitById(colonysVisits[visitViewI].id).then(function (notes){
        $scope.notes = notes;
      })

      $scope.visitIndex = visitViewI;

      msAgo = (new Date(Date.now()-tzoffset)) - (new Date(colonysVisits[visitViewI].date_time));
      $scope.daysAgo = parseInt(msAgo/(3600000*24),10);
      $scope.hoursAgo = parseInt(((msAgo/(3600000))%24),10);

      //Color change to draw attention to problematic queen statuses
      if ($scope.visit.queen_status_id>2){
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

  $scope.createColony = function(colony) {
    ColonyHelper.saveColony(colony).then(function (insertId){
      if (insertId!=null){
        colony.id = insertId;
        $scope.currentColony = colony;
      }
    })
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
              //TODO use Save colony instead of specific function.  Also add date_inactive
              ColonyHelper.setColonyInactive(colony.id, $scope.choice.reasonId);
              $scope.goToYard();
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

  $scope.showColonyInfoPopup = function(colony) {
    var colonyInfoPopup = $ionicPopup.show({
      scope: $scope,
      title: 'Colony Info',
      template: '<div class="list">                                '+
                '  <div class="item">Active on {{currentColony.date_active| date:"MMM d, yyyy"}}</div>'+
                '  <div class="item item-text-wrap">Origin: {{currentColony.origin}}</div>'+
                '</div>  ',
      buttons: [
        { text: 'Inactive',
          type: 'button-assertive button-outline',
          onTap: function (e) {
            colonyInfoPopup.close();
            $scope.showColonyInactivePopup($scope.currentColony);
          }
        },
        { text: 'Close',
          type: 'button-positive'
        }
      ]
    })
  }



  //Navigation functions
  $scope.newVisit = function() {
    $location.url('/yard/' + $scope.currentYard.id + '/colony/' + $scope.currentColony.id  + '/visit/new');
  }
  $scope.goToQueen = function(visitId, queenId) {
    $location.url('/yard/' + $scope.currentYard.id + '/colony/' + $scope.currentColony.id  + '/visit/' + visitId + '/queen/' + queenId);
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
