// Ionic Starter App
var db = null;
var currentYards = [];

// angular.module is a global place for creating, registering and retrieving Angular modules
angular
.module('ameApp', [
  'ionic',
  'ngCordova'
])

.run(function($ionicPlatform, $cordovaSQLite){
  $ionicPlatform.ready(function() {
    if (window.cordova) {
      db = $cordovaSQLite.openDB({ name: "AME_4SA.db" }); //device
    }else{
      db = window.openDatabase("AME_4SA.db", '1', 'my', 1024 * 1024 * 100); // browser
    }
    //$cordovaSQLite.execute(db, "DROP TABLE Yards"); //Use to remove a table
    //complete tables
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Yards (id INTEGER PRIMARY KEY, name TEXT)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Visit_Notes (id INTEGER PRIMARY KEY, visit_id INTEGER, note TEXT, is_reminder INTEGER)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Visit_Data (id INTEGER PRIMARY KEY, visit_id INTEGER, data_type_id INTEGER, data_value INTEGER)");

    //tables need work
    //TODO: (date_entered, date_active, date_inactive, reason_inactive_id)
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Colonies (id INTEGER PRIMARY KEY, name TEXT, in_yard_id INTEGER, origin TEXT)");
    //TODO: (date_entered, date_emerged, date_inactive, reason_inactive_id)
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Queens (id INTEGER PRIMARY KEY, name TEXT, in_colony_id INTEGER, mother_queen_id INTEGER, origin TEXT, date_entered DATETIME DEFAULT CURRENT_TIMESTAMP, mark_color_hex INTEGER)");
    //TODO: (lots)
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Visits (id INTEGER PRIMARY KEY, )");




  });
})

.config(function ($stateProvider, $urlRouterProvider, $sceDelegateProvider) {


  $stateProvider

  .state('index', {
    url: '/',
    templateUrl: 'views/main.html',
    controller: 'MainCtrl'
  })
  .state('yard', {
    url: '/yard/{yardId}',
    templateUrl: 'views/yard.html',
    controller: 'YardCtrl'
  })
  .state('colony', {
    url: '/yard/{yardId}/colony/{colonyId}',
    templateUrl: 'views/colony.html',
    controller: 'ColonyCtrl'
  })
  .state('queen', {
    url: '/yard/{yardId}/colony/{colonyId}/queen/{queenId}',
    templateUrl: 'views/queen.html',
    controller: 'QueenCtrl'
  })
  .state('visit', {
    url: '/yard/{yardId}/colony/{colonyId}/visit/{visitId}',
    templateUrl: 'views/visit.html',
    controller: 'VisitCtrl'
  })
  $urlRouterProvider.otherwise('/');
});
