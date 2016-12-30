//created by Joe Meyer on Apr 11, 2016
//This script contains functions relating to visits.

angular.module('ameApp')

.factory('VisitNotesHelper', function($cordovaSQLite, $q) {
  var visit_note = [];
  var service = {};

  service.getRemindersByColonyId = function(colonyId){ //returns all visit notes with reminders for a given colony via colony ID
    notesWithReminders = [];
    var deferred = $q.defer();

    var query = "SELECT * FROM Visit_Notes JOIN Visits ON Visits.id = Visit_Notes.visit_id WHERE Visits.colony_id = ? AND Visit_Notes.is_reminder = 1"

    $cordovaSQLite.execute(db, query, [colonyId]).then(function(res) {
      if(res.rows.length > 0) {
        for (i = 0; i < res.rows.length; i++) {
          console.log("SELECTED -> " + res.rows.item(i));
          notesWithReminders.push(res.rows.item(i));
        }
        deferred.resolve(notesWithReminders);

      } else {
          console.log("No reminders found for colony");
      }
    }, function (err) {
        console.error(err);
    });
    return deferred.promise;
  };

  service.getNotesForVisitById = function(visitId){ //returns all visit notes for a visit via ID
    notes = [];
    var deferred = $q.defer();

    var query = "SELECT * FROM Visit_Notes WHERE visit_id = ?"

    $cordovaSQLite.execute(db, query, [visitId]).then(function(res) {
      if(res.rows.length > 0) {
        for (i = 0; i < res.rows.length; i++) {
          console.log("SELECTED -> " + res.rows.item(i));
          notes.push(res.rows.item(i));
        }
        deferred.resolve(notes);

      } else {
          console.log("No notes for visit #" + visitId);
      }
    }, function (err) {
        console.error(err);
    });
    return deferred.promise;
  };


  service.saveNote = function(note) {
    var query = "INSERT INTO Visit_Notes (visit_id, note, is_reminder) VALUES (?,?,?)";
    $cordovaSQLite.execute(db, query, [note.visit_id, note.note, (note.is_reminder ?1:0)]).then(function(res){
      console.log(res.insertId);
    });
  }

  service.dismissReminder = function(note) {
    var query = "UPDATE Visit_Notes SET is_reminder = 0 WHERE visit_id = ? AND note = ?";
    $cordovaSQLite.execute(db, query, [note.visit_id, note.note]).then(function(res){
      console.log("note dismissed");
    });
  }




  return service;
});
