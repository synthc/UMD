var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var ContributorController = (function () {
            function ContributorController(MediaService, accountService, $routeParams, $uibModal) {
                var _this = this;
                this.MediaService = MediaService;
                this.accountService = accountService;
                this.$routeParams = $routeParams;
                this.$uibModal = $uibModal;
                this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                this.notFound = false;
                this.showInactiveMessage = false;
                this.showInactiveIndicator = false;
                this.setUserInfo();
                this.MediaService.getContributorById(this.$routeParams['id']).then(function (data) {
                    _this.contributor = data;
                    if (_this.contributor.id != undefined) {
                        if (!_this.contributor.isActive && !_this.isAdmin) {
                            _this.showInactiveMessage = true;
                        }
                        else {
                            if (!_this.contributor.isActive) {
                                _this.showInactiveIndicator = true;
                            }
                            _this.dob = new Date(_this.contributor.dob);
                            _this.dob = _this.months[_this.dob.getMonth() - 1] + " " + (_this.dob.getDate()) + ", " + _this.dob.getFullYear();
                        }
                    }
                    else {
                        _this.notFound = true;
                    }
                });
            }
            ContributorController.prototype.edit = function () {
                this.openEditModal(this.contributor.id);
            };
            ContributorController.prototype.openEditModal = function (id) {
                this.$uibModal.open({
                    templateUrl: 'ngApp/views/Modals/contributorEditModal.html',
                    controller: Controllers.ContributorEditController,
                    controllerAs: 'vm',
                    resolve: {
                        contributorId: function () { return id; }
                    },
                    backdrop: 'static',
                    keyboard: false,
                    size: "lg"
                });
            };
            ContributorController.prototype.setUserInfo = function () {
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
            return ContributorController;
        })();
        Controllers.ContributorController = ContributorController;
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
//# sourceMappingURL=contributorController.js.map