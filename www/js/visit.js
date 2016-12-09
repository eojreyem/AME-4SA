

angular.module('ameApp')

.controller('VisitCtrl', function($scope, $location, $stateParams, $ionicSideMenuDelegate, $ionicPopup, ionicDatePicker, YardHelper, ColonyHelper, QueenHelper, VisitHelper) {

  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //timezone offset in milliseconds

  var newVisit = {  // template for a new visit
    id:"new",
    date_time: (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1),
    yard_id: $stateParams.yardId,
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

  var note = {  // blank template for note
    note: null,
    is_reminder: false
  };
  $scope.note = note;

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


  //load visit, yard, and colony
  VisitHelper.getVisitById($stateParams.visitId).then(function(existingVisit){
    if (existingVisit == null){
      $scope.visit = newVisit;
      /*TODO update fields for new visit.
      queen_id: null, //pull from past visit(s)
      qty_boxes: null, //pull from past visit(s)
      is_feeding: false, //pull from past visit(s)
      */
    }
    else {
      $scope.visit = existingVisit;  //load visit if it already exists
    }
    //Load visit colony, note - this is different than the current Yard used for nav at the bottom.
    YardHelper.getYardById($scope.visit.yard_id).then(function (yard){
      $scope.visit.yardName = yard.name;
    });
    //Load visit colony into currentColony
    if ($stateParams.colonyId != $scope.visit.colony_id){
      console.error("Visit is assigned to a different colony!");
    }
    ColonyHelper.getColonyById($scope.visit.colony_id).then(function (colony){
      $scope.currentColony = colony;
      QueenHelper.getQueensInColony(colony.id).then(function (){
        $scope.queens = queens;
      });
    })
  });

  //Load current yard into currentYard for nav at the bottom.
  YardHelper.getYardById($stateParams.yardId).then(function (yard){
    $scope.currentYard = yard;
  })

  $scope.openDatePicker = function(){
    ionicDatePicker.openDatePicker(datePickerObj);
  };

  $scope.createNote = function(note) {
    $scope.saveVisit($scope.visit).then(function (visitId){
      $scope.visit.id = visitId;
      VisitHelper.saveNote(note);
      console.log("save Note");
    });
  }

  $scope.saveVisit = function(visit) {
    VisitHelper.saveVisit(visit).then(function (visitId){
      console.log(visitId);
      //$location.url('/yard/' + $scope.currentYard.id + '/colony/' + $scope.currentColony.id);
    });
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
