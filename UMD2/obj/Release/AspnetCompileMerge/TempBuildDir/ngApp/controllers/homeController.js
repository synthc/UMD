var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var HomeController = (function () {
            function HomeController(MediaService, accountService) {
                var _this = this;
                this.MediaService = MediaService;
                this.accountService = accountService;
                this.setUserInfo();
                this.MediaService.getMedia().then(function (data) {
                    _this.medias = data;
                });
            }
            HomeController.prototype.setUserInfo = function () {
                if (this.accountService.isLoggedIn() == null) {
                    this.isLoggedIn = false;
                    this.isAdmin = false;
                }
                else {
                    this.isLoggedIn = true;
                    if (this.accountService.getClaim("Admin") == null) {
                        this.isAdmin = false;
                    }
                    else {
                        this.isAdmin = true;
                    }
                }
            };
            HomeController.prototype.debugSeed = function () {
                var cont = confirm("Are you sure?");
                if (cont) {
                    this.MediaService.debugSeed();
                }
            };
            return HomeController;
        })();
        Controllers.HomeController = HomeController;
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
//# sourceMappingURL=homeController.js.map