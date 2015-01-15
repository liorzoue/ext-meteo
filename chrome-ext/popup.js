var MeteoApp = angular.module('MeteoApp', []);

MeteoApp.controller('MeteoCtrl', function ($scope, $http) {
	var villeID = '352380',
		APIUrl = 'http://www.meteofrance.com/mf3-rpc-portlet/rest/pluie/';
		
	$http.get(APIUrl + villeID).success(function(data) {

		$scope.datas = data.dataCadran;
		$scope.resume = data.niveauPluieText;
		$scope.niveauPluieText = data.niveauPluieText;
		$scope.lastUpdate = data.lastUpdate;
		
		$scope.prochainePrecipitation = [];
		
		var badge = ":)";
		var color = "5F5";
		
		for(i=0;i<12;i++) {
			if ($scope.datas[i].niveauPluie > 1) {
				$scope.prochainePrecipitation = $scope.datas[i];
				$scope.prochainePrecipitation.time = i*5+10;
				badge = $scope.prochainePrecipitation.time + "m";
				color = $scope.prochainePrecipitation.color;
				break;
			}
		}
		
		chrome.browserAction.setBadgeText({text: badge });
		chrome.browserAction.setBadgeBackgroundColor({ color: '#'+color });
				
	});

});

/*
	Recherche d'une ville
	http://www.meteofrance.com/mf3-rpc-portlet/rest/lieu/facet/previsions_metropole/search/xxx
	
	Recherche d'une ville
	! Résultat couverts par "Pluie dans l'heure" uniquement
	http://www.meteofrance.com/mf3-rpc-portlet/rest/lieu/facet/pluie/search/xxx
	
	Pluie dans l'heure
	http://www.meteofrance.com/mf3-rpc-portlet/rest/pluie/IDVILLE
*/
