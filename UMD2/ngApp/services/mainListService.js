var MyApp;
(function (MyApp) {
    var Services;
    (function (Services) {
        var MediaService = (function () {
            function MediaService($resource) {
                this.$resource = $resource;
                this.mediaResource = $resource('api/media/:id');
            }
            MediaService.prototype.getMedia = function () {
                return this.mediaResource.query();
            };
            MediaService.prototype.getMediaById = function (id) {
                return this.mediaResource.get({ id: id });
            };
            return MediaService;
        })();
        Services.MediaService = MediaService;
        angular.module("MyApp").service("", MediaService);
    })(Services = MyApp.Services || (MyApp.Services = {}));
})(MyApp || (MyApp = {}));
