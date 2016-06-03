MeteoControllers.controller('PopupCtrl', ['$scope', '$location', function ($scope, $location) {
	$scope.Math = window.Math;
	_gaq.push(['_trackPageview', '/popup']);
	_gaq.push(['_trackEvent', 'popup', 'load']);
}]);