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
  return service;
});
