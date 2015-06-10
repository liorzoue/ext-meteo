var MeteoApp = angular.module('MeteoApp', []);

MeteoApp.controller('MeteoCtrl', ['$scope','$http', function ($scope, $http) {
	$scope.BackgroundPage = chrome.extension.getBackgroundPage();	
	$scope.Storage = $scope.BackgroundPage.Storage;
	$scope.PluieData = $scope.BackgroundPage.PluieData;
	$scope.Status = $scope.BackgroundPage.Status;
	
	$scope.Manifest = chrome.runtime.getManifest();
	$scope.Math = window.Math;
	$scope.Active = 'default';
	$scope.VilleResults = [];
	$scope.query = '';

	if ($scope.BackgroundPage.Storage.villeID == 0) {
		$scope.Active = 'param';
	} else {
		$scope.BackgroundPage.getData();
	}
		
	$scope.toggleParam = function () {
		$scope.BackgroundPage.setStorage();
		
		if ($scope.Active == 'default') { $scope.Active = 'param'; return true; }
		if ($scope.Active == 'param') { $scope.Active = 'default'; return true; }
	};
	
	$scope.findTown = function (query) {
		$scope.VilleResults = [];
		if (query.length == 0) { return; }
		
		$http.get($scope.BackgroundPage.MeteoAPI.getFind() + query).success(function(data) {
			if (data.length == 0) { return; }
			$scope.VilleResults = data;
		});
	};

	$scope.selectTown = function (id, libelle) {
		$scope.BackgroundPage.Storage.villeID = id;
		$scope.BackgroundPage.Storage.villeText = libelle;
		$scope.BackgroundPage.setStorage();
		
		$scope.VilleResults = [];
		$scope.query = '';
	};
	
	$scope.openURL = function (url) {
		chrome.tabs.create({ url: url });
	};
	
	
	$scope.$apply();
}]);
