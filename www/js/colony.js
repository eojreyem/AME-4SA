angular.module('ameApp')

.controller('ColonyCtrl', function($scope, $location, $ionicPopup, $stateParams, ionicDatePicker, $ionicSideMenuDelegate, YardHelper, ColonyHelper, QueenHelper, VisitHelper, VisitNotesHelper) {

  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //timezone offset in milliseconds

  $scope.queens = [];

  visitViewI = 0; //visit viewer index for colony's visits array
  colonysVisits = [];  // to be filled with visits for the current colony



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
