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

	if ($scope.BackgroundPage.Storage.villes.length == 0) {
		$scope.Active = 'param';
	} else {
		$scope.BackgroundPage.getData();
	}

	$scope.toggle = function(what) {
		if (what == 'details') { $scope.Storage.pDetails = !$scope.Storage.pDetails; };
		if (what == 'graph') { $scope.Storage.pGraph = !$scope.Storage.pGraph; };
		if (what == 'notifs') { $scope.Storage.pNotifications = !$scope.Storage.pNotifications; };
	};
		
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
	
		$scope.BackgroundPage.Storage.villes.push({name: libelle, id: id});
		$scope.BackgroundPage.setStorage();
		
		$scope.VilleResults = [];
		$scope.query = '';
	};
	
	$scope.openURL = function (url) {
		chrome.tabs.create({ url: url });
	};
	
	$scope.removeVille = function(item) { 
		var index = $scope.Storage.villes.indexOf(item);
		$scope.Storage.villes.splice(index, 1);     
		
		$scope.BackgroundPage.setStorage();
	}
	
	
	$scope.$apply();
}]);
