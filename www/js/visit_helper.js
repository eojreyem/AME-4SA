//created by Joe Meyer on Apr 11, 2016
//This script contains functions relating to visits.

angular.module('ameApp')

.factory('VisitHelper', function($cordovaSQLite, $q) {
  var visit = [];
  var service = {};

  service.getVisitById = function(id) { //returns a visit object when given a valid ID
    var deferred = $q.defer();
    var query = "SELECT Visits.*, Hive_Types.type AS hive_type, Queen_Statuses.status AS queen_status, Diseases.disease AS disease, Yards.name AS yard_name FROM Visits "+
                "LEFT JOIN Hive_Types ON Visits.hive_type_id = Hive_Types.id "+
                "LEFT JOIN Queen_Statuses ON Visits.queen_status_id = Queen_Statuses.id "+
                "LEFT JOIN Diseases ON Visits.disease_id = Diseases.id "+
                "LEFT JOIN Yards ON Visits.yard_id = Yards.id "+
                "WHERE Visits.id = ?";
    $cordovaSQLite.execute(db, query, [id]).then(function(res) {
      if (res.rows.length == 0){
        deferred.resolve(null);
        console.log("Failed to retreive visit "+ id);
        console.log(res);
      }
      else {
        visit = res.rows.item(0);
        visit.has_temper = Boolean(visit.has_temper)
        visit.is_feeding = Boolean(visit.is_feeding)
        deferred.resolve(visit);
      }

    }, function (err) {
        console.error(err);
    });
    return deferred.promise;
  }

  service.getLastVisitByColonyId = function(colonyId) { //returns a visit object when given a valid colony ID
    var deferred = $q.defer();
    console.log(colonyId);
    var query = "SELECT Visits.*, Hive_Types.type AS hive_type, Queen_Statuses.status AS queen_status, Diseases.disease AS disease, Yards.name AS yard_name FROM Visits "+
                "LEFT JOIN Hive_Types ON Visits.hive_type_id = Hive_Types.id "+
                "LEFT JOIN Queen_Statuses ON Visits.queen_status_id = Queen_Statuses.id "+
                "LEFT JOIN Diseases ON Visits.disease_id = Diseases.id "+
                "LEFT JOIN Yards ON Visits.yard_id = Yards.id "+
                "WHERE colony_id = ? ORDER BY date_time DESC LIMIT 1";
    $cordovaSQLite.execute(db, query, [colonyId]).then(function(res) {
      if (res.rows.length == 0){
        deferred.resolve(null);
        console.log("No visits from colony "+ colonyId);
      }
      else {
        visit = res.rows.item(0);
        visit.has_temper = Boolean(visit.has_temper)
        visit.is_feeding = Boolean(visit.is_feeding)
        deferred.resolve(visit);
      }

    }, function (err) {
        console.error(err);
    });
    return deferred.promise;
  }

  service.getLastVisitByYardId = function(yardId) { //returns a visit object when given a valid colony ID
    var visit = [];
    var deferred = $q.defer();
    var query = "SELECT date_time FROM Visits "+
                "WHERE yard_id = ? ORDER BY date_time DESC LIMIT 1";
    $cordovaSQLite.execute(db, query, [yardId]).then(function(res) {
      if (res.rows.length == 0){
        deferred.resolve(null);
        console.log("No last visit for yard ID:"+ yardId);
      }
      else {
        visit = res.rows.item(0);
        visit.has_temper = Boolean(visit.has_temper)
        visit.is_feeding = Boolean(visit.is_feeding)
        deferred.resolve(visit);
      }

    }, function (err) {
        console.error(err);
    });
    return deferred.promise;
  }



  service.getHiveType = function(id){
    var deferred = $q.defer();
    var typei =[];
    var query = "SELECT * FROM Hive_Types WHERE id = ?"
    $cordovaSQLite.execute(db, query, [id]).then(function(res) {
      if(res.rows.length == 1) {
        typei = res.rows.item(0);
        deferred.resolve(typei);
      } else {
          console.log("Hive Type failed to retreive!");
      }
    });
    return deferred.promise;
  };

  service.getQueenStatuses = function() { //returns queen statuses
    var deferred = $q.defer();
    var statuses = [];
    var query = "SELECT * FROM Queen_Statuses";
    $cordovaSQLite.execute(db, query).then(function(res) {
      if(res.rows.length > 0) {
        for (i = 0; i < res.rows.length; i++) {
          statuses.push(res.rows.item(i));
        }
        deferred.resolve(statuses);
      } else {
          console.log("No queen statuses found!");
      }
    });
    return deferred.promise;
  }

  service.getHiveTypes = function() { //returns hive types
    var deferred = $q.defer();
    var htypes = [];
    var query = "SELECT * FROM Hive_Types";
    $cordovaSQLite.execute(db, query).then(function(res) {
      if(res.rows.length > 0) {
        for (i = 0; i < res.rows.length; i++) {
          htypes.push(res.rows.item(i));
        }
        deferred.resolve(htypes);
      } else {
          console.log("No hive types found!");
      }
    });
    return deferred.promise;
  }

  service.getDataTypes = function() { //returns data collection types
    var deferred = $q.defer();
    var dtypes = [];
    var query = "SELECT * FROM Data_Types";
    $cordovaSQLite.execute(db, query).then(function(res) {
      if(res.rows.length > 0) {
        for (i = 0; i < res.rows.length; i++) {
          dtypes.push(res.rows.item(i));
        }
        deferred.resolve(dtypes);
      } else {
          console.log("No data types found!");
      }
    });
    return deferred.promise;
  }

  service.getDiseases = function() { //returns diseases
    var deferred = $q.defer();
    var diseases = [];
    var query = "SELECT * FROM Diseases";
    $cordovaSQLite.execute(db, query).then(function(res) {
      if(res.rows.length > 0) {
        for (i = 0; i < res.rows.length; i++) {
          diseases.push(res.rows.item(i));
        }
        deferred.resolve(diseases);
      } else {
          console.log("No disease key in db!");
      }
    });
    return deferred.promise;
  }

  service.getVisitsForColony = function(id) { //returns visits for a given colony
    var deferred = $q.defer();
    var visits = [];
    var query = "SELECT Visits.*, Hive_Types.type AS hive_type, Queen_Statuses.status AS queen_status, Diseases.disease AS disease, Yards.name AS yard_name FROM Visits "+
                "LEFT JOIN Hive_Types ON Visits.hive_type_id = Hive_Types.id "+
                "LEFT JOIN Queen_Statuses ON Visits.queen_status_id = Queen_Statuses.id "+
                "LEFT JOIN Diseases ON Visits.disease_id = Diseases.id "+
                "LEFT JOIN Yards ON Visits.yard_id = Yards.id "+
                "WHERE colony_id = ? ORDER BY date_time DESC";
    $cordovaSQLite.execute(db, query, [id]).then(function(res) {
      if(res.rows.length > 0) {
        for (i = 0; i < res.rows.length; i++) {
          console.log("SELECTED -> " + res.rows.item(i));
          visits.push(res.rows.item(i));
        }
        deferred.resolve(visits);

      } else {
          console.log("No visits found for colony");
      }
    }, function (err) {
        console.error(err);
    });
    return deferred.promise;
  };

  service.saveVisit = function (visit) {
    var deferred = $q.defer();
    service.getVisitById(visit.id).then(function(existingVisit){
      if (existingVisit == null){
        var query = "INSERT INTO Visits (date_time, yard_id, colony_id, queen_id, hive_type_id, qty_boxes, queen_status_id, frames_of_bees, frames_of_brood, has_temper, is_feeding, disease_id) VALUES (?,?,?,?,?,?,?,?,?,?,?, ?)";
        $cordovaSQLite.execute(db, query, [visit.date_time, visit.yard_id, visit.colony_id, visit.queen_id, visit.hive_type_id, visit.qty_boxes, visit.queen_status_id, visit.frames_of_bees, visit.frames_of_brood, (visit.has_temper ?1:0), (visit.is_feeding ?1:0), visit.disease_id]).then(function(res) {
          deferred.resolve(res.insertId);
        }, function (err) {
            console.error(err);
        });
      }
      else{
        var query = "UPDATE Visits SET date_time = ?, yard_id = ?, colony_id = ?, queen_id = ?, hive_type_id = ?, qty_boxes = ?, queen_status_id = ?, frames_of_bees = ?, frames_of_brood = ?, has_temper = ?, is_feeding = ?, disease_id = ? WHERE id = " + visit.id;
        $cordovaSQLite.execute(db, query, [visit.date_time, visit.yard_id, visit.colony_id, visit.queen_id, visit.hive_type_id, visit.qty_boxes, visit.queen_status_id, visit.frames_of_bees, visit.frames_of_brood, (visit.has_temper ?1:0), (visit.is_feeding ?1:0), visit.disease_id]).then(function(res) {
          deferred.resolve(visit.id);
        }, function (err) {
            console.error(err);
        });
      }

    });
    return deferred.promise;
  };


  return service;
});
