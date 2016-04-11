// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ameApp')

.controller('ColonyCtrl', function($scope, $location, $stateParams, $cordovaSQLite) {
  // No need for testing data anymore

  //Load current yard into currentYard
  currentYard = [];
  var query = "SELECT * FROM Yards WHERE id = ?";
  $cordovaSQLite.execute(db, query, [$stateParams.yardId]).then(function(res) {
    currentYard = res.rows.item(0);
    $scope.yardName = currentYard.name;
  });

  //Load current colony into currentColony
  currentColony = [];
  var query = "SELECT * FROM Colonies WHERE id = ?";
  $cordovaSQLite.execute(db, query, [$stateParams.colonyId]).then(function(res) {
    currentColony = res.rows.item(0);
    $scope.colonyName = currentColony.name;
  });


  $scope.visits = [
    { date: 'May 9, 2016'},
    { date: 'Apr 31, 2016'},
    { date: 'Apr 22, 2016'},
  ];
  $scope.queens = [
    { name: '16-007', in_colony: "15-021", origin: 'daughter of 15-013'},
    { name: '15-013', in_colony: "15-021", origin: 'daughter of 14-092'},
    { name: '14-092', in_colony: "15-021", origin: 'cut out in Mpls'},
  ];
  $scope.recentVisit = [
    { hive_type: 'Production',
      qty_boxes: '3',
      weight: '123',
      start_queen_status: 'Seen',
      end_queen_status: 'confined',
      frames_of_bees_start: '3',
      frames_of_bees_end: '3',
      frames_of_brood_start: '3',
      frames_of_brood_end: '3',
      bad_temper: 'true',
      disease: 'EFB',
      varroa_per_100: '6',
      feeding: 'false'
    }
  ];


  $scope.createVisit = function() {
    $location.url('/yard/' + currentYard.id + '/colony/' + currentColony.id  + '/visit/new');
  }

  $scope.goToQueen = function(queen) {
    console.log(queen);
    $location.url('/yard/' + currentYard.id + '/colony/' + currentColony.id  + '/queen/2');
  }

  $scope.goToYard = function() {
    console.log("nav to yard");
    $location.url('/yard/' + currentYard.id );
  }

  $scope.goHome = function () {
    $location.url('/')
  }



});
