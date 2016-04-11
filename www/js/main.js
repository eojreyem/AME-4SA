// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('ameApp')

.controller('MainCtrl', function($scope, $cordovaSQLite, $location) {
  // No need for testing data anymore


  //loads a list of yards in 4SA
  $scope.loadYards = function() {
    //clear current list
    $scope.yards = [];
    var query = "SELECT * FROM Yards";
    $cordovaSQLite.execute(db, query).then(function(res) {
        if(res.rows.length > 0) {
          for (i = 0; i < res.rows.length; i++) {
            console.log("SELECTED -> " + res.rows.item(i));
            $scope.yards.push(res.rows.item(i));
          }

        } else {
            console.log("No results found");
        }
    }, function (err) {
        console.error(err);
    });
  };


  //Create a new yard
  $scope.createYard = function() {
    //TODO: check if yard name is unique
    var name = document.getElementById("newyardname");
    console.log(name)
    var query = "INSERT INTO Yards (name) VALUES (?)";
    $cordovaSQLite.execute(db, query, [name.value]).then(function(res) {
      console.log("INSERT ID -> " + res.insertId);
      $scope.loadYards();
      name.value = "";
    }, function (err) {
      console.error(err);
    });

  };


  $scope.goToYard = function (yard){
    $location.url('/yard/' + yard.id);
  }


});
