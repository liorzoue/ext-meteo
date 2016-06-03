MeteoControllers.controller('defaultCtrl', ['$scope', '$location', 'Meteo', 'meteoStorage', 'myDateTime', function ($scope, $location, Meteo, meteoStorage, myDateTime) {
	_gaq.push(['_trackPageview', '/']);

	$scope.myVilles = meteoStorage.getVilles();
	$scope.Options = meteoStorage.getOptions();
	$scope.myDateTime = myDateTime;
	$scope.getMeteo = function (item) {
		return Meteo.query({villeId: item.id})
	};

	for (var i = $scope.myVilles.length - 1; i >= 0; i--) {
		$scope.myVilles[i].Meteo = $scope.getMeteo($scope.myVilles[i]);
	}

	console.log($scope.myVilles);

	$scope.openUrl = function (newURL) {
		chrome.tabs.create({ url: newURL });
	};
}]);