

angular.module('ameApp')

.controller('VisitCtrl', function($scope, $location, $stateParams, $ionicSideMenuDelegate, $ionicPopup, ionicDatePicker, YardHelper, ColonyHelper, QueenHelper, VisitHelper) {
  $scope.currentVisit =[null];
  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //timezone offset in milliseconds

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
    $scope.currentVisit.date_time = (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1);
    $scope.currentVisit.qty_boxes = null; // TODO: I could load the previous visit's # of boxes?
    $scope.currentVisit.frames_of_bees = null;
    $scope.currentVisit.frames_of_brood = null;
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
      QueenHelper.getQueensInColony(colony.id).then(function (){
        $scope.queens = queens;
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

  datePickerObj = {
    callback: function (val) {  //Mandatory
      console.log('Return value from the datepicker popup is : ' + val, new Date(val));
      $scope.currentVisit.date_time = (new Date(val).toISOString().slice(0,-1));
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

  $scope.saveVisit = function() {
    if (visitId == "new"){  //create visit if new.
      VisitHelper.saveVisit(
        $scope.currentVisit.date_time,
        $scope.currentYard.id,
        $scope.currentColony.id,
        null, //queenId
        $scope.currentVisit.qty_boxes,
        null, //queenStatusId
        $scope.currentVisit.frames_of_bees,
        $scope.currentVisit.frames_of_brood,
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
        null, //queenStatusId
        $scope.currentVisit.frames_of_bees,
        $scope.currentVisit.frames_of_brood,
        $scope.currentVisit.has_temper, // true or false
        $scope.currentVisit.is_feeding, // true or false
        null); //diseaseId
    }

    $location.url('/yard/' + $scope.currentYard.id + '/colony/' + $scope.currentColony.id);
  };

  // Navigational functions
  //TODO Exit without saving?!
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
