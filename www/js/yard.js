// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ameApp')

.controller('YardCtrl', function($scope, $stateParams, $location, $cordovaSQLite) {
  // No need for testing data anymore

  //Load current yard into currentYard
  currentYard = [];
  var query = "SELECT * FROM Yards WHERE id = ?";
  $cordovaSQLite.execute(db, query, [$stateParams.yardId]).then(function(res) {
    currentYard = res.rows.item(0);
    $scope.yardName = currentYard.name;
  });

  //loads a list of colonies in currentYard
  $scope.loadColonies = function() {
    //clear current list
    $scope.colonies = [];
    var query = "SELECT * FROM Colonies WHERE in_yard_id = ?";
    $cordovaSQLite.execute(db, query, [$stateParams.yardId]).then(function(res) {
      if(res.rows.length > 0) {
        for (i = 0; i < res.rows.length; i++) {
          console.log("SELECTED -> " + res.rows.item(i));
          $scope.colonies.push(res.rows.item(i));
        }

      } else {
          console.log("No results found");
      }
    }, function (err) {
        console.error(err);
    });
  };


  $scope.goToColony = function (colony){
    console.log(colony);
    $location.url('/yard/'+ currentYard.id + '/colony/' + colony.id);
  }

  $scope.createColony = function() {
    //TODO: check if yard name is unique
    var colonyNumber = document.getElementById("newColonyNumber").value;
    var colonyOrigin = document.getElementById("newColonyOrigin").value;
    console.log(newColonyNumber)
    var query = "INSERT INTO Colonies (name, in_yard_id, origin) VALUES (?,?,?)";
    $cordovaSQLite.execute(db, query, [colonyNumber, currentYard.id, colonyOrigin]).then(function(res) {
        console.log("INSERT ID -> " + res.insertId);
        $scope.loadColonies();
    }, function (err) {
        console.error(err);
    });
  };

  $scope.goHome = function () {
    $location.url('/')
  }


});
