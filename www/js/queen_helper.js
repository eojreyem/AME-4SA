//created by Joe Meyer on Apr 11, 2016
//This script contains functions relating to queens.

angular.module('ameApp')

.factory('QueenHelper', function($cordovaSQLite, $q) {
  var queen = [];
  var service = {};

  service.getQueenById = function(id) { //returns a queen object when given a valid ID
    var deferred = $q.defer();
    var query = "SELECT * FROM Queens WHERE id = " + id;
    $cordovaSQLite.execute(db, query).then(function(res) {
      queen = res.rows.item(0);
      deferred.resolve(queen);
    }, function (err) {
        console.error(err);
    });
    return deferred.promise;
  }

  service.getQueenInactiveReasons = function() { //returns reasons a queen might be inactive
    var deferred = $q.defer();
    reasons = [];
    var query = "SELECT * FROM Queen_Inactive_Reasons";
    $cordovaSQLite.execute(db, query).then(function(res) {
      if(res.rows.length > 0) {
        for (i = 0; i < res.rows.length; i++) {
          reasons.push(res.rows.item(i));
        }
        deferred.resolve(reasons);
      } else {
          console.log("No Q Inactive Reasons found!");
      }
    });
    return deferred.promise;
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

  service.updateQueenInactive = function (queenId, reasonId) {
    var date = new Date();
    var query = "UPDATE Queens SET date_inactive = ?, reason_inactive_id = ? WHERE id = ?";
    $cordovaSQLite.execute(db, query, [date, reasonId, queenId]).then(function(res) {
      console.log("Queen Inactive");
    }, function (err) {
        console.error(err);
    });
  }


  service.getQueensInColony = function(colonyId) { //return all queens in a colonyId
    var deferred = $q.defer();
    queens = [];
    var query = "SELECT * FROM Queens WHERE in_colony_id = ?";
    $cordovaSQLite.execute(db, query, [colonyId]).then(function(res) {
      if(res.rows.length > 0) {
        for (i = 0; i < res.rows.length; i++) {
          console.log("SELECTED -> " + res.rows.item(i));
          queens.push(res.rows.item(i));
        }
        deferred.resolve(queens);

      }else {
          console.log("No queens found in this colony");
          deferred.resolve(null);
      }
    }, function (err) {
        console.error(err);
    });
    return deferred.promise;

  }


  return service;
});
