//created by Joe Meyer on Apr 28, 2016
//This script contains functions to store and retrieve dates.

angular.module('ameApp')

.factory('DateHelper', function($q) {
  var date = [];
  var service = {};

  service.dateForSQlite = function(yyyy,mo,dd,hh,mi) { //returns a dateTime in SQlite formate YYYY-MM-DD HH:MM:SS
    var deferred = $q.defer();
    //format numbers less than 10 to add a 0
      if(mi<10) {
        mi='0'+mi}
      if(hh<10) {
        hh='0'+hh}
      if(dd<10) {
        dd='0'+dd}
      if(mo<10) {
        mo='0'+mo}
      currentTime = (yyyy + '-' + mo + '-' + dd + ' ' + hh + ':' + mi + ':00');
    deferred.resolve(currentTime);
    return deferred.promise;
  }

  service.dateFromSQlite = function(storedDate) { //returns a dateTimeObject with yyyy, mo, dd, hh, mi
    var deferred = $q.defer();
    

    //format numbers less than 10 to add a 0
      if(mi<10) {
        mi='0'+mi}
      if(hh<10) {
        hh='0'+hh}
      if(dd<10) {
        dd='0'+dd}
      if(mo<10) {
        mo='0'+mo}
      currentTime = (yyyy + '-' + mo + '-' + dd + ' ' + hh + ':' + mi + ':00');
    deferred.resolve(currentTime);
    return deferred.promise;
  }



return service;
});
