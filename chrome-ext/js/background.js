var MeteoAPI = {
	base: 'http://www.meteofrance.com/mf3-rpc-portlet/rest/',
	data: 'pluie/',
	find: 'lieu/facet/pluie/search/',
	
	getData: function () { return this.base+this.data; },
	getFind: function () { return this.base+this.find; }
};

var ModeDebug = false;
var UpdateInterval = 1; // minute(s)
var VilleEnAvant = 0; // Ville affichée dans la barre d'extension

if (ModeDebug) { MeteoAPI.getData = function () { return 'data-sample.json#'; }; }

var PluieData = [];

var Storage = {
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

Storage.villes = []; 

var Status = {
	error: false,
	message: '',
	badge: {
		color: 'A00',
		text: 'err'
	},
	pluie: false,
	loading: false,
	icon: 'rain32'
};

function findVille(villeName) {
	return function findVilleInStorage(ville) {
		return ville.id === villeName;
	};
}


var Message = function () {
	if (!ModeDebug) { return true; }
	
	if (arguments.length == 1) { console.log(arguments[0]); }
	else { console.log('Message: ', arguments); }
}

var setBadge = function () {
	if (!Status.badge.color) { Status.badge.color = 'A00'; }
	if (!Status.badge.text) { Status.badge.text = 'err'; }
	if (Status.badge.text == 'no') { Status.badge.text = ''; }
	
	chrome.browserAction.setBadgeText({text: Status.badge.text.toString() });
	chrome.browserAction.setBadgeBackgroundColor({ color: '#'+Status.badge.color });
};

var setIcon = function () {
	if (Status.pluie) { Status.icon = 'rain32'; }
	if (!Status.pluie) { Status.icon = 'sun32'; }
	
	chrome.browserAction.setIcon({ path: 'img/'+Status.icon+'.png' });
};

var setStorage = function () {
	chrome.storage.local.set(Storage, function(){ Message('Storage set'); });
};

var getStorage = function () {
	chrome.storage.local.get(null, function(result){
		if (result.villes[0].id == undefined) { return false; }
		Storage = result;
	});
}

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
	PluieData.push(response);
	var len = PluieData.length - 1;
	
	if (!PluieData[len].lastUpdate) { return; }
	
	Status.badge = { text: 'no', color: '5F5' };
	Status.pluie = false;
	
	gestDate.init(PluieData[len].lastUpdate);
	
	for (i=0;i<12;i++) {
		PluieData[len].dataCadran[i].heure = gestDate.addMinutes(5);
		PluieData[len].villeItem = Storage.villes.find(findVille(PluieData[len].idLieu));
		if (PluieData[len].dataCadran[i].niveauPluie > 1 && !Status.pluie) {
			PluieData[len].prochainePrecipitation = PluieData[len].dataCadran[i];
			PluieData[len].prochainePrecipitation.time = i*5+5;
			Status.badge = { text: PluieData[len].prochainePrecipitation.time + "m", color: PluieData[len].prochainePrecipitation.color };
			Status.pluie = true;
		}
	}
	
	setIcon();
	setBadge();
	
	console.log('gestPluie: ', PluieData);
	
};

var ajaxRequest = function (url, callback) {
	var xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			var response = JSON.parse(xmlhttp.responseText);
			
			Message(response);
			callback(response);
		} else { }
				
	};
		
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
};

var getData = function () {
	PluieData = [];
	for (i=0;i<Storage.villes.length;i++) {
		ajaxRequest(MeteoAPI.getData()+Storage.villes[i].id, gestPluie);
		// ajaxRequest('js/data-sample_'+Storage.villes[i].id + '.json', gestPluie);
	}
};

var notifyMe = function () {
	var notifText = '';
	var notifIcon = 'sun32';
	
	for (var i = PluieData.length - 1; i >= 0; i--) {
		if(!PluieData[i].prochainePrecipitation) {
			// Pas de pluie !
			notifText = 'Pas de pluie prévue dans l\'heure ! :)';
			notifIcon = 'img/sun128.png';
		} else {
			// Pluie !!
			notifText = PluieData[i].prochainePrecipitation.niveauPluieText + ' dans ' + PluieData[i].prochainePrecipitation.time + 'min';
			notifIcon = 'img/rain128.png';
		}

		

		var notification = new Notification(PluieData[i].villeItem.name, {
		icon: notifIcon,
		body: notifText,
	});
	}
	
	
	
	console.log('notification: ', notifText);
};

// Mise à jour des données
(function updateCounter() {
    setTimeout(updateCounter, 1000*60*UpdateInterval);
	
	getStorage();
	getData();
	
	if (gestDate.init().replace('h', ':') == Storage.pNotifTime) { notifyMe(); }
})();

getStorage();
getData();

/*
	Recherche d'une ville
	http://www.meteofrance.com/mf3-rpc-portlet/rest/lieu/facet/previsions_metropole/search/xxx
	
	Recherche d'une ville
	! Résultat couverts par "Pluie dans l'heure" uniquement
	http://www.meteofrance.com/mf3-rpc-portlet/rest/lieu/facet/pluie/search/xxx
	
	Pluie dans l'heure
	http://www.meteofrance.com/mf3-rpc-portlet/rest/pluie/IDVILLE
*/