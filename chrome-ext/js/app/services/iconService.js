MeteoApp.factory('Icone', ['myDateTime', function(myDateTime) {

	function getProchainePrecipitation(time, cadran) {
		var now = (new Date()).getHours()+ 'h' + (new Date()).getMinutes();
		var lastUpdate = new Date(70, 0, 1, parseInt(time.split('h')[0], 10), parseInt(time.split('h')[1], 10));

		var out = {
			pluie: false,
			level: 0,
			color: 'fff',
			heure: new Date()
		};

		for (i=0;i<12;i++) {
			if (cadran[i].niveauPluie > 1 && !out.pluie) {
				out.pluie = true;
				out.level = cadran[i].niveauPluie;
				out.color = cadran[i].color;
				out.heure = myDateTime.dateDiff(now, myDateTime.addMinutesToDate(time, i*5+5));
			}
		}

		return out;
	}

	return {
		set: function (time, cadran) {
			var item = getProchainePrecipitation(time, cadran);
			var icon = '';
			if (item.pluie) { icon = 'rain32'; }
			if (!item.pluie) {
				icon = 'sun32';
				item.heure = '';
			}

		
			chrome.browserAction.setIcon({ path: 'img/'+icon+'.png' });
			chrome.browserAction.setBadgeText({text: item.heure.toString() });
			chrome.browserAction.setBadgeBackgroundColor({ color: '#'+item.color });
		}
	}
}]);