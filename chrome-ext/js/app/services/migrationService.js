MeteoApp.factory('Migration', ['myStorage', 'Villes', function(Storage, Villes) {
	var migrationChromeStorage = function () {
		var getStorage = function () {
			chrome.storage.local.get(null, function(result){
				console.log('Previous Storage : ', result);
				if (result == undefined) { return false; }

				if (result.villes[0].id == undefined) { return false; }

				var newVilles = Storage.getVilles();
				var newOptions = Storage.getOptions();

				for (var i = result.villes.length - 1; i >= 0; i--) {
					newVilles.push(Villes.query({ villeName: result.villes[i].name }));
				}

				newOptions.graph.active = result.pGraph;
				newOptions.detail.active = result.pDetails;
				newOptions.notifications.active = result.pNotifications;

				Storage.saveOptions(newOptions);
				Storage.saveVilles(newVilles);

				chrome.storage.local.set(undefined, function(){ console.log('Migration effectuée !'); });


			});
		};
	};

	return { 
		make: function () {
			migrationChromeStorage();
		}
	}
}]);

