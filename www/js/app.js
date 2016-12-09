// Ionic Starter App
var db;

// angular.module is a global place for creating, registering and retrieving Angular modules
angular
.module('ameApp', [
  'ionic',
  'ngCordova',
  'ionic-datepicker'
])

.run(function($ionicPlatform, $cordovaSQLite){
  console.log('not ready')
  $ionicPlatform.ready(function() {
    if (window.cordova) {
      db = $cordovaSQLite.openDB({name: 'AME_4SA.db', location: 'default'}); //device
    }else{
      db = window.openDatabase("AME_4SA.db", '1', 'my', 1024 * 1024 * 100); // browser
    }

    console.log(db.toString( ));
    //TODO: remove these drop statements and do an Insert if not exist.
    $cordovaSQLite.execute(db, "DROP TABLE Queen_Statuses");
    $cordovaSQLite.execute(db, "DROP TABLE Hive_Types");
    $cordovaSQLite.execute(db, "DROP TABLE Queen_Inactive_Reasons");
    $cordovaSQLite.execute(db, "DROP TABLE Colony_Inactive_Reasons");
    $cordovaSQLite.execute(db, "DROP TABLE Diseases");
    $cordovaSQLite.execute(db, "DROP TABLE Data_Types");


    //Tables of data
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Yards (id INTEGER PRIMARY KEY, name TEXT)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Visit_Notes (id INTEGER PRIMARY KEY, visit_id INTEGER, note TEXT, is_reminder INTEGER)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Visit_Data (id INTEGER PRIMARY KEY, visit_id INTEGER, data_type_id INTEGER, data_value INTEGER)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Colonies (id INTEGER PRIMARY KEY, date_entered DATETIME DEFAULT CURRENT_TIMESTAMP, in_yard_id INTEGER, number INTEGER, date_active TEXT, origin TEXT, date_inactive TEXT, reason_inactive_id INTEGER)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Queens (id INTEGER PRIMARY KEY, name TEXT, in_colony_id INTEGER, mother_queen_id INTEGER, origin TEXT, date_entered DATETIME DEFAULT CURRENT_TIMESTAMP, date_emerged TEXT, date_inactive TEXT, reason_inactive_id, mark_color_hex INTEGER)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Visits (id INTEGER PRIMARY KEY, date_entered DATETIME DEFAULT CURRENT_TIMESTAMP, date_time TEXT, yard_id INTEGER, colony_id INTEGER, queen_id INTEGER, qty_boxes INTEGER, queen_status_id INTEGER, frames_of_bees INTEGER, frames_of_brood INTEGER, has_temper INTEGER, is_feeding INTEGER, disease_id INTEGER)");

    //Tables of Keys
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Queen_Statuses (id INTEGER PRIMARY KEY, status TEXT)");
    $cordovaSQLite.execute(db, "INSERT INTO Queen_Statuses (status) VALUES ('Not Seen'), ('Seen'), ('Not Found'), ('Confined'), ('Cell'), ('Queenless'), ('Virgin'), ('Other')");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Hive_Types (id INTEGER PRIMARY KEY, type TEXT)");
    $cordovaSQLite.execute(db, "INSERT INTO Hive_Types (type) VALUES ('10 Frame'), ('5 Frame'), ('Mating Nuc'), ('Other')");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Queen_Inactive_Reasons (id INTEGER PRIMARY KEY, reason TEXT)");
    $cordovaSQLite.execute(db, "INSERT INTO Queen_Inactive_Reasons (reason) VALUES ('Superceded'), ('Poor Performance'), ('Drone Layer'), ('Inujured'), ('Accident'), ('Swarmed'), ('Unknown'), ('Not Accepted'), ('Sold'), ('Other')");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Diseases (id INTEGER PRIMARY KEY, disease TEXT)");
    $cordovaSQLite.execute(db, "INSERT INTO Diseases (disease) VALUES ('AFB'), ('EFB'), ('Chalkbrood'), ('Hive Beetles'), ('DWV'), ('PMS'), ('The Crud'), ('Wax Moths'), ('Sacbrood'), ('Mold'), ('Dysentry'), ('Other')");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Colony_Inactive_Reasons (id INTEGER PRIMARY KEY, reason TEXT)");
    $cordovaSQLite.execute(db, "INSERT INTO Colony_Inactive_Reasons (reason) VALUES ('Colapsed'), ('Disease'), ('Starvation'), ('Robbed'), ('Sold'), ('Combined'), ('Small Cluster'), ('Other')");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Data_Types (id INTEGER PRIMARY KEY, type TEXT)");
    $cordovaSQLite.execute(db, "INSERT INTO Data_Types (type) VALUES ('Weight (lbs)'), ('Varroa/300'), ('Hygienic Empty'), ('Hygienic Unclean'), ('Harvest (lbs)')");
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
