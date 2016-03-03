var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var NavController = (function () {
            function NavController($uibModal, accountService) {
                var _this = this;
                this.$uibModal = $uibModal;
                this.accountService = accountService;
                this.isLoggedIn();
                this.accountService.getUserInfo(this.accountService.isLoggedIn()).then(function (data) {
                    _this.userInfo = data;
                    _this.userName = _this.userInfo.email;
                });
            }
            NavController.prototype.logout = function () {
                this.accountService.logout();
            };
            NavController.prototype.isLoggedIn = function () {
                if (this.accountService.isLoggedIn() == null) {
                    this.loggedIn = false;
                }
                else {
                    this.loggedIn = true;
                }
            };
            NavController.prototype.openLoginModal = function () {
                this.$uibModal.open({
                    templateUrl: 'ngApp/views/login.html',
                    controller: MyApp.Controllers.LoginController,
                    controllerAs: 'controller',
                });
            };
            return NavController;
        })();
        Controllers.NavController = NavController;
        angular.module('MyApp').controller('NavController', NavController);
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
//# sourceMappingURL=NavController.js.map