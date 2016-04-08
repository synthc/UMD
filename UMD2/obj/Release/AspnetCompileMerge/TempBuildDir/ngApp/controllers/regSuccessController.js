var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var regSuccessController = (function () {
            function regSuccessController(accountService, $location) {
                this.accountService = accountService;
                this.$location = $location;
                this.setUserInfo();
                if (this.isLoggedIn) {
                    this.$location.path('/');
                }
            }
            regSuccessController.prototype.setUserInfo = function () {
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
            return regSuccessController;
        })();
        Controllers.regSuccessController = regSuccessController;
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
//# sourceMappingURL=regSuccessController.js.map