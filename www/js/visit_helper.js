//created by Joe Meyer on Apr 11, 2016
//This script contains functions relating to visits.

angular.module('ameApp')

.factory('VisitHelper', function($cordovaSQLite) {
  var visit = [];
  var service = {};

  service.getVisitById = function(id) { //returns a visit object when given a valid ID
    return queen;
  }

  service.saveVisit = function (dateTime, yardId, colonyId, queenId, numberBoxes, queenStatusStartId, queenStatusEndId, FObeesStart, FObeesEnd, FObroodStart, FObroodEnd, temper, feeding, deseaseId) {
    var query = "INSERT INTO Visits (date_time, yard_id, colony_id, queen_id, qty_boxes, queen_status_start_id, queen_status_end_id, frames_of_bees_start, frames_of_bees_end, frames_of_brood_start, frames_of_brood_end, has_temper, is_feeding, disease_id) "+
    "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
    $cordovaSQLite.execute(db, query, [dateTime, yardId, colonyId, queenId, numberBoxes, queenStatusStartId, queenStatusEndId, FObeesStart, FObeesEnd, FObroodStart, FObroodEnd, temper, feeding, deseaseId]).then(function(res) {
        console.log("INSERT VISIT ID -> " + res.insertId);
    }, function (err) {
        console.error(err);
    });
  }

  return service;
});
