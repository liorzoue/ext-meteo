MeteoApp.factory('Manifest', ['$http', function($http){
	var httpGetManifest = function () {
		$http.get("manifest.json").then(function (data) {
			return data;
		});
	};

	var getManifest = function () {
		if (!chrome) return httpGetManifest();
		if (!chrome.runtime) return httpGetManifest();

		return chrome.runtime.getManifest();
	};

	return {
		get: function () {
			return getManifest();
		}
	};
}]);