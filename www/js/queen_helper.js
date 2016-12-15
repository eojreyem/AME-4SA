//created by Joe Meyer on Apr 11, 2016
//This script contains functions relating to queens.

angular.module('ameApp')

.factory('QueenHelper', function($cordovaSQLite, $q) {
  var queen = [];
  var service = {};

  service.getQueenById = function(id) { //returns a queen object when given a valid ID
    var deferred = $q.defer();
    var query = "SELECT * FROM Queens WHERE id = ?";
    $cordovaSQLite.execute(db, query, [id]).then(function(res) {
      if (res.rows.length == 0){
        deferred.resolve(null);
        console.log("Failed to retreive queen with id: "+ id);
        console.log(res);
      }
      else {
        queen = res.rows.item(0);
        deferred.resolve(queen);
      }
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

  service.saveQueen = function (queen) {
    var deferred = $q.defer();
    // TODO: test for queen name duplicates
    console.log(queen.id);
    service.getQueenById(queen.id).then(function(existingQueen){
      if (existingQueen == null){
        var query = "INSERT INTO Queens (name, in_colony_id, mother_queen_id, origin, date_emerged, mark_color_hex) VALUES (?,?,?,?,?,?)";
        $cordovaSQLite.execute(db, query, [queen.name, queen.in_colony_id, queen.mother_queen_id, queen.origin, queen.date_emerged, queen.mark_color_hex]).then(function(res) {
            console.log("INSERT QUEEN ID -> " + res.insertId);
            deferred.resolve(res.insertId);
        }, function (err) {
            console.error(err);
        });
      }
      else{
        var query = "UPDATE Queens SET name = ?, in_colony_id = ?, mother_queen_id = ?, origin = ?, date_emerged = ?, mark_color_hex = ? WHERE id = " + queen.id;
        $cordovaSQLite.execute(db, query, [queen.name, queen.in_colony_id, queen.mother_queen_id, queen.origin, queen.date_emerged, queen.mark_color_hex]).then(function(res) {
          deferred.resolve(null);
        }, function (err) {
            console.error(err);
        });
      }

    });
    return deferred.promise;
  };

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
