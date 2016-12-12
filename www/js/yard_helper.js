//created by Joe Meyer on Apr 11, 2016
//This script contains functions relating to colonies.

angular.module('ameApp')

.factory('YardHelper', function($cordovaSQLite, $q) {
  var yard = [];
  var service = {};

  service.getYardById = function(id) { //returns a yard object when given a valid ID
    var deferred = $q.defer();
    var query = "SELECT * FROM Yards WHERE id = " + id;
    $cordovaSQLite.execute(db, query).then(function(res) {
      yard = res.rows.item(0);
      deferred.resolve(yard);
      console.log("Selected yard");
    });

    return deferred.promise;
  }

  service.getAllYards = function() { //returns all yards
    yards =[];
    var deferred = $q.defer();
    var query = "SELECT * FROM Yards";
    $cordovaSQLite.execute(db, query).then(function(res) {
      if(res.rows.length > 0) {
        for (i = 0; i < res.rows.length; i++) {
          yards.push(res.rows.item(i));
        }
      deferred.resolve(yards);
      }
    });
    return deferred.promise;
  }

  service.saveYard = function(yard) { //save new yard to the database
    if (yard.name !=null){
      var query = "INSERT INTO Yards (name) VALUES (?)";
      $cordovaSQLite.execute(db, query, [yard.name]).then(function(res) {
        console.log("INSERT ID -> " + res.insertId);
      }, function (err) {
        console.error(err);
      })
    }
    else{
      console.log("Yard needs a name!"); //Toast?
    }
  }

  service.deleteYard = function(yard) { //deletes yard if null
    service.getColoniesInYard(yard.id).then(function (colonies){
      //TODO: remove empty yard check once that is done before calling function.
      if (colonies == null){
        var query = "DELETE FROM Yards WHERE id = ?";
        $cordovaSQLite.execute(db, query, [yard.id]).then(function(res) {
          console.log("DELETED YARD");
        }, function (err) {
          console.error(err);
        })
      }
      else {
        console.log("Yard must contain no colonies to delete");
      }
    });
  }

  service.getColoniesAndRecentVisitForYard = function(yardId) {
    var deferred = $q.defer();
    coloniesAndVisit = [];
    var query = "SELECT * FROM "+
    "(SELECT * FROM Colonies LEFT JOIN Visits ON Visits.colony_id = Colonies.id WHERE Colonies.in_yard_id = ? ORDER BY Visits.date_time ASC)"+
    " GROUP BY colony_id ORDER BY date_time ASC "
    console.log(query);
    $cordovaSQLite.execute(db, query, [yardId]).then(function(res) {

      if(res.rows.length > 0) {
        for (i = 0; i < res.rows.length; i++) {
          coloniesAndVisit.push(res.rows.item(i));
        }

        deferred.resolve(coloniesAndVisit);
      }else{
        deferred.resolve(null);
      }
      console.log(res);
    }, function (err) {
      console.error(err);
    });
    return deferred.promise;
  }


  service.getColoniesInYard = function(yardId) { //return all active colonies in a yardId
    var deferred = $q.defer();
    colonies = [];
    var query = "SELECT * FROM Colonies WHERE in_yard_id = ? AND date_inactive IS NULL";
    $cordovaSQLite.execute(db, query, [yardId]).then(function(res) {
      if(res.rows.length > 0) {
        for (i = 0; i < res.rows.length; i++) {
          colonies.push(res.rows.item(i));
        }
        deferred.resolve(colonies);
      }else{
        deferred.resolve(null);
      }
    });
    return deferred.promise;
  }

  return service;
});
