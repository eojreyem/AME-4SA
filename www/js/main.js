// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('ameApp')

.controller('MainCtrl', function($ionicPlatform, $scope, $location, $cordovaSQLite, $ionicPopup, YardHelper, VisitHelper, VisitNotesHelper) {

  $scope.newYard = {name:null};
  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //timezone offset in milliseconds
  var remindersPopup = [];

  //loads a list of yards in 4SA
  $ionicPlatform.ready(function() {
    YardHelper.getAllYards().then(function(yards){
      yards.reduce(function(doesntMatter, yard){
        //Does the following for each yard in yards
        YardHelper.getColoniesInYard(yard.id).then(function(Colonies){
          if (Colonies!=null){
            yard.numColoniesInYard = Colonies.length;
          }
        })
        VisitNotesHelper.getRemindersByYardId(yard.id).then(function(Reminders){
          if (Reminders!=null){
            yard.Reminders = Reminders;
            console.log(Reminders);
          }
        })

        VisitHelper.getLastVisitByYardId(yard.id).then(function(lastVisit){
          if (lastVisit){
            yard.lastVisit=lastVisit;
            //calculate time since last visit in days and hours.
            msAgo = (new Date(Date.now()-tzoffset)) - (new Date(lastVisit.date_time));
            yard.daysAgo = parseInt(msAgo/(3600000*24),10);
          } else {
            yard.lastVisit=null;
          }
        })
      },0);

      $scope.yards = yards;
    });
  });

  $scope.showCreateYardPopup = function(){
    var createYardPopup = $ionicPopup.show({
      title: 'Create New Yard',
      scope: $scope,
      template: '<label class="item item-input">'+
                '  <input ng-model=newYard.name type="text" placeholder="Dandy Lion Lane">'+
                '</label>',
      buttons: [
        { text: 'Cancel'},
        { text: 'Add Yard',
          type: 'button-positive',
          onTap: function(e) {
            YardHelper.createYard($scope.newYard).then(function(yardId){
              if (yardId!=null){
                $scope.newYard.id = yardId;
                $scope.goToYard($scope.newYard);
              }
          })
          }
        }
      ]

    })
  }

  $scope.showReminders = function(reminders){
    console.log(reminders);
    $scope.Reminders = reminders;
    remindersPopup = $ionicPopup.show({
      title: 'Colony Reminders in Yard',
      scope:$scope,
      template: '<div class="item" ng-repeat="reminder in Reminders" ng-click="goToColony(reminder.colony_id, reminder.yard_id)">'+
                '  <i class="icon ion-ios-pricetag"> {{reminder.colony_number}}</i> - {{reminder.note}}'+
                '</div>',
      buttons: [
        {text: 'Close'}
      ]

    })
  }

  $scope.goToColony = function(colonyId, yardId) {
    remindersPopup.close();
    $location.url('/yard/' + yardId + '/colony/' + colonyId);
  }

  $scope.goToYard = function (yard){
    $location.url('/yard/' + yard.id);
  }

});
