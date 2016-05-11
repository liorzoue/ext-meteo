MeteoControllers.controller('settingsCtrl', ['$scope', '$location', 'Villes', 'meteoStorage', 'Manifest', function ($scope, $location, Villes, meteoStorage, Manifest) {	
	_gaq.push(['_trackPageview', '/settings']);

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
		_gaq.push(['_trackEvent', 'ville', 'register']);
		item.notifications = true;

		$scope.myVilles = meteoStorage.addVille(item);
		$scope.ville = '';
		$scope.villesResult = [];
	}

	$scope.unregisterVille = function (item) {
		_gaq.push(['_trackEvent', 'ville', 'unregister']);
		$scope.myVilles = meteoStorage.removeVille($scope.myVilles, item);
	}

	$scope.toggle = function (item) {
		_gaq.push(['_trackEvent', 'option-'+item, 'toggle']);
		$scope.Options[item].active = !$scope.Options[item].active;
		meteoStorage.saveOptions($scope.Options);
	}

	$scope.saveNotifications = function () {
		_gaq.push(['_trackEvent', 'notifications', 'save']);
		meteoStorage.saveOptions($scope.Options);
	};

	$scope.removeNotification = function (item) {
		_gaq.push(['_trackEvent', 'notifications', 'remove']);
		$scope.Options.notifications.list.splice($scope.Options.notifications.list.indexOf(item),1);
		meteoStorage.saveOptions($scope.Options);
	}

	$scope.toggleNotifications = function (item) {
		_gaq.push(['_trackEvent', 'notifications', 'toggle']);
		item.notifications = !item.notifications;
		$scope.myVilles = meteoStorage.saveVilles($scope.myVilles);
	}

	$scope.openUrl = function (newURL) {
		chrome.tabs.create({ url: newURL });
	};
}]);