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
    var yards =[];
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

  service.createYard = function(yard) { //adds a new yard to the database
    //TODO deferred promise return insert Id
    var deferred = $q.defer();
    if (yard.name !=null){
      var query = "INSERT INTO Yards (name) VALUES (?)";
      $cordovaSQLite.execute(db, query, [yard.name]).then(function(res) {
        console.log("INSERT ID -> " + res.insertId);
        deferred.resolve(res.insertId);
      }, function (err) {
        console.error(err);
        deferred.resolve(null);
      })
    }
    else{
      console.log("Yard needs a name!"); //Toast?
      deferred.resolve(null);
    }
    return deferred.promise;
  }

  service.deleteYard = function(yard) { //deletes yard if no colonies in it.
    var deferred = $q.defer();
    service.getColoniesInYard(yard.id).then(function (colonies){
      //TODO ask Eryn
      //this check is redundant since button doesn't appear unless no colonies are in yard.
      if (colonies == null){
        var query = "DELETE FROM Yards WHERE id = ?";
        $cordovaSQLite.execute(db, query, [yard.id]).then(function(res) {
          deferred.resolve(1)
        }, function (err) {
          console.error(err);
        })
      }
      else {
        console.log("Yard must contain no colonies to delete");
      }
    });
    return deferred.promise;
  }

  service.getColoniesInYard = function(yardId) { //return all active colonies in a yardId
    var deferred = $q.defer();
    var colonies = [];
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
