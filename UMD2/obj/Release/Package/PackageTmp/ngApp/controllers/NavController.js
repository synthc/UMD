var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var NavController = (function () {
            function NavController($uibModal, $location, MediaService, accountService) {
                var _this = this;
                this.$uibModal = $uibModal;
                this.$location = $location;
                this.MediaService = MediaService;
                this.accountService = accountService;
                this.searchForPerson = false;
                this.sbLastSet = "Title";
                this.mouseHover = false;
                this.setUserInfo();
                this.MediaService.getUser("thisUser").then(function (data) {
                    _this.userInfo = data;
                    _this.userName = _this.userInfo.userName;
                    _this.MediaService.user = data;
                    _this.MediaService.user.isLoggedIn = _this.isLoggedIn;
                });
                this.query = {};
                this.query.searchFor = "All";
                this.query.searchBy = "Title";
                this.query.query = "";
                this.query.includeDeleted = false;
                this.query.onlyDeleted = false;
                this.MediaService.searchTransport = {};
            }
            NavController.prototype.logout = function () {
                this.accountService.logout();
                this.isLoggedIn = false;
            };
            NavController.prototype.setUserInfo = function () {
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
            NavController.prototype.openLoginModal = function () {
                this.$uibModal.open({
                    templateUrl: 'ngApp/views/login.html',
                    controller: MyApp.Controllers.LoginController,
                    controllerAs: 'controller',
                });
            };
            NavController.prototype.setParams = function (parameter, value) {
                if (parameter == 0) {
                    this.query.searchFor = value;
                    if (value == "People" || value == "Users") {
                        this.query.searchBy = "Name";
                        this.searchForPerson = true;
                    }
                    else {
                        if (this.query.searchBy == "Name") {
                            this.query.searchBy = this.sbLastSet;
                        }
                        this.searchForPerson = false;
                    }
                }
                else {
                    this.query.searchBy = value;
                    this.sbLastSet = value;
                }
            };
            NavController.prototype.search = function () {
                var _this = this;
                this.MediaService.search(this.query).then(function (data) {
                    if (_this.query.searchFor == "People") {
                        console.log(data);
                        _this.MediaService.searchTransport = data.cResults;
                        _this.MediaService.searchTransport.dataType = "People";
                    }
                    else if (_this.query.searchFor == "Users") {
                        _this.MediaService.searchTransport = data.uResults;
                        _this.MediaService.searchTransport.dataType = "Users";
                    }
                    else {
                        _this.MediaService.searchTransport = data.results;
                        _this.MediaService.searchTransport.dataType = "Media";
                    }
                    if (window.location.pathname != '/search') {
                        _this.$location.path('/search');
                    }
                });
            };
            NavController.prototype.setMouseHover = function (hover) {
                this.mouseHover = hover;
            };
            return NavController;
        })();
        Controllers.NavController = NavController;
        angular.module('MyApp').controller('NavController', NavController);
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
//# sourceMappingURL=NavController.js.map