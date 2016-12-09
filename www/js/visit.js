

angular.module('ameApp')

.controller('VisitCtrl', function($scope, $location, $stateParams, $ionicSideMenuDelegate, $ionicPopup, ionicDatePicker, YardHelper, ColonyHelper, QueenHelper, VisitHelper) {

  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //timezone offset in milliseconds

  var newVisit = {
    id:"new",
    date_time: (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1),
    yard_id: null,
    colony_id: $stateParams.colonyId,
    queen_id: null, //pull from last visit
    qty_boxes: null, //pull from last visit
    queen_status_id: null,
    frames_of_bees: null,
    frames_of_brood: null,
    has_temper: false,
    is_feeding: false, //pull from last visit
    disease_id: null
  }

  datePickerObj = {
    callback: function (val) {  //Mandatory
      console.log('Return value from the datepicker popup is : ' + val, new Date(val));
      $scope.visit.date_time = (new Date(val).toISOString().slice(0,-1));
    },
    from: new Date(2014, 1, 1), //Optional
    to: new Date(), //Optional
    inputDate: new Date(),      //Optional
    closeOnSelect: false,       //Optional
    templateType: 'modal'       //Optional
  };

  //get drop down choices
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

  //Load current colony into currentColony
  ColonyHelper.getColonyById($stateParams.colonyId).then(function (colony){
    $scope.currentColony = colony;
    //Load current yard into currentYard
    YardHelper.getYardById(colony.in_yard_id).then(function (yard){
      $scope.currentYard = yard;
      if ($stateParams.visitId == "new"){ //TODO pre-populate fields for new visit.
        newVisit.yardName = yard.name;
        newVisit.yard_id = yard.id;
        $scope.visit = newVisit;
        console.log($scope.visit);
        /*TODO update fields for new visit.
        queen_id: null, //pull from past visit(s)
        qty_boxes: null, //pull from past visit(s)
        is_feeding: false, //pull from past visit(s)
        */
      }
      else if ($stateParams.visitId >= 0){  //if a visitId was passed, load old visit for editing/viewing
        $scope.visitTitle=" Visit ID:" + $stateParams.visitId;
        VisitHelper.getVisitById($stateParams.visitId).then(function(visit){
          //TODO handle exception where visit where visit isn't returned.
          //Load yard into visit.yard
          YardHelper.getYardById(visit.yard_id).then(function (yard){
            visit.yard_id = yard.id;
            visit.yardName = yard.name;
          });
          $scope.visit = visit;
        });
      }
      else {  // console log error
        console.log("Visit does not exist.");
        $location.url('/')
      }
    });
    QueenHelper.getQueensInColony(colony.id).then(function (){
      $scope.queens = queens;
    });

  });

  $scope.openDatePicker = function(){
    ionicDatePicker.openDatePicker(datePickerObj);
  };

  $scope.saveVisit = function(visit) {
    if ($stateParams.visitId == "new"){  //create visit if new.
      VisitHelper.saveVisit(visit); //diseaseId
    }
    else { //update existing visit with any edits in the fields
      VisitHelper.updateVisit(visit);
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
