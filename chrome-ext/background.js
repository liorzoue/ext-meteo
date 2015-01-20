var APIBaseURL = 'http://www.meteofrance.com/mf3-rpc-portlet/rest/';
var APIPluieData = APIBaseURL + 'pluie/';
var APIPluieFind = APIBaseURL + 'lieu/facet/pluie/search/';
var UpdateInterval = 1; // minute(s)

var get_data = function (callback) {
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
				data.badge = { text: ':)', color: '5F5' };
						
				for(i=0;i<12;i++) {
					if (data.response.dataCadran[i].niveauPluie > 1) {
						data.prochainePrecipitation = data.response.dataCadran[i];
						data.prochainePrecipitation.time = i*5+10;
						data.badge.text = data.response.dataCadran.prochainePrecipitation.time + "m";
						data.badge.color = data.response.dataCadran.prochainePrecipitation.color;
						break;
					}
				}
				
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