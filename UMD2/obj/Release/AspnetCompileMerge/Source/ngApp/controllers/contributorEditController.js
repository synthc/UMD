var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var ContributorEditController = (function () {
            function ContributorEditController(contributorId, MediaService, accountService, $uibModalInstance, $location) {
                var _this = this;
                this.contributorId = contributorId;
                this.MediaService = MediaService;
                this.accountService = accountService;
                this.$uibModalInstance = $uibModalInstance;
                this.$location = $location;
                this.isAdmin = false;
                this.addContributions = false;
                this.showMResults = false;
                this.MediaService.getContributorById(this.contributorId).then(function (data) {
                    _this.contributor = data;
                    _this.dob = new Date(_this.contributor.dob);
                    _this.year = _this.dob.getFullYear();
                    _this.month = _this.dob.getMonth();
                    _this.day = _this.dob.getDate();
                });
                this.setUserInfo();
                this.genericVm = {};
                this.contributionQuery = {};
                this.contributionQuery.query = "";
                this.contributionQuery.searchFor = "All";
                this.contributionQuery.searchBy = "Title";
            }
            ContributorEditController.prototype.setUserInfo = function () {
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
            ContributorEditController.prototype.saveChanges = function () {
                this.contributor.dob = new Date(this.year, this.month, this.day);
                this.MediaService.editContributor(this.contributor).then(function () {
                    window.location.reload();
                });
            };
            ContributorEditController.prototype.delete = function (mode) {
                var _this = this;
                this.genericVm.string1 = mode;
                this.genericVm.int1 = this.contributor.id;
                if (mode == 'soft') {
                    this.MediaService.deleteContributor(this.genericVm).then(function () {
                        window.location.reload();
                    });
                }
                else {
                    var cont = confirm("This entry will be permanently deleted from the database. Continue?");
                    if (cont) {
                        this.MediaService.deleteContributor(this.genericVm).then(function () {
                            _this.closeModal();
                            window.history.back();
                            window.location.reload();
                        });
                    }
                }
            };
            ContributorEditController.prototype.setSearchParams = function (parameter, value) {
                if (parameter == 0) {
                    this.contributionQuery.searchFor = value;
                }
                else {
                    this.contributionQuery.searchBy = value;
                }
            };
            ContributorEditController.prototype.searchContribution = function () {
                var _this = this;
                this.MediaService.search(this.contributionQuery).then(function (data) {
                    _this.mResults = data.results;
                    //Mark existing contributions to prevent them from showing up in the search results:
                    for (var i = 0; i < _this.mResults.length; i++) {
                        for (var j = 0; j < _this.contributor.contributions.length; j++) {
                            if (_this.mResults[i].id == _this.contributor.contributions[j].id) {
                                _this.mResults[i].added = true;
                            }
                        }
                    }
                    _this.showMResults = true;
                });
            };
            ContributorEditController.prototype.addContribution = function (index) {
                this.contributor.contributions.push(this.mResults[index]);
                this.mResults[index].added = true;
            };
            ContributorEditController.prototype.removeContribution = function (index) {
                this.contributor.contributions[index].added = false;
                this.contributor.contributions.splice(index, 1);
            };
            ContributorEditController.prototype.addToDb = function () {
                //if (form was touched or contributors were changed)
                var cont = confirm("Your changes will be lost. Continue?");
                if (cont) {
                    this.closeModal();
                    this.$location.path("/addtodb");
                }
            };
            ContributorEditController.prototype.closeModal = function () {
                this.$uibModalInstance.close();
            };
            return ContributorEditController;
        })();
        Controllers.ContributorEditController = ContributorEditController;
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
//# sourceMappingURL=contributorEditController.js.map