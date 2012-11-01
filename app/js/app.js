'use strict';

angular.module('App', []).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      //when('/', {controller: LocationsListCtrl}).
      when('/devices/:locationId', {templateUrl: 'partials/devicesList.html', controller: DevicesListCtrl})
      //otherwise({redirectTo: '/'});
}]);

// Declare app level module which depends on filters, and services
/*
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {controller: DeviceListCtrl});
    //$routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: MyCtrl2});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);
  */