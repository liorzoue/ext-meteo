MeteoApp.factory('meteoStorage', ['myStorage', function(myStorage){
	var defaultVilles = [];
	var defaultOptions = {
		graph: {active: true},
		detail: {active: true},
		notifications: {
			active: false,
			list: []
		}
	};

	var loadVilles = function () {
			var myvilles = myStorage.load("villes");
			if (!myvilles) myvilles = defaultVilles;

			return myvilles;
	};

	var loadOptions = function () {
		var myoptions = myStorage.load("options");
		if (!myoptions) myoptions = defaultOptions;

		for (var i = myoptions.notifications.list.length - 1; i >= 0; i--) {
			myoptions.notifications.list[i].heure = new Date(myoptions.notifications.list[i].heure);
		}
		return myoptions;
	};

	var saveVilles = function (myvilles) {
		if(myStorage.save("villes", myvilles)) {
			return myvilles;
		} else {
			return defaultVilles;
		}
	};

	var saveOptions = function (myoptions) {
		if(myStorage.save("options", myoptions)) {
			return myoptions;
		} else {
			return defaultOptions;
		}
	};

	return {
		getOptions: function () {
			return loadOptions();
		},

		saveOptions: function (item) {
			return saveOptions(item);
		},

		getVilles: function () {
			return loadVilles();
		},

		saveVilles: function (villes) {
			return saveVilles(villes);
		},

		addVille: function (item) {
			var myvilles = loadVilles();
			myvilles.push(item);

			return saveVilles(myvilles);
		},

		removeVille: function (myvilles, item) {
			myvilles.splice(myvilles.indexOf(item),1);

			return saveVilles(myvilles);
		}

	};
}])
