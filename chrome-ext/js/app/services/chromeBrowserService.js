MeteoApp.factory('myChrome', [ function(){
	return {
		notify: function (title, text, icon) {
			new Notification(title, { icon: icon, body: text });
		}
	};
}]);