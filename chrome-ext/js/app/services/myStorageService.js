MeteoApp.factory('myStorage', ['localStorageService', function(localStorageService){
	return {
		load: function (key) {
			return localStorageService.get(key);
		},
		save: function (key, val) {
			return localStorageService.set(key, val);
		}
	};
}])
