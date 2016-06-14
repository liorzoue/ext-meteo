MeteoControllers.controller('defaultCtrl', ['$scope', '$location', '$filter', 'Meteo', 'meteoStorage', 'myDateTime', function ($scope, $location, $filter, Meteo, meteoStorage, myDateTime) {
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

	$scope.indispoCount = function () {
		var _filtered = $filter('filter')(
			$scope.myVilles, 
			function(value, index, array) {
				if (!value.Meteo.$resolved) return false;
				
				var i = 0;
				var out = false;
				while(i<11 && !out)
				{
					if (value.Meteo.dataCadran[i].niveauPluie == 0) out = true;
					i++;
				}

				if (i!=11) return true;
				return false;
			});

		if (_filtered.length) return true;

		return false;
	}
}]);