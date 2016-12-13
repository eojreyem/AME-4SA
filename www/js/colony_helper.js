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

  service.saveColony = function (colony) {
    var deferred = $q.defer();
    service.getColonyByNumber(colony.number).then(function (activeColony){ //check if tag is assigned
      if (activeColony==null){ //If no active colony is assigned the tag allow new colony create
        var query = "INSERT INTO Colonies (in_yard_id, number, date_active, origin) VALUES (?,?,?,?)";
        $cordovaSQLite.execute(db, query, [colony.in_yard_id, colony.number, colony.date_active, colony.origin]).then(function(res) {
            console.log("INSERT COLONY ID -> " + res.insertId);
            deferred.resolve(res.insertId);
        }, function (err) {
            console.error(err);
        });
      }else{
        console.log(activeColony); //TODO: tell user there is an active colony w/ that tag in yard X
        document.getElementById("newColonyNumber").style.color = "red";
      }
    });
    return deferred.promise;
  }

  service.getColonyInactiveReasons = function() { //returns reasons a colony might be inactive
    var deferred = $q.defer();
    reasons = [];
    var query = "SELECT * FROM Colony_Inactive_Reasons";
    $cordovaSQLite.execute(db, query).then(function(res) {
      if(res.rows.length > 0) {
        for (i = 0; i < res.rows.length; i++) {
          reasons.push(res.rows.item(i));
        }
        deferred.resolve(reasons);
      } else {
          console.log("No Colony Inactive Reasons found!");
      }
    });
    return deferred.promise;
  }

  service.updateColonyYard = function (colonyId, yardId) {
    var query = "UPDATE Colonies SET in_yard_id = ? WHERE id = ?";
    $cordovaSQLite.execute(db, query, [yardId, colonyId]).then(function(res) {
      console.log("Moved Colony");
    }, function (err) {
        console.error(err);
    });
  }

  service.setColonyInactive = function (colonyId, reasonId) {
    var query = "UPDATE Colonies SET date_inactive = ?, reason_inactive_id = ? WHERE id = ?";
    dateInactive = (new Date(Date.now())).toISOString().slice(0,-1);
    $cordovaSQLite.execute(db, query, [dateInactive, reasonId, colonyId]).then(function(res) {
      console.log("Set colony as inactive. :(");
    }, function (err) {
        console.error(err);
    });
  }

return service;
});
