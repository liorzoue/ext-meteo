MeteoApp.factory('Icone', ['Manifest', 'myDateTime', 'Browser', function(Manifest, myDateTime, Browser) {
	var ManifestItem = Manifest.get();

	function getProchainePrecipitation(time, cadran, ville) {
		var now = (new Date()).getHours()+ 'h' + (new Date()).getMinutes();
		var lastUpdate = new Date(70, 0, 1, parseInt(time.split('h')[0], 10), parseInt(time.split('h')[1], 10));

		var out = {
			pluie: false,
			level: 0,
			color: 'fff',
			heure: new Date(),
			ville: ''
		};

		var i = 0;
		while(i<11 && !out.pluie)
		{
			if (cadran[i].niveauPluie > 1) {
				out.pluie = true;
				out.level = cadran[i].niveauPluie;
				out.color = cadran[i].color;
				out.heure = myDateTime.dateDiff(now, myDateTime.addMinutesToDate(time, i*5+5));
				out.ville = ville;
			}
			i++;
		}

		return out;
	}

	return {
		set: function (time, cadran, ville) {
			var item = getProchainePrecipitation(time, cadran, ville);
			var icon = '';
			if (item.pluie) { icon = 'rain32'; }
			if (!item.pluie) {
				icon = 'sun32';
				item.heure = '';
			}

		
			Browser.setIcon({ path: 'img/'+icon+'.png' });
			Browser.setBadgeText({text: item.heure.toString() });
			Browser.setBadgeBackgroundColor({ color: '#'+item.color });
			Browser.setTitle({ title: 'Pluie a ' + item.ville.toString()});
		}
	}
}]);