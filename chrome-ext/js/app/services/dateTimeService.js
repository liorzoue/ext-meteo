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

	return {
		addMinutesToDate: function(time, min) {
			stringToDate(time);
			addMinutes(min);
			return dateToString();
		}
	};
}]);