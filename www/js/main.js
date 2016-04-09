// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ameApp')
/*

.run(function($ionicPlatform, $cordovaSQLite) {
        $ionicPlatform.ready(function() {
          if (window.cordova) {
            db = $cordovaSQLite.openDB({ name: "ame.db" }); //device
          }else{
            db = window.openDatabase("ame.db", '1', 'my', 1024 * 1024 * 100); // browser http://stackoverflow.com/questions/26101120/how-do-i-use-the-ngcordova-sqlite-service-and-the-cordova-sqliteplugin-with-ioni
          }
          $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS yards (id INTEGER PRIMARY KEY, name TEXT)");

          var query = "SELECT * FROM yards";
          $cordovaSQLite.execute(db, query).then(function(res) {
              if(res.rows.length > 0) {
                for (i = 0; i < res.rows.length; i++) {
                  console.log("SELECTED -> " + res.rows.item(i));
                  currentYards.push(res.rows.item(i));
                }

              } else {
                  console.log("No results found");
              }
          }, function (err) {
              console.error(err);
          });

        });
    });
*/

.controller('MainCtrl', function($scope, $cordovaSQLite, $location) {
  // No need for testing data anymore
  $scope.yards = [
    { name: 'Maple Acres' },
    { name: 'Charlies' },
  ];


  $scope.createYard = function() {
    //TODO: check if yard name is unique
    var name = document.getElementById("newyardname").value;
    console.log(name)
        var query = "INSERT INTO yards (name) VALUES (?)";
    $cordovaSQLite.execute(db, query, [name]).then(function(res) {
        console.log("INSERT ID -> " + res.insertId);
    }, function (err) {
        console.error(err);
    });


  };


  $scope.goToYard = function (yard){
    console.log(yard);
    $location.url('/' + yard.name);
  }


});
