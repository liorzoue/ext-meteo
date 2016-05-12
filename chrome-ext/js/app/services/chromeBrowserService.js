MeteoApp.factory('Browser', [ function(){
	return {
		notify: function (title, text, icon) {
			new Notification(title, { icon: icon, body: text });
		},

		setIcon: function (object) {
			chrome.browserAction.setIcon(object);
		},

		setBadgeText: function (object) {
			chrome.browserAction.setBadgeText(object);
		},

		setBadgeBackgroundColor: function (object) {
			chrome.browserAction.setBadgeBackgroundColor(object);
		},

		setTitle: function (object) {
			chrome.browserAction.setTitle(object);
		}
	};
}]);