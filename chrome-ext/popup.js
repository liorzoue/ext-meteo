var MeteoApp = angular.module('MeteoApp', []);

MeteoApp.controller('MeteoCtrl', function ($scope, $http) {

	$scope.setParameters = function (id, libelle) {
		if (!id || !libelle) { return; }
		
		try {
			chrome.storage.sync.set({
				'villeID': id,
				'villeLibelle': libelle, 
				'used': true
			}, function() { });
		} catch (err) {
			$scope.error = { hasError: true, message: 'Chrome storage write error.' };
			$scope.$apply();
			console.log(err);
		}
	};
	
	$scope.run = function () {
		try {
			chrome.extension.getBackgroundPage().get_data(function (data) {
				$scope.results = [];
				$scope.query = '';
				$scope.villeLibelle = data.villeLibelle;
				$scope.showParam = data.showParam;
				$scope.error = data.error;
				$scope.prochainePrecipitation = data.prochainePrecipitation;
				
				if (data.response) {
					$scope.datas = data.response.dataCadran;
					$scope.resume = data.response.niveauPluieText;
					$scope.niveauPluieText = data.response.niveauPluieText;
					$scope.lastUpdate = data.response.lastUpdate;
				}
				
				$scope.$apply();
			});
		} catch (err) {
			$scope.error = { hasError: true, message: 'run error' };
			$scope.$apply();
			console.log(err);
		}
	};
	
	$scope.findTown = function (query) {
		console.log('query: ' + query);
		$scope.results = [];
		if (query.length == 0) { return; }
		
		try {
			$http.get(chrome.extension.getBackgroundPage().APIPluieFind + query).success(function(data) {
				if (data.length == 0) { return; }
				$scope.results = data;
				console.log($scope.results.length);
			});
		} catch (err) {
			$scope.error = { hasError: true, message: 'Search error.' };
			$scope.$apply();
			console.log(err);
		}
	};

	$scope.selectTown = function (id, libelle) {
		$scope.setParameters(id, libelle);
		
		$scope.villeLibelle = libelle;
		$scope.showParam = false;
		$scope.results = [];
		
		$scope.run();
	};
	
	$scope.toggleParam = function () {
		$scope.showParam=!$scope.showParam;
	};

	$scope.openGitHub = function () {
		var newURL = "http://github.com/liorzoue/ext-meteo";
		chrome.tabs.create({ url: newURL });
	};
	
	$scope.manifest = chrome.runtime.getManifest();
	
	$scope.$apply();
	$scope.run();
	
});
