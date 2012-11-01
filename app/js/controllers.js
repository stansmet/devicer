'use strict';

var locations = [
	{"id":1, "title":"БВИ", "address":"Аврора парк", "devices":[
		{ "id":1, "title":"роутер", "num":"123123d" }
	]},
	{"id":2, "title":"МПx", "address":"Молодежная", "devices":[
		{ "id":2, "title":"монитор", "num":"123556e" },
		{ "id":3, "title":"системник", "num":"123123f" }
	]}
];

/* Controllers */
function LocationsListCtrl($scope)
{
	$scope.locations = locations;
}

function DevicesListCtrl($scope, $routeParams)
{  
	for (var idx in locations) {
		var location = locations[idx];

		if (location.id == $routeParams.locationId) {
			$scope.devices = location.devices;
		}
	}
}