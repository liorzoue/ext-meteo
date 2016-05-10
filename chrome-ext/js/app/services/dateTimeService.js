MeteoApp.factory('myDateTime', [ function(){
	this.heures = 0;
	this.minutes = 0;

	var dateToString = function () {
		return (this.heures<10?'0':'')+this.heures+'h'+(this.minutes<10?'0':'')+this.minutes;
	};

	var stringToDate = function (h) {
		if(h) {
			this.heures = parseInt(h.split('h')[0], 10);
			this.minutes = parseInt(h.split('h')[1], 10);
		} else {
			this.heures = (new Date()).getHours();
			this.minutes = (new Date()).getMinutes();
		}

		return dateToString();
	};

	var addMinutes = function (t) {
		this.minutes += t;
		if (this.minutes > 59) {
			this.minutes -= 60;
			addHeures(1);
		}
		return dateToString();
	};

	var addHeures = function (t) {
		this.heures += t;
		if (this.heures >= 24) { this.heures -= 24; }

		return dateToString();
	}

	var dateDiff = function (timeDebut, timeFin) {
		stringToDate(timeDebut);
		var h1 = this.heures;
		var m1 = this.minutes;

		stringToDate(timeFin);
		var h2 = this.heures;
		var m2 = this.minutes;
		var diff = -(m1-60*(h2-h1))+m2;

		if (diff < 0) diff = 0;
		return diff + 'm';
	};

	return {
		addMinutesToDate: function(time, min) {
			stringToDate(time);
			addMinutes(min);
			return dateToString();
		},

		dateDiff: function (timeDebut, timeFin) {
			return dateDiff(timeDebut, timeFin);
		}
	};
}]);