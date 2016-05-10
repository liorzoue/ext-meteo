MeteoControllers.controller('backgroundCtrl', ['$scope', '$interval', 'Villes', 'Meteo', 'meteoStorage', 'myChrome', function ($scope, $interval, Villes, Meteo, meteoStorage, myChrome) {

	var setIcon = function () {
		if (Status.pluie) { Status.icon = 'rain32'; }
		if (!Status.pluie) { Status.icon = 'sun32'; }
		
		chrome.browserAction.setIcon({ path: 'img/'+Status.icon+'.png' });
	};

	$interval(function () {
		$scope.myVilles = meteoStorage.getVilles();
		$scope.Options = meteoStorage.getOptions();
		$scope.NotificationsList = $scope.Options.notifications.list;
		$scope.getMeteo = function (item) {
			return Meteo.query({villeId: item.id})
		};

		for (var i = $scope.myVilles.length - 1; i >= 0; i--) {
			$scope.myVilles[i].Meteo = $scope.getMeteo($scope.myVilles[i]);
		}

		var current = new Date(70, 0, 1, (new Date()).getHours(), (new Date()).getMinutes());

		if (!$scope.Options.notifications.active) return;

		var callbackCreator = function (ville) {
			return function (result) {
				ville.Meteo = result;
				console.log(ville);
				myChrome.notify(ville.nomAffiche, ville.Meteo.niveauPluieText[0], 'img/rain128.png');
			}
		};

		for (var j = $scope.NotificationsList.length - 1; j >= 0; j--) {

			if($scope.NotificationsList[j].heure.getTime() == current.getTime()) {

				for (var i = $scope.myVilles.length - 1; i >= 0; i--) {
					if ($scope.myVilles[i].notifications) {
						var callback = callbackCreator($scope.myVilles[i]);
						$scope.myVilles[i].Meteo.$promise.then(callback);	
					}				
				}
			}
		}

	}, 60*1000);
}]);