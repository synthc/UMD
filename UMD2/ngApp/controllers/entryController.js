var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var EntryController = (function () {
            function EntryController(MediaService, $routeParams) {
                var _this = this;
                this.MediaService = MediaService;
                this.$routeParams = $routeParams;
                console.log('test');
                this.medias = this.MediaService.getMedia(); //better to search database here?
                this.media = this.medias.filter(function (m) { return m.id == _this.$routeParams['id']; })[0];
                console.log(this.media);
            }
            return EntryController;
        })();
        Controllers.EntryController = EntryController;
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
//# sourceMappingURL=entryController.js.map