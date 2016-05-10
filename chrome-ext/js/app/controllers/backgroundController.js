MeteoControllers.controller('backgroundCtrl', 
	['$scope', '$interval', 'Meteo', 'Icone', 'meteoStorage', 'myChrome', 'Migration', 
	function ($scope, $interval, Meteo, Icone, meteoStorage, myChrome, Migration) {

		Migration.make();

	function action() {		
		$scope.myVilles = meteoStorage.getVilles();
		$scope.Options = meteoStorage.getOptions();
		$scope.NotificationsList = $scope.Options.notifications.list;
		$scope.getMeteo = function (item) {
			return Meteo.query({villeId: item.id})
		};

		for (var i = $scope.myVilles.length - 1; i >= 0; i--) {
			$scope.myVilles[i].Meteo = $scope.getMeteo($scope.myVilles[i]);
		}
		
		var callbackIcone = function (ville) {
			return function (result) {
				ville.Meteo = result;
				Icone.set(ville.Meteo.lastUpdate, ville.Meteo.dataCadran);
			}
		};

		$scope.myVilles[0].Meteo.$promise.then(callbackIcone($scope.myVilles[0]));


		if (!$scope.Options.notifications.active) return;

		var callbackNotify = function (ville) {
			return function (result) {
				ville.Meteo = result;
				myChrome.notify(ville.nomAffiche, ville.Meteo.niveauPluieText[0], 'img/rain128.png');
			}
		};

		var current = new Date(70, 0, 1, (new Date()).getHours(), (new Date()).getMinutes());

		for (var j = $scope.NotificationsList.length - 1; j >= 0; j--) {

			if($scope.NotificationsList[j].heure.getTime() == current.getTime()) {

				for (var i = $scope.myVilles.length - 1; i >= 0; i--) {
					if ($scope.myVilles[i].notifications) {
						var callback = callbackNotify($scope.myVilles[i]);
						$scope.myVilles[i].Meteo.$promise.then(callback);	
					}				
				}
			}
		}
	};

	action();
	
	$interval(action, 60*1000);
}]);