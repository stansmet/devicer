'use strict';

var locations = [
	{"id":1, "title":"БВИ", "address":"Аврора парк", "devices":[
		{ "id":1, "title":"роутер", "num":"123123d" }
	]},
	{"id":2, "title":"МПx", "address":"Молодежная", "devices":[
		{ "id":2, "title":"монитор", "num":"123556e" },
		{ "id":3, "title":"системник", "num":"123123f" },
		{ "id":2, "title":"монитор", "num":"123556e" },
		{ "id":2, "title":"монитор", "num":"123556e" },
		{ "id":2, "title":"монитор", "num":"123556e" },
		{ "id":2, "title":"монитор", "num":"123556e" },
		{ "id":2, "title":"монитор", "num":"123556e" },
		{ "id":2, "title":"монитор", "num":"123556e" },
		{ "id":2, "title":"монитор", "num":"123556e" },
		{ "id":2, "title":"монитор", "num":"123556e" },
		{ "id":2, "title":"монитор", "num":"123556e" },
		{ "id":2, "title":"монитор", "num":"123556e" },
		{ "id":2, "title":"монитор", "num":"123556e" },
		{ "id":2, "title":"монитор", "num":"123556e" },
		{ "id":2, "title":"монитор", "num":"123556e" },
		{ "id":2, "title":"монитор", "num":"123556e" },
		{ "id":2, "title":"монитор", "num":"123556e" },
		{ "id":2, "title":"монитор", "num":"123556e" },
		{ "id":2, "title":"монитор", "num":"123556e" },
		{ "id":2, "title":"монитор", "num":"123556e" },
		{ "id":2, "title":"монитор", "num":"123556e" },
		{ "id":2, "title":"монитор", "num":"123556e" }
	]}
];

/* Controllers */
function LocationsListCtrl($scope)
{
	$scope.selectedIdx = 0;

	$scope.toggleActive = function(idx) {
		if (idx === $scope.selectedIdx) {
			$scope.selectedIdx = 0;
		} else {
			$scope.selectedIdx = idx;
		}
	}

	$scope.getClass = function(idx) {
		var cls = '';
		if (idx === $scope.selectedIdx) {
			cls = 'active';
		} 

		return cls;
	}

	$scope.locations = locations;
	$scope.devices = locations[0].devices;
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