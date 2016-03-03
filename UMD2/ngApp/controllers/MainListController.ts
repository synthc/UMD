namespace MyApp.Controllers {

    export class MainListController {
        public user;
        public masterList;
        public statusVerb;
        public listEmpty;
        public changeListVm;

        constructor(private $uibModal: angular.ui.bootstrap.IModalService, private MediaService: MyApp.Services.MediaService, private $location: angular.ILocationService) {
            this.changeListVm = {};
            this.MediaService.getUser("thisUser").then((data) => {
                this.user = data;
                this.masterList = this.user.masterList;

                if (this.masterList.length == 0) {
                    this.listEmpty = true;
                }

                //Get UserMedia for each media in the user's masterlist and add its data to the view model:
                for (let j = 0; j < this.masterList.length; j++) {
                    let i = 0;
                    let quit = false;
                    while (!quit && i < this.masterList[j].userMedias.length) {
                        if (this.masterList[j].userMedias[i].ownerId == this.user.id) {
                            this.masterList[j].rating = this.masterList[j].userMedias[i].rating;
                            //let defaultDate = new Date(1800, 1, 1);
                            let startDate = new Date(this.masterList[j].userMedias[i].startDate);
                            if (startDate.getFullYear() != 1800){
                                this.masterList[j].startDateYear = startDate.getFullYear();
                                this.masterList[j].startDateMonth = startDate.getMonth() + 1;
                                this.masterList[j].startDateDay = startDate.getDate();
                            }
                            let endDate = new Date(this.masterList[j].userMedias[i].endDate);
                            if (endDate.getFullYear() != 1800) {
                                this.masterList[j].endDateYear = endDate.getFullYear();
                                this.masterList[j].endDateMonth = endDate.getMonth() + 1;
                                this.masterList[j].endDateDay = endDate.getDate();
                            }
                            this.masterList[j].tags = this.masterList[j].userMedias[i].tags;
                            this.masterList[j].reValue = this.masterList[j].userMedias[i].reValue;
                            this.masterList[j].reCount = this.masterList[j].userMedias[i].reCount;

                            if (this.masterList[j].type == "movie" || this.masterList[j].type == "series") {
                                this.statusVerb = "Watch";
                            }
                            else if (this.masterList[j].type == "game") {
                                this.statusVerb = "Play";
                            }
                            else if (this.masterList[j].type == "book") {
                                this.statusVerb = "Read";
                            }

                            if (this.masterList[j].userMedias[i].status == "past") {
                                this.masterList[j].status = "Completed";
                            }
                            else if (this.masterList[j].userMedias[i].status == "present") {
                                this.masterList[j].status = this.statusVerb + "ing";
                            }
                            else if (this.masterList[j].userMedias[i].status == "future") {
                                this.masterList[j].status = "Plan to " + this.statusVerb;
                            }

                            quit = true;
                        }
                        i++;
                    }
                }
            });
        }

        public edit(mediaId) {
            this.$uibModal.open({
                templateUrl: 'ngApp/views/masterlistEditModal.html',
                controller: MyApp.Controllers.MasterlistEditController,
                controllerAs: 'vm',
                resolve: {
                    mediaId: () => mediaId,
                    userId: () => this.user.id
                },
                backdrop: 'static',
                size: 'lg',
            });
        }

        public remove(mediaId) {
            this.changeListVm.mediaId = mediaId;
            this.changeListVm.mode = "remove";
            this.MediaService.changeList(this.changeListVm).then((data) => {
                window.location.reload();
            })
        }
    }

    export class MasterlistEditController {
        public media;
        public userMedia;
        public rating;
        public status;
        public tags;
        public startDateYear;
        public startDateMonth;
        public startDateDay;
        public endDateYear;
        public endDateMonth;
        public endDateDay;
        public reCount;
        public reValue;
        public statusVerb;

        constructor(public mediaId, public userId, private $uibModalInstance: angular.ui.bootstrap.IModalServiceInstance, private MediaService: MyApp.Services.MediaService) {
            this.media = {};
            this.media.userMedias = [];     

            this.MediaService.getMediaById(mediaId).then((data) => {
                this.media = data;
                if (this.media.type == "movie" || this.media.type == "series") {
                    this.statusVerb = "Watch";
                }
                else if (this.media.type == "game") {
                    this.statusVerb = "Play";
                }
                else if (this.media.type == "book") {
                    this.statusVerb = "Read";
                }

                let i = 0;
                let quit = false;
                while (!quit && i < this.media.userMedias.length) {
                    if (this.media.userMedias[i].ownerId == this.userId) {
                        this.userMedia = this.media.userMedias[i];
                        quit = true;
                    }
                    i++;
                }

                //If inactive, set default values:
                if (!this.userMedia.isActive) {
                    this.startDateYear = 2015;
                    this.startDateMonth = 1;
                    this.startDateDay = 1;
                    this.endDateYear = 2015;
                    this.endDateMonth = 1;
                    this.endDateDay = 1; 
                }
                //Otherwise, load existing values:
                else {
                    this.rating = this.userMedia.rating.toString();
                    this.status = this.userMedia.status;
                    let startDate = new Date(this.userMedia.startDate);
                    this.startDateYear = startDate.getFullYear();
                    this.startDateMonth = startDate.getMonth() + 1;
                    this.startDateDay = startDate.getDate();
                    let endDate = new Date(this.userMedia.endDate);
                    this.endDateYear = endDate.getFullYear();
                    this.endDateMonth = endDate.getMonth() + 1;
                    this.endDateDay = endDate.getDate();
                    this.tags = this.userMedia.tags;
                    this.reValue = this.userMedia.reValue.toString();
                    this.reCount = this.userMedia.reCount;
                }
            });
        }

        public submit() {
            this.userMedia = {};
            this.userMedia.mediaId = this.media.id;
            this.userMedia.rating = Number(this.rating);
            this.userMedia.status = this.status;
            this.userMedia.tags = this.tags;
            this.userMedia.startDate = new Date(this.startDateYear, this.startDateMonth - 1, this.startDateDay);
            this.userMedia.endDate = new Date(this.endDateYear, this.endDateMonth - 1, this.endDateDay);
            this.userMedia.reCount = Number(this.reCount);
            this.userMedia.reValue = Number(this.reValue);
            this.MediaService.updateUserMedia(this.userMedia).then(() => {
                window.location.reload();
            });
        }

        public close() {
            this.$uibModalInstance.close();
        }


    }
}
