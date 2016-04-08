var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var EntryController = (function () {
            function EntryController(MediaService, accountService, $routeParams, $uibModal, $location) {
                var _this = this;
                this.MediaService = MediaService;
                this.accountService = accountService;
                this.$routeParams = $routeParams;
                this.$uibModal = $uibModal;
                this.$location = $location;
                this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                this.cast = [];
                this.roles = [];
                this.directors = [];
                this.writers = [];
                this.otherContributors = [];
                this.notFound = false;
                this.showInactiveMessage = false;
                this.showInactiveIndicator = false;
                this.changeListVm = {};
                this.checkListVm = {};
                this.reviewVm = {};
                this.setUserInfo();
                this.MediaService.getMediaById(this.$routeParams['id']).then(function (data) {
                    _this.media = data;
                    if (_this.media.id != undefined) {
                        _this.checkMasterlist();
                        if (!_this.media.isActive && !_this.isAdmin) {
                            _this.showInactiveMessage = true;
                        }
                        else {
                            if (!_this.media.isActive) {
                                _this.showInactiveIndicator = true;
                            }
                            _this.releaseDate = new Date(_this.media.releaseDate);
                            _this.releaseDate = _this.months[_this.releaseDate.getMonth()] + " " + _this.releaseDate.getDate() + ", " + _this.releaseDate.getFullYear();
                            for (var i = 0; i < _this.media.contributors.length; i++) {
                                if (_this.media.contributors[i].roles == "Actor") {
                                    _this.cast.push(_this.media.contributors[i]);
                                    _this.roles.push("Add Role");
                                }
                                else if (_this.media.contributors[i].roles == "Director") {
                                    _this.directors.push(_this.media.contributors[i]);
                                    _this.hasStaff = true;
                                }
                                else if (_this.media.contributors[i].roles == "Writer") {
                                    _this.writers.push(_this.media.contributors[i]);
                                    _this.hasStaff = true;
                                }
                                else {
                                    _this.otherContributors.push(_this.media.contributors[i]);
                                }
                            }
                        }
                    }
                    else {
                        _this.notFound = true;
                    }
                });
            }
            EntryController.prototype.setUserInfo = function () {
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
            EntryController.prototype.openEditModal = function (id) {
                this.$uibModal.open({
                    templateUrl: 'ngApp/views/Modals/dbEditModal.html',
                    controller: Controllers.DbEditController,
                    controllerAs: 'vm',
                    resolve: {
                        mediaId: function () { return id; }
                    },
                    backdrop: 'static',
                    keyboard: false,
                    size: "lg"
                });
            };
            EntryController.prototype.checkMasterlist = function () {
                var _this = this;
                this.checkListVm.mediaId = this.media.id;
                this.MediaService.checkMasterlist(this.checkListVm).then(function (data) {
                    _this.hasInList = data.result;
                    _this.hasReviewed = data.secondaryResult;
                });
            };
            EntryController.prototype.addToList = function () {
                var _this = this;
                this.changeListVm.mediaId = this.media.id;
                this.changeListVm.mode = "add";
                this.MediaService.changeList(this.changeListVm).then(function (data) {
                    _this.addStatus = data.message;
                    if (_this.addStatus == "Success.") {
                        _this.hasInList = true;
                        _this.showListLink = true;
                    }
                });
            };
            EntryController.prototype.removeFromList = function () {
                var _this = this;
                this.changeListVm.mediaId = this.media.id;
                this.changeListVm.mode = "remove";
                this.MediaService.changeList(this.changeListVm).then(function (data) {
                    if (!data.error) {
                        _this.hasInList = false;
                        _this.showListLink = false;
                    }
                });
            };
            EntryController.prototype.writeReview = function () {
                if (!this.isLoggedIn) {
                    this.$location.path('/register');
                }
                else if (!this.hasInList) {
                    this.showReviewError = true;
                }
                else {
                    this.$location.path('/review/' + this.media.id);
                }
            };
            EntryController.prototype.editReview = function () {
                this.$location.path('/review/' + this.media.id);
            };
            EntryController.prototype.deleteReview = function () {
                this.reviewVm.mediaId = this.media.id;
                var cont = confirm("Are you sure?");
                if (cont) {
                    this.MediaService.deleteReview(this.reviewVm).then(function () {
                        window.location.reload();
                    });
                }
            };
            return EntryController;
        })();
        Controllers.EntryController = EntryController;
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
//# sourceMappingURL=entryController.js.map