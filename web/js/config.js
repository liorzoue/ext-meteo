MeteoApp.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('MeteoApp')
    .setStorageCookie(45);
});
