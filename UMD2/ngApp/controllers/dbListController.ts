namespace MyApp.Controllers {

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
                size: "lg"
            });
        }
    }

    angular.module('MyApp').controller('DbListController', DbListController);

    export class DbEditController {
        public media;
        public contributorVm;
        public isLoggedIn;
        public isAdmin;
        public selectedType;
        public releaseDate;
        public year: number;
        public month: number;
        public day: number;
        public duration: number;
        public isAnimation: string;

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

        constructor(private mediaId, private MediaService: MyApp.Services.MediaService, private accountService: MyApp.Services.AccountService, private $uibModalInstance: angular.ui.bootstrap.IModalServiceInstance, private $routeParams: ng.route.IRouteParamsService) {
            this.media = {};
            this.contributor = {};
            this.contributorVm = {};
            this.media.contributors = [];
            this.setUserInfo();
            console.log(this.isLoggedIn);
            console.log(this.isAdmin);

            this.MediaService.getMediaById(this.mediaId).then((data) => {
                this.media = data;
                //Need logic to do initialized appropriate properties based on media type
                this.selectedType = this.media.type;
                this.releaseDate = new Date(this.media.releaseDate);
                this.year = this.releaseDate.getFullYear();
                this.month = this.releaseDate.getMonth();
                this.day = this.releaseDate.getDay();
                this.isAnimation = this.media.isAnimation.toString();
                this.duration = this.media.duration;
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

            console.log(this.media);

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
                window.location.reload();
            }
        }

        closeModal() {
            this.$uibModalInstance.close();
        }

        public removeContributor(contributorId) {
            this.contributorVm.mediaId = this.media.id;
            this.contributorVm.contributorId = contributorId;
            this.MediaService.removeContributor(this.contributorVm).then(() => {
                this.updateEntry();
            });
        }

        public addContributorFromDb() {
            //this.contributor = contributor from database
            //this.addContributor();
        }

        public addContribution() {
            var contribution; // = get this from the database
            this.media.contributors[this.contributorCounter].contributions.push(contribution);
        }

        public submitContributor() {
            this.manualAdd = false;
            //clear contributor fields
            this.addContributor();
        }

        public addAnotherContributor() {
            //clear fields
            //this.createContributor();
            this.contributorCreated = false;
        }

        private addContributor() {
            //console.log("c count: " + this.contributorCounter);
            //console.log(this.contributor);
            //this.media.contributors[this.contributorCounter] = this.contributor;
            //this.media.contributors[this.contributorCounter].doB = new Date(this.contributorBYear, this.contributorBMonth, this.contributorBDay);
            //console.log(this.media.contributors);
            //this.clearContributorFields();
            //this.contributorCreated = true;
            //this.contributorCounter++;
            this.contributor.doB = new Date(this.contributorBYear, this.contributorBMonth, this.contributorBDay);
            this.contributorVm.mediaId = this.media.id;
            this.contributorVm.contributor = this.contributor;
            this.MediaService.addContributor(this.contributorVm).then(() => {
                this.contributorCreated = true;
            });

        }

        public clearContributorFields() {
            this.contributor = {};
            this.contributorBDay = "";
            this.contributorBMonth = "";
            this.contributorBYear = "";
            this.contributor.roles = "";
            this.contributor.givenName = "";
            this.contributor.surName = "";
            this.contributor.nationality = "";
            this.contributor.websiteUrl = "";
            this.contributor.description = "";
            this.contributor.contributions = [];
        }
    }

    angular.module('MyApp').controller('DbEditController', DbEditController);

}