var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var DbListController = (function () {
            function DbListController(MediaService, $uibModal, $location) {
                var _this = this;
                this.MediaService = MediaService;
                this.$uibModal = $uibModal;
                this.$location = $location;
                this.MediaService.getMedia().then(function (data) {
                    _this.medias = data;
                });
            }
            DbListController.prototype.openEditModal = function (id) {
                this.$uibModal.open({
                    templateUrl: 'ngApp/views/Modals/dbEditModal.html',
                    controller: DbEditController,
                    controllerAs: 'vm',
                    resolve: {
                        mediaId: function () { return id; }
                    },
                    backdrop: 'static',
                    keyboard: false,
                    size: "lg"
                });
            };
            return DbListController;
        })();
        Controllers.DbListController = DbListController;
        angular.module('MyApp').controller('DbListController', DbListController);
        var DbEditController = (function () {
            function DbEditController(mediaId, MediaService, accountService, $uibModalInstance, $routeParams) {
                var _this = this;
                this.mediaId = mediaId;
                this.MediaService = MediaService;
                this.accountService = accountService;
                this.$uibModalInstance = $uibModalInstance;
                this.$routeParams = $routeParams;
                this.contributorCounter = 0;
                //Switches:
                this.manualAdd = false;
                this.contributorCreated = false;
                this.cont = true;
                this.validationError = false;
                this.contributorValidationError = false;
                this.dateRangeError = false;
                this.contributorSelected = false;
                this.searchContributions = false;
                this.showMResults = false;
                this.media = {};
                this.contributor = {};
                //this.contributorVm = {};
                this.media.contributors = [];
                this.query = {};
                this.query.query = "";
                this.contributionQuery = {};
                this.contributionQuery.query = "";
                this.contributionQuery.searchFor = "All";
                this.contributionQuery.searchBy = "Title";
                this.setUserInfo();
                //Define contributor object:
                this.clearContributorFields();
                this.MediaService.getMediaById(this.mediaId).then(function (data) {
                    _this.media = data;
                    //Need logic to initialize appropriate properties based on media type
                    _this.selectedType = _this.media.type;
                    _this.releaseDate = new Date(_this.media.releaseDate);
                    _this.year = _this.releaseDate.getFullYear();
                    _this.month = _this.releaseDate.getMonth();
                    _this.day = _this.releaseDate.getDate();
                    _this.isAnimation = _this.media.isAnimation.toString();
                    _this.duration = _this.media.duration;
                    _this.contributorCounter = _this.media.contributors.length;
                });
            }
            DbEditController.prototype.updateEntry = function () {
                this.media.type = this.selectedType;
                this.media.isAnimation = JSON.parse(this.isAnimation);
                this.media.year = Number(this.year);
                this.media.month = Number(this.month);
                this.media.day = Number(this.day);
                this.media.releaseDate = new Date(this.media.year, this.media.month, this.media.day);
                this.media.duration = Number(this.duration);
                this.media.contributorCreated = this.contributorCreated;
                this.media.isActive = true;
                console.log(this.media);
                this.MediaService.createMedia(this.media).then(function () {
                    window.location.reload();
                });
            };
            DbEditController.prototype.setUserInfo = function () {
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
            DbEditController.prototype.deleteRestore = function () {
                this.media.deleteRestore = true;
                this.MediaService.createMedia(this.media);
                this.closeModal();
                window.location.reload(); //change to history.back
            };
            DbEditController.prototype.hardDelete = function () {
                var cont = confirm("This entry will be permanently deleted from the database. Continue?");
                if (cont) {
                    this.MediaService.deleteMedia(this.media.id);
                    this.closeModal();
                    window.history.back();
                    window.location.reload();
                }
            };
            DbEditController.prototype.closeModal = function () {
                this.$uibModalInstance.close();
            };
            DbEditController.prototype.submitContributor = function () {
                //Validate contributor fields:
                if (this.contributor.roles == "" || this.contributor.givenName == "" || this.contributor.surname == "" || this.contributorBYear == "" || this.contributorBMonth == "" || this.contributorBDay == "" || this.contributor.nationality == "") {
                    console.log(this.contributor);
                    this.contributorValidationError = true;
                }
                else {
                    this.contributorValidationError = false;
                    this.manualAdd = false;
                    //clear contributor fields
                    this.addContributor();
                }
            };
            DbEditController.prototype.addContributor = function () {
                this.contributor.doB = new Date(this.contributorBYear, this.contributorBMonth - 1, this.contributorBDay);
                this.contributor.isActive = true;
                this.media.contributors[this.contributorCounter] = this.contributor;
                this.clearContributorFields();
                this.contributorCreated = true;
                this.contributorCounter++;
            };
            DbEditController.prototype.addAnotherContributor = function () {
                //Validate contributor fields:
                if (this.contributor.roles == "" || this.contributor.givenName == "" || this.contributor.surname == "" || this.contributorBYear == "" || this.contributorBMonth == "" || this.contributorBDay == "" || this.contributor.nationality == "") {
                    console.log(this.contributor);
                    this.contributorValidationError = true;
                }
                else {
                    this.contributorValidationError = false;
                    this.addContributor();
                    this.clearContributorFields();
                    this.contributorCreated = false;
                }
            };
            DbEditController.prototype.cancelContributor = function () {
                this.manualAdd = false;
            };
            DbEditController.prototype.searchForContributor = function () {
                var _this = this;
                this.query.searchFor = "People";
                this.MediaService.search(this.query).then(function (data) {
                    _this.cResults = data.cResults;
                    console.log(_this.cResults);
                    //Mark items that have already been added:
                    for (var i = 0; i < _this.cResults.length; i++) {
                        for (var j = 0; j < _this.media.contributors.length; j++) {
                            if (_this.cResults[i].id == _this.media.contributors[j].id) {
                                _this.cResults[i].added = true;
                                console.log('dupe found');
                            }
                        }
                    }
                });
            };
            DbEditController.prototype.addContributorFromDb = function (index) {
                if (!this.manualAdd) {
                    this.contributor = this.cResults[index];
                    this.media.contributors[this.contributorCounter] = this.contributor;
                    this.contributorCounter++;
                    this.cResults[index].added = true;
                    console.log(this.media.contributors);
                }
                else {
                    alert("You must complete or cancel adding a contributor manually first.");
                }
            };
            DbEditController.prototype.removeContributor = function (index) {
                this.media.contributors[index].added = false;
                this.media.contributors.splice(index, 1);
                this.contributorCounter--;
            };
            DbEditController.prototype.setSearchParams = function (parameter, value) {
                if (parameter == 0) {
                    this.contributionQuery.searchFor = value;
                }
                else {
                    this.contributionQuery.searchBy = value;
                }
            };
            DbEditController.prototype.searchContribution = function () {
                var _this = this;
                this.MediaService.search(this.contributionQuery).then(function (data) {
                    _this.mResults = data.results;
                    _this.showMResults = true;
                    console.log(_this.mResults);
                });
            };
            DbEditController.prototype.addContribution = function (index) {
                this.contributor.contributions.push(this.mResults[index]);
                this.mResults[index].added = true;
            };
            DbEditController.prototype.removeContribution = function (index) {
                this.contributor.contributions[index].added = false;
                this.contributor.contributions.splice(index, 1);
            };
            DbEditController.prototype.setManualAdd = function () {
                this.manualAdd = true;
                this.clearContributorFields();
            };
            DbEditController.prototype.showValidationErrors = function () {
                this.validationError = true;
            };
            DbEditController.prototype.clearContributorFields = function () {
                this.contributor = {};
                this.contributorBDay = "";
                this.contributorBMonth = "";
                this.contributorBYear = "";
                this.contributor.roles = "";
                this.contributor.givenName = "";
                this.contributor.surname = "";
                this.contributor.nationality = "";
                this.contributor.websiteUrl = "";
                this.contributor.description = "";
                this.contributor.contributions = [];
            };
            return DbEditController;
        })();
        Controllers.DbEditController = DbEditController;
        angular.module('MyApp').controller('DbEditController', DbEditController);
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
//# sourceMappingURL=dbListController.js.map