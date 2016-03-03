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

        public changeListVm;
        public addStatus;
        public showListLink;

        public user;
        public isLoggedIn;
        public hasInList;
        public isAdmin;
        public checkListVm;

        constructor(private MediaService: MyApp.Services.MediaService, private accountService: MyApp.Services.AccountService, private $routeParams: ng.route.IRouteParamsService, private $uibModal: angular.ui.bootstrap.IModalService) {
            this.changeListVm = {};
            this.checkListVm = {};
            this.MediaService.getMediaById(this.$routeParams['id']).then((data) => {
                this.media = data;
                this.releaseDate = new Date(this.media.releaseDate);
                this.releaseDate = this.months[this.releaseDate.getMonth()] + " " + this.releaseDate.getDate() + ", " + this.releaseDate.getFullYear();

                this.setUserInfo();

                for (let i = 0; i < this.media.contributors.length; i++) {
                    if (this.media.contributors[i].roles == "Actor") {
                        this.cast.push(this.media.contributors[i]);
                        this.roles.push("Add Role");
                    }
                    else if (this.media.contributors[i].roles == "Director") {
                        this.directors.push(this.media.contributors[i]);
                    }
                    else if (this.media.contributors[i].roles == "Writer") {
                        this.writers.push(this.media.contributors[i]);
                    }
                }
            });
        }

        public setUserInfo() {
            if (this.accountService.isLoggedIn() == null) {
                this.isLoggedIn = false;
            }
            else {
                this.isLoggedIn = true;

                if (this.accountService.getClaim("admin") == null) {
                    this.isAdmin = false;
                }
                else {
                    this.isAdmin = true;
                }

                this.checkMasterlist();
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
                size: "lg"
            });
        }

        public checkMasterlist() {
            this.checkListVm.mediaId = this.media.id;
            this.MediaService.checkMasterlist(this.checkListVm).then((data) => {
                this.hasInList = data.result;
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
    }

}