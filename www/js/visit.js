// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ameApp')

.controller('VisitCtrl', function($scope, $location, $stateParams, $cordovaSQLite, $ionicSideMenuDelegate) {



  //Load current yard into currentYard
  $scope.currentVisit = [];

  if ($stateParams.visitId == "new"){
   $scope.visitTitle=" New";
   //initalize visit date and time
   $scope.currentVisit.date_time = new Date();
  }
  else if ($stateParams.visitId >= 0){
   $scope.visitTitle= " Visit ID:" + $stateParams.visitId
   var query = "SELECT * FROM Visits WHERE id = ?";
   $cordovaSQLite.execute(db, query, [$stateParams.visitId]).then(function(res) {
     $scope.currentVisit = res.rows.item(0);

   });
  }
  else {
    console.log("error, no visit");
  }

  currentYard = [];
  var query = "SELECT * FROM Yards WHERE id = ?";
  $cordovaSQLite.execute(db, query, [$stateParams.yardId]).then(function(res) {
    currentYard = res.rows.item(0);
    $scope.yardName = currentYard.name;
  });

  //Load current colony into currentColony
  currentColony = [];
  var query = "SELECT * FROM Colonies WHERE id = ?";
  $cordovaSQLite.execute(db, query, [$stateParams.colonyId]).then(function(res) {
    currentColony = res.rows.item(0);
    $scope.colonyName = currentColony.name;
  });

  $scope.createQueen = function() {
    //TODO: check if queen name is unique
    var queenNumber = document.getElementById("newQueenNumber").value;
    var queenOrigin = document.getElementById("newQueenOrigin").value;
    var query = "INSERT INTO Queens (name, in_colony_id, origin) VALUES (?,?,?)";
    $cordovaSQLite.execute(db, query, [queenNumber, currentColony.id, queenOrigin]).then(function(res) {
        console.log("INSERT ID -> " + res.insertId);

        $ionicSideMenuDelegate.toggleRight();
    }, function (err) {
        console.error(err);
    });
  };

  $scope.saveVisit = function() {
    //creates the visit.
    console.log($scope.currentVisit);
    if ($stateParams.visitId == "new"){
      var query = "INSERT INTO Visits (date_time, colony_id, yard_id) VALUES (?,?,?)";
      $cordovaSQLite.execute(db, query, [$scope.currentVisit.date_time, currentColony.id, currentYard.id]).then(function(res) {
          console.log("INSERT ID -> " + res.insertId);
      }, function (err) {
          console.error(err);
      });
    }

    //updates the visit with any edits in the fields
    var query = "UPDATE Visits SET"+
    " frames_of_bees_start = " +$scope.currentVisit.frames_of_bees_start+
    ", frames_of_bees_end = " +$scope.currentVisit.frames_of_bees_end+
    ", frames_of_brood_start = " +$scope.currentVisit.frames_of_brood_start+
    ", frames_of_brood_end = " +$scope.currentVisit.frames_of_brood_end+
    ", has_temper = " +$scope.currentVisit.has_temper+
    ", is_feeding = " +$scope.currentVisit.is_feeding+
    ", qty_boxes = " +$scope.currentVisit.qty_boxes+
    " WHERE id = ?";
    console.log(query);
    $cordovaSQLite.execute(db, query,[$stateParams.visitId]).then(function(res) {
        console.log("Visit Updated ");
    }, function (err) {
        console.error(err);
    });

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

    $location.url('/yard/' + currentYard.id + '/colony/' + currentColony.id);
  };

  $scope.goToColony = function() {
    $location.url('/yard/' + currentYard.id + '/colony/' + currentColony.id);
  }

  $scope.goToYard = function() {
    console.log("nav to yard");
    $location.url('/yard/' + currentYard.id );
  }

  $scope.goHome = function () {
    $location.url('/')
  }

});
