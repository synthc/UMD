namespace MyApp.Controllers {

    export class EntryController {
        public media;
        public medias;
        public releaseDate;
        public months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        public cast = [];
        public roles = [];
        public directors = [];
        public writers = [];
        public otherContributors = [];
        public hasStaff;

        public changeListVm;
        public addStatus;
        public showListLink;
        public reviewVm;
        public reviews;
        public showReviewError;
        public notFound = false;
        public showInactiveMessage = false;
        public showInactiveIndicator = false;

        public user;
        public isLoggedIn;
        public hasInList;
        public hasReviewed;
        public isAdmin;
        public checkListVm;

        constructor(private MediaService: MyApp.Services.MediaService, private accountService: MyApp.Services.AccountService, private $routeParams: ng.route.IRouteParamsService, private $uibModal: angular.ui.bootstrap.IModalService, private $location: angular.ILocationService) {
            this.changeListVm = {};
            this.checkListVm = {};
            this.reviewVm = {};
            this.setUserInfo();

            this.MediaService.getMediaById(this.$routeParams['id']).then((data) => {
                this.media = data;

                //If media exists:
                if (this.media.id != undefined) {
                    if (this.isLoggedIn) {
                        this.checkMasterlist();
                    }

                    //If media is inactive and the user is not admin, hide the page:
                    if (!this.media.isActive && !this.isAdmin) {
                        this.showInactiveMessage = true;
                    }
                    //Else if the user is admin and the media is inactive, show an inactive indicator:
                    else {
                        if (!this.media.isActive) {
                            this.showInactiveIndicator = true;
                        }
                        this.releaseDate = new Date(this.media.releaseDate);
                        this.releaseDate = this.months[this.releaseDate.getMonth()] + " " + this.releaseDate.getDate() + ", " + this.releaseDate.getFullYear();

                        //Separate contributors by type:
                        for (let i = 0; i < this.media.contributors.length; i++) {
                            if (this.media.contributors[i].roles == "Actor") {
                                this.cast.push(this.media.contributors[i]);
                                this.roles.push("Add Role");
                            }
                            else if (this.media.contributors[i].roles == "Director") {
                                this.directors.push(this.media.contributors[i]);
                                this.hasStaff = true;
                            }
                            else if (this.media.contributors[i].roles == "Writer") {
                                this.writers.push(this.media.contributors[i]);
                                this.hasStaff = true;
                            }
                            else {
                                this.otherContributors.push(this.media.contributors[i]);
                            }
                        }
                    }
                }
                else {
                    this.notFound = true;
                }
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

        public checkMasterlist() {
            this.checkListVm.mediaId = this.media.id;
            this.MediaService.checkMasterlist(this.checkListVm).then((data) => {
                this.hasInList = data.result;
                this.hasReviewed = data.secondaryResult;
            });
        }

        public addToList() {
            this.changeListVm.mediaId = this.media.id;
            this.changeListVm.mode = "add";
            this.MediaService.changeList(this.changeListVm).then((data) => {
                this.addStatus = data.message;
                if (this.addStatus == "Success.") {
                    this.hasInList = true;
                    this.showListLink = true;
                }
            });
        }

        public removeFromList() {
            this.changeListVm.mediaId = this.media.id;
            this.changeListVm.mode = "remove";
            this.MediaService.changeList(this.changeListVm).then((data) => {
                if (!data.error) {
                    this.hasInList = false;
                    this.showListLink = false;
                }
            });
        }

        public writeReview() {
            if (!this.isLoggedIn) {
                this.$location.path('/register');
            }
            else if (!this.hasInList) {
                this.showReviewError = true;
            }
            else {
                this.$location.path('/review/' + this.media.id);
            }
        }

        public editReview() {
            this.$location.path('/review/' + this.media.id);
        }

        public deleteReview() {
            this.reviewVm.mediaId = this.media.id;
            let cont = confirm("Are you sure?");
            if (cont) {
                this.MediaService.deleteReview(this.reviewVm).then(() => {
                    window.location.reload();
                });
            }
        }

        //public getReviews() {
        //    this.reviewVm.mediaId = this.media.id;
        //    this.MediaService.getReviews(this.reviewVm).then((data) => {
        //        this.reviews = data.reviews;
        //        console.log(data);
        //        //console.log(this.reviews);
        //    });
        //}
    }

}