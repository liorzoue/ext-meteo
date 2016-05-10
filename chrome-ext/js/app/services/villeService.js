MeteoApp.factory('Villes', ['$resource', function($resource){
	return $resource('http://www.meteofrance.com/mf3-rpc-portlet/rest/lieu/facet/pluie/search/:villeName', 
		null,
		{ query: { method: 'get', isArray: true }});
}]);