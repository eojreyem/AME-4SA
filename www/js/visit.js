

angular.module('ameApp')

.controller('VisitCtrl', function($scope, $location, $stateParams, $ionicSideMenuDelegate, $ionicPopup, ionicDatePicker, YardHelper, ColonyHelper, QueenHelper, VisitHelper, VisitNotesHelper) {

  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //timezone offset in milliseconds

  var newVisit = {  // template for a new visit
    id:"new",
    date_time: (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1),
    yard_id: $stateParams.yardId,
    colony_id: $stateParams.colonyId,
    queen_id: null,
    hive_type_id: 1,
    qty_boxes: 1,
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

  var changeQueenPopup = [];
  var colonylessQueenPopup = [];

  //Load current yard into currentYard for nav at the bottom.
  YardHelper.getYardById($stateParams.yardId).then(function (yard){
    $scope.currentYard = yard;
    newVisit.yard_name=yard.name;
  })

  //Load current colony into currentYard for nav at the bottom.
  ColonyHelper.getColonyById($stateParams.colonyId).then(function (colony){
    $scope.currentColony = colony;

    datePickerObj = {
      callback: function (val) {  //Mandatory
        console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        $scope.visit.date_time = (new Date(val).toISOString().slice(0,-1));
      },
      from: colony.date_active, //Optional
      to: new Date(), //Optional
      inputDate: new Date(),      //Optional
      closeOnSelect: false,       //Optional
      templateType: 'modal'       //Optional
    };

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

  //assume no queen visit loading will replace if there is.
  $scope.reigningQueen = {name:"click for queens"};
  document.getElementById("queenMarkIcon").style.color = 'black';

  //load visit
  VisitHelper.getVisitById($stateParams.visitId).then(function(existingVisit){
    if (existingVisit == null){   // Visit ID not in DB so it assumed new
      VisitHelper.getLastVisitByColonyId(newVisit.colony_id).then(function(lastVisit){
        if (lastVisit!=null){  //If it is not the first visit, load info from last visit
          newVisit.hive_type_id = lastVisit.hive_type_id;
          newVisit.qty_boxes=lastVisit.qty_boxes;
          newVisit.is_feeding=lastVisit.is_feeding;
          if(lastVisit.queen_id!=null){  //if the last visit had a queen...
            QueenHelper.getQueenById(lastVisit.queen_id).then(function(reigningQueen){
              if (reigningQueen.date_inactive==null && reigningQueen.in_colony_id == newVisit.colony_id){ // check if it's still alive...
                newVisit.queen_id=lastVisit.queen_id; // and set as default queen for this visit.
                $scope.reigningQueen = reigningQueen;
                document.getElementById("queenMarkIcon").style.color = reigningQueen.mark_color_hex;
              }
            });
          }
        } else {
          document.getElementById("hiveTypeSelector").style.color = 'limegreen';
          document.getElementById("numberBoxesBtn").style.color = 'limegreen';
        }
        $scope.visit = newVisit;
        $scope.saveVisit(newVisit);
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

      }
    }
  });

  $scope.changeQueen = function(queen) {
    console.log("QUEEN CHANGE");
    if (queen==null){
      $scope.reigningQueen = {name:"click for queens"};
      document.getElementById("queenMarkIcon").style.color = 'black';
      $scope.visit.queen_id = null;
    }else {
      $scope.reigningQueen = queen;
      $scope.visit.queen_id = queen.id;
      queen.in_colony_id = $scope.currentColony.id;
      QueenHelper.saveQueen(queen);
      document.getElementById("queenMarkIcon").style.color = queen.mark_color_hex;
    }
    changeQueenPopup.close();
    colonylessQueenPopup.close();
  }

  $scope.changeNumBoxes = function(num){
    var boxes = $scope.visit.qty_boxes;

    if (num==-1 && boxes>2){
      //TODO prompt for lbs of honey harvested?
    }
    boxes = boxes + num;
    if (boxes<1){
      boxes = 1;
    }
    $scope.visit.qty_boxes = boxes;
  }


  $scope.showDeleteVisitPopup = function (){
    var visitDeletePopup = $ionicPopup.confirm({
      title: 'Delete Visit',
      okText: 'DELETE',
      okType: 'button-assertive',
      template: '<h2>Are you sure?!</h2>'+
                '<p class="assertive">Visit will be deleted as well as all notes and data associated with it.</p>'
    });

    visitDeletePopup.then(function(res) {
      if(res) {
        console.log('delete the visit');
        VisitHelper.deleteVisit($scope.visit).then(function(is_deleted){
          if (is_deleted){
            $location.url('/yard/' + $scope.currentYard.id + '/colony/' + $scope.currentColony.id);
          }
        });
      } else {
        //do nothing
      }
    });
  };


  $scope.showChangeQueenPopup = function(){
    QueenHelper.getQueensInColony($scope.currentColony.id).then(function (colonysQueens){
      $scope.colonysQueens = colonysQueens;
      changeQueenPopup = $ionicPopup.show({
        title: 'Choose Reigning Queen',
        subTitle: 'long press for queen\'s page',
        scope: $scope,
        template: '<div class="list">'+
                  '  <button class="button button-block button-outline button-dark" ng-click="showColonyLessQueens()">Queens w/o colony</button>'+
                  '  <button class="button button-block button-outline button-dark" ng-click="changeQueen()">Leave Blank</button>'+
                  '  <div class="item item-divider" ng-show="colonysQueens"><b>Queens in this colony</b></div>'+
                  '  <a class="item" ng-repeat="queen in colonysQueens" ng-click="changeQueen(queen)" on-hold="goToQueen(queen)" >{{queen.id}} {{queen.name}} </a> '+
                  '</div>  ',

        buttons: [
          {text: 'Cancel'},
          {text: 'New Queen',
            type: 'button-positive',
            onTap: function (e){
              changeQueenPopup.close();
              $location.url('/yard/' + $scope.currentYard.id + '/colony/' + $scope.currentColony.id + '/visit/' + $scope.visit.id + '/queen/new' );
            }
          }
        ]
      });
    });

  };

  $scope.showColonyLessQueens = function(){
    QueenHelper.getQueensWOColony().then(function (colonylessQueens){
      $scope.colonylessQueens = colonylessQueens;
      colonylessQueenPopup = $ionicPopup.show({
        title: 'Choose Reigning Queen',
        subTitle: 'long press for queen\'s page',
        scope: $scope,
        template: '<div class="list" ng-show="colonylessQueens">'+
                  '  <div class="item item-divider"><b>Queens not in a colony</b></div>'+
                  '  <a class="item" ng-repeat="queen in colonylessQueens" ng-click="changeQueen(queen)" on-hold="goToQueen(queen)" >{{queen.id}} {{queen.name}} </a> '+
                  '</div>  '+
                  '<p ng-hide="colonylessQueens">All queens are in colonies!</p>',

        buttons: [
          {text: 'Cancel'}
        ]
      });
    });

  };


  $scope.changeTimeBy = function(minuteChange){
    dateObj = new Date($scope.visit.date_time);
    dateObj.setMinutes(dateObj.getMinutes() + minuteChange);
    $scope.visit.date_time = (new Date(dateObj).toISOString().slice(0,-1));
  }


  $scope.showChangeVisitTime = function(){
    var changeVisitTime = $ionicPopup.show({
      title: 'Time of Visit',
      scope: $scope,
      template: '<h1>{{visit.date_time | date:"h:mm a"}}</h1>'+
                '<div class ="button-bar">'+
                '<button class="button button-positive icon ion-minus-circled col-33" ng-click="changeTimeBy(-5)""></button>'+
                '<button class="button button-dark button-outline col-33">5 MIN</button>'+
                '<button class="button button-positive icon ion-plus-circled col-33" ng-click="changeTimeBy(5)""></button>'+
                '</div>'+
                '<div class ="button-bar">'+
                '<button class="button button-positive icon ion-minus-circled col-33" ng-click="changeTimeBy(-60)""></button>'+
                '<button class="button button-dark button-outline col-33">1 HR</button>'+
                '<button class="button button-positive icon ion-plus-circled col-33" ng-click="changeTimeBy(60)""></button>'+
                '</div>',
      buttons: [
        {text: 'Done',
         type: 'button-positive',
         onTap: function (e){

         }
      }]
    })
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

    $scope.showAddDataPopup = function(){
    var addDataPopup = $ionicPopup.show({
      title: 'Add a Measurement to This Visit',
      scope:$scope,
      template: '<div class="list">'+
      '  <label class="item item-input item-select">'+
        '  <div class="input-label">       Type          </div>'+
          '<select class="item item-input item-select">'+
            '  <option ng-repeat="dataTypes in dataTypes">{{dataTypes.type}}</option>          </select>        </label>'+
        '<label class="item item-input">'+
          '<input type="number" placeholder="Qty measured">        </label>      </div>',
      buttons: [
        {text: 'Cancel'},
        {text: 'Add Data',
          type: 'button-positive',
          onTap: function (e){
            console.log("TODO: Save Data");
            /*VisitHelper.saveVisit($scope.visit).then(function(visitId){
              note.visit_id = visitId;
              VisitNotesHelper.saveNote(note);
              $scope.note.note = null;
              $scope.note.is_reminder = false;
            });*/
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
                            $scope.reigningQueen.reason_inactive_id = $scope.choice.reasonId;
                            $scope.reigningQueen.date_inactive = (new Date(Date.now()-tzoffset)).toISOString().slice(0,-1);
                            $scope.reigningQueen.in_colony_id = null;
                            QueenHelper.saveQueen($scope.reigningQueen);
                            $scope.changeQueen(null);
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
    });
  };

  $scope.saveCloseVisit = function(visit) {
    VisitHelper.saveVisit(visit).then(function (visitId){
      $location.url('/yard/' + $scope.currentYard.id + '/colony/' + $scope.currentColony.id);
    });
  };

  // Navigational functions
  //TODO Exit without saving?!
  $scope.goToColony = function() {
    $location.url('/yard/' + $scope.currentYard.id + '/colony/' + $scope.currentColony.id);
  }
  $scope.goToYard = function() {
    $location.url('/yard/' + $scope.currentYard.id );
  }

  $scope.goToQueen = function(queen) {
    changeQueenPopup.close();
    colonylessQueenPopup.close();
    $location.url('/yard/' + $scope.currentYard.id + '/colony/' + $scope.currentColony.id + '/visit/' + $scope.visit.id + '/queen/' + queen.id );
  }

  $scope.goHome = function () {
    $location.url('/')
  }

});
