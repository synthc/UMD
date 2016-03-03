var MyApp;
(function (MyApp) {
    var Services;
    (function (Services) {
        var MediaService = (function () {
            function MediaService($resource) {
                this.$resource = $resource;
                this.mediaResource = $resource('api/media/:id', null, {
                    addToDb: {
                        url: "/api/media/addToDb",
                        method: "POST"
                    },
                    addToList: {
                        url: "/api/media/addToList",
                        method: "POST"
                    },
                    delete: {
                        url: "/api/media/delete",
                        method: "DELETE"
                    }
                });
            }
            MediaService.prototype.getMedia = function () {
                var data = this.mediaResource.query();
                return data;
            };
            MediaService.prototype.getMediaById = function (id) {
                return this.mediaResource.get({ id: id });
            };
            MediaService.prototype.getUser = function (userName) {
                return this.mediaResource.get({ userName: userName }).$promise;
            };
            MediaService.prototype.createMedia = function (media) {
                this.mediaResource.addToDb(media);
            };
            MediaService.prototype.addMediaByQuery = function (query) {
                this.mediaResource.addToList(query);
            };
            MediaService.prototype.deleteMedia = function (id) {
                this.mediaResource.delete({ id: id });
            };
            return MediaService;
        })();
        Services.MediaService = MediaService;
        angular.module("MyApp").service("MediaService", MediaService);
    })(Services = MyApp.Services || (MyApp.Services = {}));
})(MyApp || (MyApp = {}));
//# sourceMappingURL=MediaService.js.map