var MeteoApp = angular.module('MeteoApp', ['LocalStorageModule']);

MeteoApp.controller('MeteoCtrl', ['$scope','$http', function ($scope, $http, localStorageService) {
	$scope.Storage = {
		villes: [
		{
			name: null,
			id: 0
		}
		],
		pGraph: true,
		pDetails: true,
		pNotifications: true,
		pNotifTime: ':'
	};

	$scope.Storage.villes = []; 

	$scope.PluieData = [];
	$scope.Status = 'default';
	
	$scope.getManifest = function (){
		$http({
			method: 'GET',
			url: 'manifest.json'
		}).then(function successCallback(response) {
			$scope.Manifest = response.data;
		}, function errorCallback(response) {
			$scope.Manifest = {};
		});
	}


	var setStorage = function () {
		return localStorageService.set('storage', $scope.Storage);
	};

	var getStorage = function () {
		var tmpStorage =  localStorageService.get('storage');
		if(tmpStorage.villes[0].id == undefined) { return false; }
		$scope.Storage = tmpStorage;
	}

	$scope.getManifest();
	$scope.Math = window.Math;
	$scope.Active = 'default';
	$scope.VilleResults = [];
	$scope.query = '';

	/* STORAGE */
	function setStorage(key, val) {
		return localStorageService.set(key, val);
	}

	if ($scope.Storage.villes.length == 0) {
		$scope.Active = 'param';
	} else {
		$scope.getData();
	}

	$scope.toggle = function(what) {
		$scope.Storage[what] = !$scope.Storage[what];
	};

	$scope.toggleParam = function () {
		$scope.setStorage();
		
		if ($scope.Active == 'default') { $scope.Active = 'param'; return true; }
		if ($scope.Active == 'param') { $scope.Active = 'default'; return true; }
	};
	
	$scope.findTown = function (query) {
		$scope.VilleResults = [];
		if (query.length == 0) { return; }
		$http.jsonp(MeteoAPI.getFind() + query + '?callback=JSON_CALLBACK').success(function(data) {
			console.log(data.found);
			/*if (data.length == 0) { return; }
			$scope.VilleResults = data; */
		}).error(function(data){
			console.log(arguments);
			console.log(data);
		});
	};

	/* UI Actions */
	$scope.selectTown = function (id, libelle) {

		$scope.Storage.villes.push({name: libelle, id: id});
		$scope.setStorage();
		
		$scope.VilleResults = [];
		$scope.query = '';
	};
	
	$scope.openURL = function (url) {
		chrome.tabs.create({ url: url });
	};
	
	$scope.removeVille = function(item) { 
		var index = $scope.Storage.villes.indexOf(item);
		$scope.Storage.villes.splice(index, 1);     
		
		$scope.setStorage();
	}

	/* Functions */
	var MeteoAPI = {
		base: 'http://www.meteofrance.com/mf3-rpc-portlet/rest/',
		data: 'pluie/',
		find: 'lieu/facet/pluie/search/',

		getData: function () { return this.base+this.data; },
		getFind: function () { return this.base+this.find; }
	};

	var getData = function () {
		$scope.PluieData = [];
		for (i=0;i<Storage.villes.length;i++) {
			ajaxRequest(MeteoAPI.getData()+Storage.villes[i].id, gestPluie);
		}
	};
	var gestDate = {
		heures: 0, minutes: 0, 

		getDate: function () {
			return (this.heures<10?'0':'')+this.heures+'h'+(this.minutes<10?'0':'')+this.minutes;
		}, 

		addMinutes: function (t) {
			this.minutes += t;
			if (this.minutes > 59) {
				this.minutes -= 60;
				this.addHeures(1);
			}
			return this.getDate();
		}, 

		addHeures: function (t) {
			this.heures += t;
			if (this.heures >= 24) { this.heures -= 24; }

			return this.getDate();
		},

		init: function (h) {
			if(h) {
				this.heures = parseInt(h.split('h')[0], 10);
				this.minutes = parseInt(h.split('h')[1], 10);
			} else {
				this.heures = (new Date()).getHours();
				this.minutes = (new Date()).getMinutes();
			}

			return this.getDate();
		},

		toDateObject: function (h, m) {
			if(h) { this.heures = h; }
			if(m) { this.minutes = m; }
			var o = new Date();
			o.setHours(this.heures, this.minutes);

			return o;
		}
	};

	var gestPluie = function (response) {
		$scope.PluieData.push(response);
		var len = $scope.PluieData.length - 1;

		if (!$scope.PluieData[len].lastUpdate) { return; }

		Status.badge = { text: 'no', color: '5F5' };
		Status.pluie = false;

		gestDate.init($scope.PluieData[len].lastUpdate);

		for (i=0;i<12;i++) {
			$scope.PluieData[len].dataCadran[i].heure = gestDate.addMinutes(5);
			if ($scope.PluieData[len].dataCadran[i].niveauPluie > 1 && !Status.pluie) {
				$scope.PluieData[len].prochainePrecipitation = $scope.PluieData[len].dataCadran[i];
				$scope.PluieData[len].prochainePrecipitation.time = i*5+5;
				Status.badge = { text: $scope.PluieData[len].prochainePrecipitation.time + "m", color: $scope.PluieData[len].prochainePrecipitation.color };
				Status.pluie = true;
			}
		}

		setIcon();
		setBadge();

		console.log('gestPluie: ', $scope.PluieData);

	};
}]);