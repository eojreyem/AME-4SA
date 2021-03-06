
angular.module('ameApp')

.controller('YardCtrl', function($scope, $ionicPopup, $stateParams, $location, $cordovaSQLite, $ionicSideMenuDelegate, ColonyHelper, YardHelper, VisitHelper, ionicDatePicker) {

  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //timezone offset in milliseconds
  var moveColonyPopup = $ionicPopup;


  //Load current yard into currentYard
  $scope.refreshColonies = function(){
    YardHelper.getYardById($stateParams.yardId).then(function (yard){
      $scope.currentYard = yard;
      YardHelper.getColoniesInYard(yard.id).then(function (colonies){
        if (colonies!=null){
          colonies.reduce(function(doesntMatter, colony){
            VisitHelper.getLastVisitByColonyId(colony.id).then(function(lastVisit){
              if (lastVisit != null){
                //calculate time since last visit in days and hours.
                msAgo = (new Date(Date.now()-tzoffset)) - (new Date(lastVisit.date_time));
                colony.daysAgo = parseInt(msAgo/(3600000*24),10);
                colony.hoursAgo = parseInt(((msAgo/(3600000))%24),10);
                //turn text red if it's been over 2 weeks since last visit!
                if (colony.daysAgo>=14){
                  document.getElementById("timeSinceVisit").style.color = "red";
                }
                colony.qty_boxes = lastVisit.qty_boxes;
                colony.last_visit_date_time= lastVisit.date_time;
                colony.last_queen_status = lastVisit.queen_status;
                colony.last_hive_type = lastVisit.hive_type;
                colony.last_disease = lastVisit.disease;
              };
            });
          },0);
          $scope.colonies = colonies;
        }else {
          $scope.colonies = [];
        }

      });

    });

  }
  $scope.refreshColonies();


  $scope.createColony = function(newColony) {
    $location.url('/yard/'+ $scope.currentYard.id + '/colony/new');
  };

  //custom sort function for ng-repeat to put nulls on top, then sort by date.
  $scope.nullsOnTop = function (A){
    if (A.last_visit_date_time == null){
      return -1;
    }
    else {
      return A.last_visit_date_time;
    }
  };

  $scope.showConfirmYardDelete = function() {
    var yardDeletePopup = $ionicPopup.confirm({
      title: 'Delete Yard',
      okText: 'DELETE',
      okType: 'button-assertive',
      template: '<h2>Are you sure?!</h2>'+
                '<p class="assertive">Yard will be removed from the database. Use this feature only if no visits are associated with it!</p>'
    });

    yardDeletePopup.then(function(res) {
      if(res) {
        console.log('delete the yard');
        YardHelper.deleteYard($scope.currentYard).then(function(is_deleted){
          if (is_deleted){
            $scope.goHome();
          }
        });
      } else {
        //do nothing
      }
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
            colony.in_yard_id = $scope.choice.yardId;
            console.log(colony);
            ColonyHelper.saveColony(colony);
            $scope.refreshColonies();
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
