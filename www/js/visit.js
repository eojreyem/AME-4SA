// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ameApp')

.controller('VisitCtrl', function($scope, $location, $stateParams, $ionicSideMenuDelegate, $ionicPopup, YardHelper, ColonyHelper, QueenHelper, VisitHelper) {
  $scope.currentVisit =[null];


  document.getElementById("queenButton").style.background = "grey"; //set actual queen parameters

  visitId = $stateParams.visitId;
  VisitHelper.getQueenStatuses().then(function (statuses){
    $scope.queenStatuses = statuses;
  });
  VisitHelper.getHiveTypes().then(function (hiveTypes){
    console.log(hiveTypes);
    $scope.hiveTypes = hiveTypes;
  });
  VisitHelper.getDiseases().then(function (diseases){
    $scope.diseases = diseases;
  });
  VisitHelper.getDataTypes().then(function (dataTypes){
    $scope.dataTypes = dataTypes;
  });

  if (visitId == "new"){ //pre-populate fields for new visit.
    $scope.visitTitle=" New";
    $scope.currentVisit.date_time = (new Date(Date.now())).toISOString().slice(0,-1);
    $scope.currentVisit.qty_boxes = null; // TODO: I could load the previous visit's # of boxes?
    $scope.currentVisit.frames_of_bees_start = null;
    $scope.currentVisit.frames_of_bees_end = null;
    $scope.currentVisit.frames_of_brood_start = null;
    $scope.currentVisit.frames_of_brood_end = null;
    $scope.currentVisit.has_temper = false; // true or false
    $scope.currentVisit.is_feeding = false; // true or false
    //TODO: figure out logic of if there was a tracked queen in the hive or not.


    //Load current colony into currentColony
    ColonyHelper.getColonyById($stateParams.colonyId).then(function (colony){
      $scope.currentColony = colony;
      //Load current yard into currentYard
      YardHelper.getYardById(colony.in_yard_id).then(function (yard){
        $scope.currentYard = yard;
      });

    });

  }
  else if (visitId >= 0){  //if a visitId was passed, load old visit for editing/viewing
    $scope.visitTitle=" Visit ID:" + visitId;
    VisitHelper.getVisitById($stateParams.visitId).then(function(visit){
      $scope.currentVisit = visit
      //Load that visit's colony into currentColony
      ColonyHelper.getColonyById(visit.colony_id).then(function (colony){
        $scope.currentColony = colony;
        //Load colony's yard into currentYard
        YardHelper.getYardById(colony.in_yard_id).then(function (yard){
          $scope.currentYard = yard;
        });
      });
    });
  }
  else {  // console log error
    console.log("Visit does not exist.");
  }
  var QueenPopup=null;
  $scope.showQueenPopup = function(colony) {
    QueenHelper.getQueensInColony(colony.id).then(function (){
      $scope.queens = queens;
    });
    $scope.choice = {};
    QueenPopup = $ionicPopup.show({
      template: '<ion-list>   '+
                '  <ion-radio ng-repeat="queen in queens" on-hold=goToQueen(queen) ng-model="choice.queenId" ng-value="{{queen}}">{{queen.name}}</ion-radio>'+
                '</ion-list>  ',
      title: 'Select a Queen',
      subTitle: 'long press for queen page',
      scope: $scope,
      buttons: [
      { text: 'No Q',
        onTap: function (){
          console.log("queenless")
        }
      },
      { text: 'New',
        onTap: function (){
          console.log("new")
        }
      },
      {
        text: 'Select',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.choice.queenId) {
            console.log("nothing selected?");
            //don't allow "move" button to do anything if no yard is selected.
            e.preventDefault();
          } else {
            console.log(queens);
            console.log($scope.choice.queenId);
            $scope.reigningQueen = $scope.choice.queenId;
            //ColonyHelper.updateColonyYard(colony.id, $scope.choice.yardId);
            //YardHelper.getColoniesInYard($scope.currentYard.id).then(function (colonies){
            //  $scope.colonies = colonies;
            //});
            console.log("do the thing");
            }
        }
      }
      ]
    });
  };


  $scope.saveVisit = function() {
    if (visitId == "new"){  //create visit if new.
      VisitHelper.saveVisit(
        $scope.currentVisit.date_time,
        $scope.currentYard.id,
        $scope.currentColony.id,
        null, //queenId
        $scope.currentVisit.qty_boxes,
        null, //queenStatusStartId
        null,  //queenStatusEndId
        $scope.currentVisit.frames_of_bees_start,
        $scope.currentVisit.frames_of_bees_end,
        $scope.currentVisit.frames_of_brood_start,
        $scope.currentVisit.frames_of_brood_end,
        ($scope.currentVisit.has_temper), // true or false
        ($scope.currentVisit.is_feeding), // true or false
        null); //diseaseId
    }
    else { //update existing visit with any edits in the fields
      VisitHelper.updateVisit(
        visitId,
        null, //dateTime
        null, //queenId
        $scope.currentVisit.qty_boxes,
        null, //queenStatusStartId
        null, //queenStatusEndId
        $scope.currentVisit.frames_of_bees_start,
        $scope.currentVisit.frames_of_bees_end,
        $scope.currentVisit.frames_of_brood_start,
        $scope.currentVisit.frames_of_brood_end,
        $scope.currentVisit.has_temper, // true or false
        $scope.currentVisit.is_feeding, // true or false
        null); //diseaseId

    }



    $location.url('/yard/' + $scope.currentYard.id + '/colony/' + $scope.currentColony.id);
  };

  // Navigational functions
  $scope.goToQueen = function(queen) {
    QueenPopup.close();
    $location.url('/yard/' + $scope.currentYard.id + '/colony/' + $scope.currentColony.id + '/queen/'+ queen.id);
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
