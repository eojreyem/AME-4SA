// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('ameApp')

.controller('MainCtrl', function($ionicPlatform, $scope, $location, $cordovaSQLite, $ionicPopup, YardHelper, VisitHelper) {

  $scope.newYard = {name:null};

  //loads a list of yards in 4SA
  $ionicPlatform.ready(function() {
    YardHelper.getAllYards().then(function(yards){
      yards.reduce(function(doesntMatter, yard){
        //Does the following for each yard in yards
        YardHelper.getColoniesInYard(yard.id).then(function(Colonies){
          if (Colonies!=null){
            yard.numColoniesInYard = Colonies.length;
          }
        })
        VisitHelper.getLastVisitByYardId(yard.id).then(function(lastVisit){
          yard.lastVisit=lastVisit;
        })
      },0);

      $scope.yards = yards;
    });
  });

  $scope.showCreateYardPopup = function(){
    var createYardPopup = $ionicPopup.show({
      title: 'Create New Yard',
      scope: $scope,
      template: '<label class="item item-input">'+
                '  <input ng-model=newYard.name type="text" placeholder="Dandy Lion Lane">'+
                '</label>',
      buttons: [
        { text: 'Cancel'},
        { text: 'Add Yard',
          type: 'button-positive',
          onTap: function(e) {
            YardHelper.createYard($scope.newYard).then(function(yardId){
              if (yardId!=null){
                $scope.newYard.id = yardId;
                $scope.goToYard($scope.newYard);
              }
          })
          }
        }
      ]

    })
  }

  $scope.goToYard = function (yard){
    $location.url('/yard/' + yard.id);
  }

  $scope.dropColonies = function (){
    $cordovaSQLite.execute(db, "DROP TABLE Colonies"); //Use to remove a table
  }
  $scope.dropQueens = function (){
    $cordovaSQLite.execute(db, "DROP TABLE Queens"); //Use to remove a table
  }
  $scope.dropVisits = function (){
    $cordovaSQLite.execute(db, "DROP TABLE Visits"); //Use to remove a table
  }


});
