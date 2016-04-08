var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var AddToDbController = (function () {
            function AddToDbController(MediaService, $location, $uibModal) {
                this.MediaService = MediaService;
                this.$location = $location;
                this.$uibModal = $uibModal;
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
                this.contributor.contributions = [];
                this.media.contributors = [];
                this.query = {};
                this.query.query = "";
                this.contributionQuery = {};
                this.contributionQuery.query = "";
                this.contributionQuery.searchFor = "All";
                this.contributionQuery.searchBy = "Title";
                //Define contributor object:
                this.clearContributorFields();
                //console.log(this.lastCreated);
            }
            AddToDbController.prototype.createMedia = function () {
                var _this = this;
                //Check to make sure there are no unsubmitted contributors:
                if (this.manualAdd && !this.contributorCreated) {
                    this.cont = confirm("Your contributor will not be saved unless you click the 'submit contributor' button. \n\nContinue?");
                }
                else {
                    this.cont = true;
                }
                if (this.cont) {
                    //console.log(this.media.contributors);
                    this.year = Number(this.year);
                    this.month = Number(this.month) - 1;
                    this.day = Number(this.day);
                    //Validate dates:
                    if (this.year > 2100 || this.year < 1753) {
                        this.dateRangeError = true;
                    }
                    else if (this.month > 11 || this.month < 1) {
                        this.dateRangeError = true;
                    }
                    else if (this.day > 31 || this.day < 1) {
                        this.dateRangeError = true;
                    }
                    else {
                        this.dateRangeError = false;
                    }
                    console.log(this.dateRangeError);
                    if (!this.dateRangeError) {
                        this.media.type = this.selectedType;
                        this.media.isAnimation = JSON.parse(this.isAnimation);
                        this.media.releaseDate = new Date(this.year, this.month, this.day);
                        this.media.duration = Number(this.duration);
                        this.media.isActive = true;
                        console.log(this.media);
                        this.MediaService.createMedia(this.media).then(function (data) {
                            _this.MediaService.lastCreated = data;
                            console.log(_this.MediaService.lastCreated);
                            _this.$location.path('/addsuccess');
                            //console.log(this.MediaService.lastCreated);
                        });
                    }
                }
            };
            AddToDbController.prototype.submitContributor = function () {
                //Validate contributor fields:
                if (this.contributor.roles == "" || this.contributor.givenName == "" || this.contributor.surname == "" || this.contributorBYear == "" || this.contributorBMonth == "" || this.contributorBDay == "" || this.contributor.nationality == "") {
                    console.log(this.contributor);
                    this.contributorValidationError = true;
                }
                else {
                    this.contributorValidationError = false;
                    this.manualAdd = false;
                    this.addContributor();
                }
            };
            AddToDbController.prototype.addContributor = function () {
                this.contributor.doB = new Date(this.contributorBYear, this.contributorBMonth - 1, this.contributorBDay);
                this.contributor.isActive = true;
                this.media.contributors[this.contributorCounter] = this.contributor;
                this.clearContributorFields();
                this.contributorCreated = true;
                this.contributorCounter++;
            };
            AddToDbController.prototype.addAnotherContributor = function () {
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
            AddToDbController.prototype.cancelContributor = function () {
                this.manualAdd = false;
            };
            AddToDbController.prototype.searchForContributor = function () {
                var _this = this;
                this.query.searchFor = "People";
                this.MediaService.search(this.query).then(function (data) {
                    _this.cResults = data.cResults;
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
            AddToDbController.prototype.addContributorFromDb = function (index) {
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
            AddToDbController.prototype.removeContributor = function (index) {
                this.media.contributors[index].added = false;
                this.media.contributors.splice(index, 1);
                this.contributorCounter--;
                console.log(this.media.contributors);
            };
            AddToDbController.prototype.setSearchParams = function (parameter, value) {
                if (parameter == 0) {
                    this.contributionQuery.searchFor = value;
                }
                else {
                    this.contributionQuery.searchBy = value;
                }
            };
            AddToDbController.prototype.searchContribution = function () {
                var _this = this;
                this.MediaService.search(this.contributionQuery).then(function (data) {
                    _this.mResults = data.results;
                    _this.showMResults = true;
                });
            };
            AddToDbController.prototype.addContribution = function (index) {
                this.contributor.contributions.push(this.mResults[index]);
                this.mResults[index].added = true;
            };
            AddToDbController.prototype.removeContribution = function (index) {
                this.contributor.contributions[index].added = false;
                this.contributor.contributions.splice(index, 1);
            };
            AddToDbController.prototype.setManualAdd = function () {
                this.manualAdd = true;
                this.clearContributorFields();
            };
            AddToDbController.prototype.showValidationErrors = function () {
                this.validationError = true;
            };
            AddToDbController.prototype.clearContributorFields = function () {
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
            return AddToDbController;
        })();
        Controllers.AddToDbController = AddToDbController;
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
//# sourceMappingURL=AddToDbController.js.map