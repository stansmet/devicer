'use strict';

/* Controllers */


function MyCtrl1() {}
MyCtrl1.$inject = [];


function MyCtrl2() {
}
MyCtrl2.$inject = [];

function DeviceListCtrl($scope)
{
	$scope.locations = [
		{"id":1, "title":"БВИ", "address":"Аврора парк"},
		{"id":2, "title":"МПx", "address":"Молодежная"}
	];
}