

angular.module('ameApp')

.controller('VisitCtrl', function($scope, $location, $stateParams, $ionicSideMenuDelegate, $ionicPopup, ionicDatePicker, YardHelper, ColonyHelper, QueenHelper, VisitHelper, VisitNotesHelper) {

  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //timezone offset in milliseconds

  var newVisit = {  // template for a new visit
    id:"new",
    date_time: (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1),
    yard_id: $stateParams.yardId,
    colony_id: $stateParams.colonyId,
    queen_id: null,
    hive_type_id: null,
    qty_boxes: null,
    queen_status_id: null,
    frames_of_bees: null,
    frames_of_brood: null,
    has_temper: false,
    is_feeding: false,
    disease_id: null
  }

  var note = {  // blank template for note
    note: null,
    is_reminder: false
  };

  //Load current yard into currentYard for nav at the bottom.
  YardHelper.getYardById($stateParams.yardId).then(function (yard){
    $scope.currentYard = yard;
    newVisit.yard_name=yard.name;
  })

  //Load current colony into currentYard for nav at the bottom.
  ColonyHelper.getColonyById($stateParams.colonyId).then(function (colony){
    $scope.currentColony = colony;
    QueenHelper.getQueensInColony(colony.id).then(function (colonysQueens){
      $scope.colonysQueens = colonysQueens;
    });
  })

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
    $scope.hiveTypes = hiveTypes;
  });
  VisitHelper.getDiseases().then(function (diseases){
    $scope.diseases = diseases;
  });
  VisitHelper.getDataTypes().then(function (dataTypes){
    $scope.dataTypes = dataTypes;
  });


  //load visit
  VisitHelper.getVisitById($stateParams.visitId).then(function(existingVisit){
    if (existingVisit == null){   // Visit ID not in DB so it assumed new
      VisitHelper.getLastVisitByColonyId(newVisit.colony_id).then(function(lastVisit){
        if (lastVisit!=null){  //If it is not the first visit, load info from last visit
          newVisit.hive_type_id = lastVisit.hive_type_id;
          newVisit.queen_id=lastVisit.queen_id;
          newVisit.qty_boxes=lastVisit.qty_boxes;
          newVisit.is_feeding=lastVisit.is_feeding;
        }
        $scope.visit = newVisit;
        if (newVisit.queen_id != null){
          QueenHelper.getQueenById(newVisit.queen_id).then(function(reigningQueen){
            if (reigningQueen.date_inactive==null){
              $scope.reigningQueen = reigningQueen;
              document.getElementById("queenMarkIcon").style.color = reigningQueen.mark_color_hex;
            }
            else {
              $scope.reigningQueen = null;
              document.getElementById("queenMarkIcon").style.color = 'black';
            }
          });
        }
      });
    }
    else {
      $scope.visit = existingVisit;  //load visit if it already exists
      //Load visit colony into currentColony
      console.log(existingVisit);
      if ($stateParams.colonyId != $scope.visit.colony_id){
        console.error("COLONY VISIT DOESN'T MATCH BREADCRUMB/NAV COLONY!");
      }
      if (existingVisit.queen_id != null){
        QueenHelper.getQueenById(existingVisit.queen_id).then(function(reigningQueen){
          $scope.reigningQueen = reigningQueen;
          document.getElementById("queenMarkIcon").style.color = reigningQueen.mark_color_hex;
        });

      }else {
        $scope.reigningQueen = null;
        $scope.visit.queen_id = null;
        document.getElementById("queenMarkIcon").style.color = "#000000";
      }
    }
  });

  $scope.reigningQueenChanged = function() {
    console.log("QUEEN CHANGE");
    if ($scope.visit.queen_id != null){
      QueenHelper.getQueenById($scope.visit.queen_id).then(function(reigningQueen){
        $scope.reigningQueen = reigningQueen;
        document.getElementById("queenMarkIcon").style.color = reigningQueen.mark_color_hex;
      });
    }
  }

  $scope.removeReigningQueen = function(){
    $scope.reigningQueen = null;
    $scope.visit.queen_id = null;
    document.getElementById("queenMarkIcon").style.color = "#000000";
  }

  $scope.showAddNotePopup = function(){
    var addNotePopup = $ionicPopup.show({
      title: 'Add a Note to This Visit',
      scope:$scope,
      template: '<div class="list">'+
        '<textarea rows="4" placeholder="colony is pretty" ng-model="note.note"></textarea></label>'+
        '<li class="item item-toggle"> Reminder'+
        '  <label class="toggle toggle-assertive">'+
          '  <input type="checkbox" ng-model="note.is_reminder">'+
          '  <div class="track">'+
          '    <div class="handle"></div>'+
        '    </div>'+
      '  </li>'+
      '    </div>',
      buttons: [
        {text: 'Cancel'},
        {text: 'Add Note',
          type: 'button-positive',
          onTap: function (e){
            console.log("Save Note");
            VisitHelper.saveVisit($scope.visit).then(function(visitId){
              note.visit_id = visitId;
              VisitNotesHelper.saveNote(note);
              $scope.note.note = null;
              $scope.note.is_reminder = false;
            });
          }

        }]
      })
    }


  $scope.queenStatusChange = function(){
    if ($scope.visit.queen_status_id>3 && $scope.visit.queen_id !=null){
          var inactiveQuestionPopup = $ionicPopup.show({
            title: 'Set Queen as Inactive?',
            scope: $scope,
            template: '<h3><b>Queen #{{reigningQueen.id}} {{reigningQueen.name}}</b></h3>',
            buttons: [
              {text: 'No'},
              {text: 'Yes',
              type: 'button-assertive',
              onTap: function (e) {
                  $scope.choice = {};
                  QueenHelper.getQueenInactiveReasons().then(function(reasons){
                    $scope.reasons = reasons;
                    var queenInactivePopup = $ionicPopup.show({
                      title: 'Choose the Reason',
                      scope: $scope,
                      template: 'Why is Queen #{{reigningQueen.id}} {{reigningQueen.name}} inactive?'+
                                '<ion-list>                                '+
                                '  <ion-radio ng-repeat="reason in reasons" ng-model="choice.reasonId" ng-value="{{reason.id}}">{{reason.reason}}</ion-radio>'+
                                '</ion-list>  ',
                      buttons: [
                        { text: 'Cancel' },
                        { text: 'Inactive',
                          type: 'button-assertive',
                          onTap: function(e) {
                          if ($scope.choice.reasonId>0) {
                            console.log("selected "+reasons[$scope.choice.reasonId-1].reason+", store to queen");
                            QueenHelper.updateQueenInactive($scope.reigningQueen.id, $scope.choice.reasonId);
                            $scope.reigningQueen = null;
                            $scope.visit.queen_id = null;
                            QueenHelper.getQueensInColony($scope.currentColony.id).then(function (colonysQueens){
                              $scope.colonysQueens = colonysQueens;
                            });

                            document.getElementById("queenMarkIcon").style.color = '#000000';
                          } else {
                            console.log("No inactive reason selected.");
                            e.preventDefault();
                            }
                          }
                        }
                      ]
                    })
                  });
              }
              }
            ]
          });
        };
  }

  $scope.openDatePicker = function(){
    ionicDatePicker.openDatePicker(datePickerObj);
  };


  $scope.saveVisit = function(visit) {
    VisitHelper.saveVisit(visit).then(function (visitId){
      if (visitId != null){
        $scope.visit.id = visitId;
      }
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
