//created by Joe Meyer on Apr 11, 2016
//This script contains functions relating to visits.

angular.module('ameApp')

.factory('VisitHelper', function($cordovaSQLite) {
  var visit = [];
  var service = {};

  service.getVisitById = function(id) { //returns a visit object when given a valid ID
    var query = "SELECT * FROM Visits WHERE id = " + id;
    $cordovaSQLite.execute(db, query).then(function(res) {
      visit = res.rows.item(0);
      visit.has_temper = Boolean(visit.has_temper)
      visit.is_feeding = Boolean(visit.is_feeding)
    }, function (err) {
        console.error(err);
    });
    return visit;
  }

  service.getVisitsForColony = function(id) { //returns visits for a given colony

      visits = [];
      var query = "SELECT * FROM Visits WHERE colony_id = ?";
      $cordovaSQLite.execute(db, query, [id]).then(function(res) {
        if(res.rows.length > 0) {
          for (i = 0; i < res.rows.length; i++) {
            console.log("SELECTED -> " + res.rows.item(i));
            visits.push(res.rows.item(i));
          }

        } else {
            console.log("No visits found for colony");
        }
      }, function (err) {
          console.error(err);
      });
      return visits;
    };


  service.saveVisit = function (dateTime, yardId, colonyId, queenId, numberBoxes, queenStatusStartId, queenStatusEndId, FObeesStart, FObeesEnd, FObroodStart, FObroodEnd, temper, feeding, deseaseId) {
    var query = "INSERT INTO Visits (date_time, yard_id, colony_id, queen_id, qty_boxes, queen_status_start_id, queen_status_end_id, frames_of_bees_start, frames_of_bees_end, frames_of_brood_start, frames_of_brood_end, has_temper, is_feeding, disease_id) "+
    "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
    $cordovaSQLite.execute(db, query, [dateTime, yardId, colonyId, queenId, numberBoxes, queenStatusStartId, queenStatusEndId, FObeesStart, FObeesEnd, FObroodStart, FObroodEnd, (temper?1:0), (feeding?1:0), deseaseId]).then(function(res) {
        console.log("INSERT VISIT ID -> " + res.insertId);
    }, function (err) {
        console.error(err);
    });
  }

  service.updateVisit = function (visitId, dateTime, queenId, numberBoxes, queenStatusStartId, queenStatusEndId, FObeesStart, FObeesEnd, FObroodStart, FObroodEnd, temper, feeding, diseaseId) {
    var query = "UPDATE Visits SET"+
    " date_time = " +dateTime+
    ", queen_id = " +queenId+
    ", qty_boxes = " +numberBoxes+
    ", queen_status_start_id = " +queenStatusStartId+
    ", queen_status_end_id = " +queenStatusEndId+
    ", frames_of_bees_start = " +FObeesStart+
    ", frames_of_bees_end = " +FObeesEnd+
    ", frames_of_brood_start = " +FObroodStart+
    ", frames_of_brood_end = " +FObroodEnd+
    ", has_temper = " +(temper?1:0)+
    ", is_feeding = " +(feeding?1:0)+
    ", disease_id = " +diseaseId+
    " WHERE id = " + visitId;
    console.log(query);
    $cordovaSQLite.execute(db, query).then(function(res) {
        console.log("Visit ID:" +visitId* " Updated ");
    }, function (err) {
        console.error(err);
    });
  }

  return service;
});
