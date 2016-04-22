//created by Joe Meyer on Apr 11, 2016
//This script contains functions relating to queens.

angular.module('ameApp')

.factory('QueenHelper', function($cordovaSQLite) {
  var queen = [];
  var service = {};

  service.getQueenById = function(id) { //returns a queen object when given a valid ID
    var query = "SELECT * FROM Queens WHERE id = " + id;
    $cordovaSQLite.execute(db, query).then(function(res) {
      queen = res.rows.item(0);
    }, function (err) {
        console.error(err);
    });
    return queen;
  }

  service.saveQueen = function (name, colonyId, motherId, origin, dateEmerged, hexColor) {
    var query = "INSERT INTO Queens (name, in_colony_id, mother_queen_id, origin, date_emerged, mark_color_hex) VALUES (?,?,?,?,?,?)";
    $cordovaSQLite.execute(db, query, [name, colonyId, motherId, origin, dateEmerged, hexColor]).then(function(res) {
        console.log("INSERT QUEEN ID -> " + res.insertId);
    }, function (err) {
        console.error(err);
    });
  }

  service.updateQueenColony = function (queenId, colonyId) {
    var query = "UPDATE Queens SET in_colony_id = ? WHERE id = ?";
    $cordovaSQLite.execute(db, query, [colonyId, queenId]).then(function(res) {
      console.log("Moved Queen");
    }, function (err) {
        console.error(err);
    });
  }


  service.getQueensInColony = function(colonyId) { //return all queens in a colonyId
    queens = [];
    var query = "SELECT * FROM Queens WHERE in_colony_id = ?";
    $cordovaSQLite.execute(db, query, [colonyId]).then(function(res) {
      if(res.rows.length > 0) {
        for (i = 0; i < res.rows.length; i++) {
          console.log("SELECTED -> " + res.rows.item(i));
          queens.push(res.rows.item(i));
        }

      } else {
          console.log("No queens found in this colony");
      }
    }, function (err) {
        console.error(err);
    });
    return queens;

  }


  return service;
});
