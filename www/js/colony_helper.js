//created by Joe Meyer on Apr 11, 2016
//This script contains functions relating to colonies.

angular.module('ameApp')

.factory('ColonyHelper', function($cordovaSQLite, $q) {
  var colony = [];
  var service = {};

  service.getColonyById = function(id) { //returns a colony object when given a valid ID
    var deferred = $q.defer();
    var query = "SELECT * FROM Colonies WHERE id = " + id;
    $cordovaSQLite.execute(db, query).then(function(res) {
      colony = res.rows.item(0);
      deferred.resolve(colony);
      console.log("Selected colony");
    });
    return deferred.promise;
  }


  service.getColonyByNumber = function(number) { //returns a colony object by Tag number if active
    var deferred = $q.defer();
    var query = "SELECT * FROM Colonies WHERE number = " + number + " AND date_inactive IS NULL";
    $cordovaSQLite.execute(db, query).then(function(res) {
      if (res.rows.length == 0){
        deferred.resolve(null);
        console.log("Tag Number not assigned to active colony");
      }
      else {
        colony = res.rows.item(0);
        deferred.resolve(colony);
        console.log("Selected colony");
      }
    });

    return deferred.promise;
  }

  service.saveColony = function (yardId, colonyNumber, colonyActiveDate, colonyOrigin) {
    //TODO: check for unique colonyNumber currently active
    var query = "INSERT INTO Colonies (in_yard_id, number, date_active, origin) VALUES (?,?,?,?)";
    $cordovaSQLite.execute(db, query, [yardId, colonyNumber, colonyActiveDate, colonyOrigin]).then(function(res) {
        console.log("INSERT COLONY ID -> " + res.insertId);
    }, function (err) {
        console.error(err);
    });
  }

  service.updateColonyYard = function (colonyId, yardId) {
    var query = "UPDATE Colonies SET in_yard_id = ? WHERE id = ?";
    $cordovaSQLite.execute(db, query, [yardId, colonyId]).then(function(res) {
      console.log("Moved Colony");
    }, function (err) {
        console.error(err);
    });
  }

return service;
});
