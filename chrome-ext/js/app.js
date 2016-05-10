var MeteoControllers = angular.module('MeteoControllers', ['ngResource', 'ngRoute', 'LocalStorageModule']);
var MeteoApp = angular.module('MeteoApp', ['MeteoControllers']);

MeteoApp.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
  	.setPrefix('MeteoApp')
  	.setNotify(true, true);
});