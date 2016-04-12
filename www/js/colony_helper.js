//created by Joe Meyer on Apr 11, 2016
//This script contains functions relating to colonies.

angular.module('ameApp')

.factory('ColonyHelper', function($cordovaSQLite) {
  var colony = [];
  var service = {};

  service.getColonyById = function(id) { //returns a colony object when given a valid ID
    var query = "SELECT * FROM Colonies WHERE id = " + id;
    console.log(query);
    $cordovaSQLite.execute(db, query).then(function(res) {
      colony = res.rows.item(0);
    });

    console.log("c:"+colony);
    return colony;
  }

  service.saveColony = function (yardId, colonyNumber, colonyActiveDate, colonyOrigin) {
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
