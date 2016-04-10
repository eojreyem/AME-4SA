// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ameApp')

.controller('YardCtrl', function($scope, $stateParams, $location, $cordovaSQLite) {
  // No need for testing data anymore
  $scope.yardName = $stateParams.yardName;

  $scope.colonies = [];
  var query = "SELECT * FROM Colonies";
  $cordovaSQLite.execute(db, query).then(function(res) {
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
  
  $scope.goToColony = function (colony){
    console.log(colony);
    $location.url('/'+colony.in_yard + '/C' + colony.name);
  }

  $scope.createColony = function() {
    //TODO: check if yard name is unique
    var colonyNumber = document.getElementById("newColonyNumber").value;
    var colonyOrigin = document.getElementById("newColonyOrigin").value;
    console.log(newColonyNumber)
    var query = "INSERT INTO Colonies (name, origin) VALUES (?,?)";
    $cordovaSQLite.execute(db, query, [colonyNumber, colonyOrigin]).then(function(res) {
        console.log("INSERT ID -> " + res.insertId);
        $scope.colonies.push([res]);
    }, function (err) {
        console.error(err);
    });


  };

  $scope.goHome = function() {
    window.location = 'index.html'
  }

});
