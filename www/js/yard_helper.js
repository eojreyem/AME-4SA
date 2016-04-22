//created by Joe Meyer on Apr 11, 2016
//This script contains functions relating to colonies.

angular.module('ameApp')

.factory('YardHelper', function($cordovaSQLite, $q) {
  var yard = [];
  var service = {};

  service.getYardById = function(id) { //returns a yard object when given a valid ID
    var deferred = $q.defer();
    var query = "SELECT * FROM Yards WHERE id = " + id;
    $cordovaSQLite.execute(db, query).then(function(res) {
      yard = res.rows.item(0);
      deferred.resolve(yard);
      console.log("Selected yard");
    });

    return deferred.promise;
  }

  service.getAllYards = function() { //returns all yards
    yards =[];
    var query = "SELECT * FROM Yards";
    $cordovaSQLite.execute(db, query).then(function(res) {
        if(res.rows.length > 0) {
          for (i = 0; i < res.rows.length; i++) {
            yards.push(res.rows.item(i));
          }

        } else {
            console.log("No results found");
        }
    }, function (err) {
        console.error(err);
    });
    return yards;
  }

  service.saveYard = function(name) { //save new yard to the database
    /* TODO: test for yard name duplicates
    yards = [];
    yards = service.getAllYards();
    for (i=0; i < yards.length; i++){
      console.log("COUNT:" + i);
    }
    */
    var query = "INSERT INTO Yards (name) VALUES (?)";
    $cordovaSQLite.execute(db, query, [name]).then(function(res) {
      console.log("INSERT ID -> " + res.insertId);
    }, function (err) {
      console.error(err);
    });

  }

  service.getColoniesInYard = function(yardId) { //return all colonies in a yardId
    var deferred = $q.defer();
    colonies = [];
    var query = "SELECT * FROM Colonies WHERE in_yard_id = ?";
    $cordovaSQLite.execute(db, query, [yardId]).then(function(res) {
      if(res.rows.length > 0) {
        for (i = 0; i < res.rows.length; i++) {
          colonies.push(res.rows.item(i));
        }
        deferred.resolve(colonies);
      }
    });
    return deferred.promise;
  }

  return service;
});
