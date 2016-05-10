MeteoApp.factory('Meteo', ['$resource', function($resource){
	return $resource('http://www.meteofrance.com/mf3-rpc-portlet/rest/pluie/:villeId', 
		null,
		{ query: { method: 'get', isArray: false }});
}]);