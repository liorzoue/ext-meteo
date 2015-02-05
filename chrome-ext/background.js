var APIBaseURL = 'http://www.meteofrance.com/mf3-rpc-portlet/rest/';
//* // tests
var APIPluieData = APIBaseURL + 'pluie/'; /*/
var APIPluieData = 'data-sample.json#'; //*/ 
var APIPluieFind = APIBaseURL + 'lieu/facet/pluie/search/';
var UpdateInterval = 1; // minute(s)

var myDate = {
	heures: 0, minutes: 0, 
	
	getDate: function () {
		return this.heures+'h'+(this.minutes<10?'0':'')+this.minutes;
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

var get_data = function (callback) {
	var setIcon = function (type) {
		var newIconPath = 'img/'+type+'.png';
		
		chrome.browserAction.setIcon({
			path: newIconPath
		});
	};

	chrome.storage.sync.get(['villeLibelle','villeID', 'used'], function (item) {
		if (!item.used) {
			item.villeLibelle = '';
			item.villeID = 0;
			item.showParam = true;
		} else {
			item.villeLibelle = item.villeLibelle;
			item.villeID = item.villeID;
			item.showParam = false;
		}
		
		if (!item.villeID) { setBadge({ color: false, text: 'x' }); if (callback) { callback(item); return; } }
		
		console.log('ville:'+item.villeLibelle);
		
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			var data = item;
			
			if (xmlhttp.readyState==4 && xmlhttp.status==200) {
				data.response = JSON.parse(xmlhttp.responseText);
				data.badge = { text: 'no', color: '5F5' };
				
				var hasPluie = false;
				myDate.init(data.response.lastUpdate);
				for(i=0;i<12;i++) {
					data.response.dataCadran[i].heure = myDate.addMinutes(5);
					
					if (data.response.dataCadran[i].niveauPluie > 1 && !hasPluie) {
						data.prochainePrecipitation = data.response.dataCadran[i];
						data.prochainePrecipitation.time = i*5+5;
						data.badge.text = data.prochainePrecipitation.time + "m";
						data.badge.color = data.prochainePrecipitation.color;
						hasPluie = true;
					}
				}
				
				if (hasPluie) { setIcon('rain32'); }
				else { setIcon('sun32'); }
				
				setBadge(data.badge);
				
				data.error = { hasError: false, message: 'OK' };
				
			} else if (xmlhttp.readyState==4) {
				setBadge({ color: false, text: xmlhttp.status });
				
				data.error = { hasError: true, message: 'Wrong API URL. ('+xmlhttp.status+')' };
			}
			
			if (callback) { callback(data); }
		}
		xmlhttp.open("GET", APIPluieData + item.villeID,true);
		xmlhttp.send();
	});
}

var setBadge = function (badge) {
	if (!badge.color) { badge.color = 'A00'; }
	if (!badge.text) { badge.text = 'err'; }
	if (badge.text == 'no') { badge.text = ''; }
	
	chrome.browserAction.setBadgeText({text: badge.text.toString() });
	chrome.browserAction.setBadgeBackgroundColor({ color: '#'+badge.color });
};

(function updateCounter() {		
	get_data(function (data) { });

    setTimeout(updateCounter, 1000*60*UpdateInterval);
})();




/*
	Recherche d'une ville
	http://www.meteofrance.com/mf3-rpc-portlet/rest/lieu/facet/previsions_metropole/search/xxx
	
	Recherche d'une ville
	! Résultat couverts par "Pluie dans l'heure" uniquement
	http://www.meteofrance.com/mf3-rpc-portlet/rest/lieu/facet/pluie/search/xxx
	
	Pluie dans l'heure
	http://www.meteofrance.com/mf3-rpc-portlet/rest/pluie/IDVILLE
*/