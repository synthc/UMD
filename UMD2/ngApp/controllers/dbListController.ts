namespace MyApp.Controllers {

    //This controller is currently unused:
    export class DbListController {
        public media;
        public medias;

        constructor(private MediaService: MyApp.Services.MediaService, private $uibModal: angular.ui.bootstrap.IModalService, private $location: angular.ILocationService) {
            this.MediaService.getMedia().then((data) => {
                this.medias = data;
            })
        }

        public openEditModal(id) {
            this.$uibModal.open({
                templateUrl: 'ngApp/views/Modals/dbEditModal.html',
                controller: DbEditController,
                controllerAs: 'vm',
                resolve: {
                    mediaId: () => id
                },
                backdrop: 'static',
                keyboard: false,
                size: "lg"
            });
        }
    }

    angular.module('MyApp').controller('DbListController', DbListController);

    //TODO: move this controller into its own file
    export class DbEditController {
        //Angular Fields for Media:
        public media;
        public releaseDate;
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
        public isLoggedIn;
        public isAdmin;
        public lastCreated;
        public query;
        public cResults;
        public contributionQuery;
        public mResults;

        constructor(private mediaId, private MediaService: MyApp.Services.MediaService, private accountService: MyApp.Services.AccountService, private $uibModalInstance: angular.ui.bootstrap.IModalServiceInstance, private $routeParams: ng.route.IRouteParamsService) {
            this.media = {};
            this.contributor = {};
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

            this.MediaService.getMediaById(this.mediaId).then((data) => {
                this.media = data;
                //Need logic to initialize appropriate properties based on media type
                this.selectedType = this.media.type;
                this.releaseDate = new Date(this.media.releaseDate);
                this.year = this.releaseDate.getFullYear();
                this.month = this.releaseDate.getMonth();
                this.day = this.releaseDate.getDate();
                this.isAnimation = this.media.isAnimation.toString();
                this.duration = this.media.duration;
                this.contributorCounter = this.media.contributors.length;
            });
        }

        public updateEntry() {
            this.media.type = this.selectedType;
            this.media.isAnimation = JSON.parse(this.isAnimation);
            this.media.year = Number(this.year);
            this.media.month = Number(this.month);
            this.media.day = Number(this.day);
            this.media.releaseDate = new Date(this.media.year, this.media.month, this.media.day);
            this.media.duration = Number(this.duration);
            this.media.contributorCreated = this.contributorCreated;
            this.media.isActive = true;

            this.MediaService.createMedia(this.media).then(() => {
                window.location.reload();
            });
        }

        public setUserInfo() {
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
        }

        public deleteRestore() {
            this.media.deleteRestore = true;
            this.MediaService.createMedia(this.media);
            this.closeModal();
            window.location.reload();
        }

        public hardDelete() {
            let cont = confirm("This entry will be permanently deleted from the database. Continue?");
            if (cont) {
                this.MediaService.deleteMedia(this.media.id);
                this.closeModal();
                window.history.back();
                window.location.reload();
            }
        }

        closeModal() {
            this.$uibModalInstance.close();
        }

        public submitContributor() {
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
                console.log(this.contributor);
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

    angular.module('MyApp').controller('DbEditController', DbEditController);

}