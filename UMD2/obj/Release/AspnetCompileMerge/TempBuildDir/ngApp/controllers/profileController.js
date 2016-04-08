var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var ProfileController = (function () {
            function ProfileController(MediaService, $routeParams) {
                var _this = this;
                this.MediaService = MediaService;
                this.$routeParams = $routeParams;
                this.MediaService.getUserById(this.$routeParams['id']).then(function (data) {
                    _this.owner = data;
                    console.log(_this.owner);
                });
            }
            return ProfileController;
        })();
        Controllers.ProfileController = ProfileController;
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
//# sourceMappingURL=profileController.js.map