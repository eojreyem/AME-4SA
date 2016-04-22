// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ameApp')

.controller('VisitCtrl', function($scope, $location, $stateParams, $ionicSideMenuDelegate, YardHelper, ColonyHelper, QueenHelper, VisitHelper) {
  $scope.currentVisit =[null];
  visitId = $stateParams.visitId;

  if (visitId == "new"){ //pre-populate fields for new visit.
    $scope.visitTitle=" New";
    $scope.currentVisit.date_time = "apr 10"; //TODO: get current date and time and format
    $scope.currentVisit.qty_boxes = null; // I could load the previous visit's # of boxes? Probably no.
    $scope.currentVisit.frames_of_bees_start = null;
    $scope.currentVisit.frames_of_bees_end = null;
    $scope.currentVisit.frames_of_brood_start = null;
    $scope.currentVisit.frames_of_brood_end = null;
    $scope.currentVisit.has_temper = false; // true or false
    $scope.currentVisit.is_feeding = false; // true or false
    //Load current yard into currentYard
    YardHelper.getYardById($stateParams.yardId).then(function (yard){
      $scope.currentYard = yard;
    });
    //Load current colony into currentColony
    ColonyHelper.getColonyById($stateParams.colonyId).then(function (colony){
      $scope.currentColony = colony;
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
        null, //TODO: get real date.
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

    /* TODO: format for saving time in db
      var ss = currentTime.getSeconds();
      var mi = currentTime.getMinutes();
      var hh = currentTime.getHours();
      var dd = currentTime.getDate();
      var mo = currentTime.getMonth()+1; //January is 0!
      var yyyy = currentTime.getFullYear();
      //format numbers less than 10 to add a 0
      if(ss<10) {
        ss='0'+ss}
      if(mi<10) {
        mi='0'+mi}
      if(hh<10) {
        hh='0'+hh}
      if(dd<10) {
        dd='0'+dd}
      if(mo<10) {
        mo='0'+mo}
      currentTime = (yyyy + '-' + mo + '-' + dd + ' ' + hh + ':' + mi + ':' + ss);
    */
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
