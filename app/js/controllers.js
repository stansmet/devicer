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
	var self = this;
	var selectedIdx = 0;

	self.toggleActive = function(idx) {
		console.log('toggle');

		if (idx === self.selectedIdx) {
			self.selectedIdx = 0;
		} else {
			self.selectedIdx = idx;
		}
	}

	self.getClass = function(idx) {
		console.log('get class');
		var cls = '';

		if (idx === self.selectedIdx) {
			cls = 'active';
		} 

		return cls;
	}

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