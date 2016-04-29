// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ameApp')

.controller('VisitCtrl', function($scope, $location, $stateParams, $ionicSideMenuDelegate, DateHelper, YardHelper, ColonyHelper, QueenHelper, VisitHelper) {
  $scope.currentVisit =[null];

  visitId = $stateParams.visitId;
  VisitHelper.getQueenStatuses().then(function (statuses){
    $scope.queenStatuses = statuses;
  });
  VisitHelper.getHiveTypes().then(function (types){
    $scope.hiveTypes = types;
  });
  VisitHelper.getDiseases().then(function (diseases){
    $scope.diseases = diseases;
  });

  if (visitId == "new"){ //pre-populate fields for new visit.
    $scope.visitTitle=" New";
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    $scope.currentVisit.date_time = (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1);
    $scope.currentVisit.qty_boxes = null; // I could load the previous visit's # of boxes? Probably no.
    $scope.currentVisit.frames_of_bees_start = null;
    $scope.currentVisit.frames_of_bees_end = null;
    $scope.currentVisit.frames_of_brood_start = null;
    $scope.currentVisit.frames_of_brood_end = null;
    $scope.currentVisit.has_temper = false; // true or false
    $scope.currentVisit.is_feeding = false; // true or false


    //Load current colony into currentColony
    ColonyHelper.getColonyById($stateParams.colonyId).then(function (colony){
      $scope.currentColony = colony;
      //Load current yard into currentYard
      YardHelper.getYardById(colony.in_yard_id).then(function (yard){
        $scope.currentYard = yard;
      });
      QueenHelper.getQueensInColony(colony.id).then(function (queens){
        $scope.colonysQueens = queens;
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
        QueenHelper.getQueensInColony($stateParams.colonyId).then(function (queens){
          $scope.colonysQueens = queens;
        });
      });
    });
  }
  else {  // console log error
    console.log("Visit does not exist.");
  }

  $scope.createQueen = function() {
    //TODO: check if queen name is unique
    var queenNumber = document.getElementById("newQueenNumber");
    var queenOrigin = document.getElementById("newQueenOrigin");
    QueenHelper.saveQueen(
      queenNumber.value,
      $scope.currentColony.id,
      null, //motherId
      queenOrigin.value,
      null, //dateEmerged
      null //hexColor
    )
    $ionicSideMenuDelegate.toggleRight();
    queenNumber.value = null;
    queenOrigin.value = null;
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
        null); //deseaseId
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
        null); //deseaseId

    }



    $location.url('/yard/' + $scope.currentYard.id + '/colony/' + $scope.currentColony.id);
  };

  // Navigational functions
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
