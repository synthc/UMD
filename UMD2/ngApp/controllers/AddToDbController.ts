namespace MyApp.Controllers {

    export class AddToDbController {
        //Angular Fields for Media:
        public media;
        public selectedType;
        public year: number;
        public month: number;
        public day: number;
        public duration: number;
        public isAnimation;

        //Angular Fields for Contributor:
        public contributor;
        public contributorBYear;
        public contributorBMonth;
        public contributorBDay;
        public contributorCounter = 0;

        //Switches:
        public manualAdd = false;
        public contributorCreated = false;
        public cont = true;
        public validationError = false;
        public contributorValidationError = false;
        public dateRangeError = false;
        public contributorSelected = false;
        public searchContributions = false;
        public showMResults = false;

        //Other:
        public lastCreated;
        public query;
        public cResults;
        public contributionQuery;
        public mResults;

        constructor(private MediaService: MyApp.Services.MediaService, private $location: angular.ILocationService, private $uibModal: angular.ui.bootstrap.IModalService) {
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
        }

        public createMedia() {
            //Check to make sure there are no unsubmitted contributors:
            if (this.manualAdd && !this.contributorCreated) {
                this.cont = confirm("Your contributor will not be saved unless you click the 'submit contributor' button. \n\nContinue?");
            }
            else {
                this.cont = true;
            }
            if (this.cont) {
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

                if (!this.dateRangeError) {
                    this.media.type = this.selectedType;
                    this.media.isAnimation = JSON.parse(this.isAnimation);
                    this.media.releaseDate = new Date(this.year, this.month, this.day);
                    this.media.duration = Number(this.duration);
                    this.media.isActive = true;
                    this.MediaService.createMedia(this.media).then((data) => {
                        this.MediaService.lastCreated = data;
                        this.$location.path('/addsuccess');
                    });
                }
            }
        }

        public submitContributor() {
            //Validate contributor fields:
            if (this.contributor.roles == "" || this.contributor.givenName == "" || this.contributor.surname == "" || this.contributorBYear == "" || this.contributorBMonth == "" || this.contributorBDay == "" || this.contributor.nationality == "") {
                this.contributorValidationError = true;
            }
            else {
                this.contributorValidationError = false;
                this.manualAdd = false;
                this.addContributor();
            }
        }

        private addContributor() {
            this.contributor.doB = new Date(this.contributorBYear, this.contributorBMonth - 1, this.contributorBDay);
            this.contributor.isActive = true;
            this.media.contributors[this.contributorCounter] = this.contributor;
            this.clearContributorFields();
            this.contributorCreated = true;
            this.contributorCounter++;
        }

        public addAnotherContributor() {
            //Validate contributor fields:
            if (this.contributor.roles == "" || this.contributor.givenName == "" || this.contributor.surname == "" || this.contributorBYear == "" || this.contributorBMonth == "" || this.contributorBDay == "" || this.contributor.nationality == "") {
                this.contributorValidationError = true;
            }
            else {
                this.contributorValidationError = false;
                this.addContributor();
                this.clearContributorFields();
                this.contributorCreated = false;
            }
        }

        public cancelContributor() {
            this.manualAdd = false;
        }

        public searchForContributor() {
            this.query.searchFor = "People";
            this.MediaService.search(this.query).then((data) => {
                this.cResults = data.cResults;
                //Mark items that have already been added:
                for (let i = 0; i < this.cResults.length; i++) {
                    for (let j = 0; j < this.media.contributors.length; j++) {
                        if (this.cResults[i].id == this.media.contributors[j].id) {
                            this.cResults[i].added = true;
                        }
                    }
                }
            });
        }

        public addContributorFromDb(index: number) {
            if (!this.manualAdd) {
                this.contributor = this.cResults[index];
                this.media.contributors[this.contributorCounter] = this.contributor;
                this.contributorCounter++;
                this.cResults[index].added = true;
            }
            else {
                alert("You must complete or cancel adding a contributor manually first.");
            }
        }

        public removeContributor(index: number) {
            this.media.contributors[index].added = false;
            this.media.contributors.splice(index, 1);
            this.contributorCounter--;
        }

        public setSearchParams(parameter: number, value: string) {
            if (parameter == 0) {
                this.contributionQuery.searchFor = value;
            }
            else {
                this.contributionQuery.searchBy = value;
            }
        }

        public searchContribution() {
            this.MediaService.search(this.contributionQuery).then((data) => {
                this.mResults = data.results;
                this.showMResults = true;
            });
        }

        public addContribution(index: number) {
            this.contributor.contributions.push(this.mResults[index]);
            this.mResults[index].added = true;
        }

        public removeContribution(index: number) {
            this.contributor.contributions[index].added = false;
            this.contributor.contributions.splice(index, 1);
        }

        public setManualAdd() {
            this.manualAdd = true;
            this.clearContributorFields();
        }

        public showValidationErrors() {
            this.validationError = true;
        }

        public clearContributorFields() {
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
        }
    }

}