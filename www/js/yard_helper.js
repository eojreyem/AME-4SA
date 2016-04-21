//created by Joe Meyer on Apr 11, 2016
//This script contains functions relating to colonies.

angular.module('ameApp')

.factory('YardHelper', function($cordovaSQLite) {
  var yard = [];
  var service = {};

  service.getYardById = function(id) { //returns a yard object when given a valid ID

    var query = "SELECT * FROM Yards WHERE id = " + id;
    $cordovaSQLite.execute(db, query).then(function(res) {
      yard = res.rows.item(0);
      console.log("Selected yard");
    });

    return yard;
  }

  service.getAllYards = function() { //returns all yards
    yards =[];
    var query = "SELECT * FROM Yards";
    $cordovaSQLite.execute(db, query).then(function(res) {
        if(res.rows.length > 0) {
          for (i = 0; i < res.rows.length; i++) {
            console.log("SELECTED -> " + res.rows.item(i));
            yards.push(res.rows.item(i));
          }

        } else {
            console.log("No results found");
        }
    }, function (err) {
        console.error(err);
    });
    return yards;

  }

  service.saveYard = function(name) { //save new yard to the database
    /* TODO: test for yard name duplicates
    yards = [];
    yards = service.getAllYards();
    for (i=0; i < yards.length; i++){
      console.log("COUNT:" + i);
    }
    */
    var query = "INSERT INTO Yards (name) VALUES (?)";
    $cordovaSQLite.execute(db, query, [name]).then(function(res) {
      console.log("INSERT ID -> " + res.insertId);
    }, function (err) {
      console.error(err);
    });

  }

  service.getColoniesInYard = function(yardId) { //return all colonies in a yardId
    colonies = [];
    var query = "SELECT * FROM Colonies WHERE in_yard_id = ?";
    $cordovaSQLite.execute(db, query, [yardId]).then(function(res) {
      if(res.rows.length > 0) {
        for (i = 0; i < res.rows.length; i++) {
          console.log("SELECTED -> " + res.rows.item(i));
          colonies.push(res.rows.item(i));
        }

      } else {
          console.log("No colonies found in this yard");
      }
    }, function (err) {
        console.error(err);
    });
    return colonies;

  }

  return service;
});
