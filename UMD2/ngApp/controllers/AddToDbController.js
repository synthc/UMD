var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var AddToDbController = (function () {
            function AddToDbController(MediaService, $location) {
                this.MediaService = MediaService;
                this.$location = $location;
                this.contributorCounter = 0;
                //Switches:
                this.manualAdd = false;
                this.contributorCreated = false;
                this.cont = true;
                this.media = {};
                this.contributor = {};
                this.media.contributors = [];
                //Define contributor object:
                this.contributor.roles = "";
                this.contributor.givenName = "";
                this.contributor.surName = "";
                this.contributor.nationality = "";
                this.contributor.websiteUrl = "";
                this.contributor.description = "";
                this.contributor.contributions = [];
            }
            AddToDbController.prototype.createMedia = function () {
                if (this.manualAdd && !this.contributorCreated) {
                    this.cont = confirm("Your contributor will not be saved unless you click the 'submit contributor' button. \n\nContinue?");
                }
                if (this.cont) {
                    console.log(this.year, this.month, this.day, this.duration);
                    this.media.type = this.selectedType;
                    this.media.isAnimation = JSON.parse(this.isAnimation);
                    this.year = Number(this.year);
                    this.month = Number(this.month);
                    this.day = Number(this.day);
                    this.media.releaseDate = new Date(this.year, this.month, this.day);
                    this.media.duration = Number(this.duration);
                    this.media.isActive = true;
                    this.MediaService.createMedia(this.media);
                    this.$location.path('/addsuccess');
                }
            };
            AddToDbController.prototype.addContributorFromDb = function () {
                //this.contributor = contributor from database
                //this.addContributor();
            };
            AddToDbController.prototype.addContribution = function () {
                var contribution; // = get this from the database
                this.media.contributors[this.contributorCounter].contributions.push(contribution);
            };
            AddToDbController.prototype.submitContributor = function () {
                this.manualAdd = false;
                //clear contributor fields
                this.addContributor();
            };
            AddToDbController.prototype.addAnotherContributor = function () {
                //clear fields
                //this.createContributor();
                this.contributorCreated = false;
            };
            AddToDbController.prototype.addContributor = function () {
                this.media.contributors[this.contributorCounter] = this.contributor;
                this.media.contributors[this.contributorCounter].doB = new Date(this.contributorBYear, this.contributorBMonth, this.contributorBDay);
                this.contributorCreated = true;
                this.contributorCounter++;
            };
            return AddToDbController;
        })();
        Controllers.AddToDbController = AddToDbController;
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
//# sourceMappingURL=AddToDbController.js.map