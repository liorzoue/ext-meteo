MeteoControllers.controller('settingsCtrl', ['$scope', '$location', 'Villes', 'meteoStorage', 'Manifest', function ($scope, $location, Villes, meteoStorage, Manifest) {
	// init
	$scope.villesResult = [];
	$scope.myVilles = meteoStorage.getVilles();
	$scope.Options = meteoStorage.getOptions();
	$scope.Manifest = Manifest.get();

	$scope.findVilles = function (searchItem) {
		if (searchItem.length < 3) {
			$scope.villesResult = [];
			return false; 
		}

		$scope.villesResult = Villes.query({villeName: searchItem});
	}

	$scope.registerVille = function (item) {
		item.notifications = true;

		$scope.myVilles = meteoStorage.addVille(item);
		$scope.ville = '';
		$scope.villesResult = [];
	}

	$scope.unregisterVille = function (item) {
		$scope.myVilles = meteoStorage.removeVille($scope.myVilles, item);
	}

	$scope.toggle = function (item) {
		$scope.Options[item].active = !$scope.Options[item].active;
		meteoStorage.saveOptions($scope.Options);
	}

	$scope.saveNotifications = function () {
		meteoStorage.saveOptions($scope.Options);
	};

	$scope.removeNotification = function (item) {
		$scope.Options.notifications.list.splice($scope.Options.notifications.list.indexOf(item),1);
		meteoStorage.saveOptions($scope.Options);
	}

	$scope.toggleNotifications = function (item) {
		item.notifications = !item.notifications;
		$scope.myVilles = meteoStorage.saveVilles($scope.myVilles);
	}
}]);