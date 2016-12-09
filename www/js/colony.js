angular.module('ameApp')

.controller('ColonyCtrl', function($scope, $location, $ionicPopup, $stateParams, ionicDatePicker, $ionicSideMenuDelegate, YardHelper, ColonyHelper, QueenHelper, VisitHelper) {

  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //timezone offset in milliseconds

  var newQueen = {
    name: null,
    in_colony_id: $stateParams.colonyId,
    mother_queen_id: null, //motherId
    origin: null,
    date_emerged: (new Date(Date.now()-tzoffset)).toISOString().slice(0,-1), //dateEmerged
    mark_color_hex:null, //hexColor
  };
  $scope.newQueen = newQueen;

  //Load current colony into currentColony
  ColonyHelper.getColonyById($stateParams.colonyId).then(function (colony){
    $scope.currentColony = colony;
    QueenHelper.getQueensInColony(colony.id).then(function(queens){
      $scope.queens = queens;
    });
    $scope.visits = VisitHelper.getVisitsForColony(colony.id);
    //Load colony's yard into currentYard
    YardHelper.getYardById(colony.in_yard_id).then(function (yard){
      $scope.currentYard = yard;
    });

  });

  $scope.showColonyInactivePopup = function(colony) {
    $scope.choice = {};
    ColonyHelper.getColonyInactiveReasons().then(function(reasons){
      $scope.reasons = reasons;
      var colonyInactivePopup = $ionicPopup.show({
        title: 'Choose the Reason',
        subTitle: 'that colony ' +colony.number+ " is inactive.",
        template: '<ion-list>                                '+
                  '  <ion-radio ng-repeat="reason in reasons" ng-model="choice.reasonId" ng-value="{{reason.id}}">{{reason.reason}}</ion-radio>'+
                  '</ion-list>  ',
        scope: $scope,
        buttons: [
          { text: 'Cancel'},
          { text: 'Remove',
            type: 'button-assertive',
            onTap: function(e) {
            if ($scope.choice.reasonId>0) {
              console.log("selected "+reasons[$scope.choice.reasonId-1].reason+", store to colony");
              ColonyHelper.setColonyInactive(colony.id, $scope.choice.reasonId);
            } else {
              console.log("UPDATE THIS WHEN YOU KNOW MORE.");
              e.preventDefault();
              }
            }
          }
        ]
      })
    });
    //TODO: What happens to the queens in that colony?
  };

  $scope.createQueen = function(newQueen) {
    QueenHelper.saveQueen(newQueen);
    //TODO saveQueen must return promise, then refresh queen list
    $ionicSideMenuDelegate.toggleRight();
  };

  datePickerObj = {
    callback: function (val) {  //Mandatory
      console.log('Return value from the datepicker popup is : ' + val, new Date(val));
      $scope.newQueen.date_emerged = (new Date(val).toISOString().slice(0,-1));
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


  $scope.showMoveQueenPopup = function(queen) {
    $scope.destination = {};
    var moveQueenPopup = $ionicPopup.show({
      title: 'Enter the Colony\'s number',
      subTitle: 'that queen ' +queen.name+ " will move to.",
      template: '<label class="item item-input">  <input type="number" ng-model="destination.colonyNum"></label>',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        { text: 'Move',
          type: 'button-positive',
          onTap: function(e) {
          if ($scope.destination.colonyNum>0) {
            console.log($scope.destination.colonyNum);
            ColonyHelper.getColonyByNumber($scope.destination.colonyNum).then(function (destinationColony){
              //TODO: if destinationColony is not null.
              if (destinationColony!= null){
                console.log("move queen " +queen.name+ " to " +destinationColony.number);
                QueenHelper.updateQueenColony(queen.id, destinationColony.id)
                QueenHelper.getQueensInColony($scope.currentColony.id).then(function(queens){
                  $scope.queens = queens;
                });
              }
            });

          } else {
            console.log("Enter Valid Colony Number.");
            e.preventDefault();
            }
          }
        }
      ]
    })
  };


  //Navigation functions
  $scope.newVisit = function() {
    $location.url('/yard/' + $scope.currentYard.id + '/colony/' + $scope.currentColony.id  + '/visit/new');
  }
  $scope.goToQueen = function(queen) {
    $location.url('/yard/' + $scope.currentYard.id + '/colony/' + $scope.currentColony.id  + '/queen/' + queen.id);
  }
  $scope.goToVisit = function(visit) {
    $location.url('/yard/' + $scope.currentYard.id + '/colony/' + $scope.currentColony.id  + '/visit/' + visit.id);
  }
  $scope.goToYard = function() {
    console.log("nav to yard");
    $location.url('/yard/' + $scope.currentYard.id );
  }
  $scope.goHome = function () {
    $location.url('/')
  }
});
